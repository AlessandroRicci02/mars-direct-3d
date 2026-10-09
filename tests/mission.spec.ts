import { test, expect } from '@playwright/test'
import { stages } from '../src/data/mission'

test('all ten chapters render, navigation works, and WebGL remains active', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'The road',
  )
  await page.waitForTimeout(3200)
  await page.screenshot({ path: 'artifacts/01-introduction.png' })
  await page.getByRole('button', { name: 'Begin the journey' }).click()
  for (let i = 1; i < stages.length; i++) {
    await expect(page.locator('.experience')).toHaveAttribute(
      'data-stage',
      String(i),
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      stages[i].title,
    )
    await expect(
      page.getByRole('button', {
        name: `Chapter ${i + 1}: ${stages[i].short}`,
        exact: true,
      }),
    ).toHaveAttribute('aria-current', 'step')
    await expect(page.locator('canvas')).toBeVisible()
    await page.waitForTimeout(3000)
    await page.screenshot({ path: `artifacts/chapter-${i}.png` })
    if (i < 9)
      await page
        .getByRole('button', { name: 'Next chapter', exact: true })
        .click()
  }
  await page.getByRole('button', { name: 'Continue beyond Mars' }).click()
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-section',
    'beyond',
  )
  await page.getByRole('button', { name: 'The mission', exact: true }).click()
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '0')
  await page
    .getByRole('button', { name: 'Chapter 8: Explore Mars', exact: true })
    .click()
  await page.getByRole('button', { name: 'Previous chapter' }).click()
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '6')
  await page
    .getByRole('button', { name: 'Previous chapter' })
    .evaluate((button) => (button as HTMLButtonElement).blur())
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '5')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '6')
  expect(errors).toEqual([])
})

test('scene controls, mission notes, and autoplay are usable', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Resume animation', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  const before = await page
    .locator('.chapter-progress > div')
    .getAttribute('style')
  await page.waitForTimeout(400)
  expect(
    await page.locator('.chapter-progress > div').getAttribute('style'),
  ).toBe(before)
  await page.getByRole('button', { name: 'Hide labels', exact: true }).click()
  await expect(page.locator('.scene-label')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show labels', exact: true }).click()
  await expect(page.locator('.scene-label').first()).toBeVisible()
  await page
    .getByRole('button', { name: 'The architecture', exact: false })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'A simpler way to Mars.' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Resume animation', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Replay chapter and reset camera' })
    .click()
  await expect(
    page.getByRole('button', { name: 'Pause animation', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Autoplay', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Autoplay on' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '1', {
    timeout: 25000,
  })
  await page.getByRole('button', { name: 'Autoplay on' }).click()
  await page
    .getByRole('button', { name: 'Chapter 5: Make fuel', exact: true })
    .click()
  await expect(
    page.getByText('Fueled before the crew leaves Earth.'),
  ).toBeVisible({ timeout: 20000 })
  await page.getByRole('button', { name: 'Inside this chapter' }).click()
  await expect(page.getByText('1. Sabatier reaction')).toBeVisible()
})

test('mobile viewport keeps navigation reachable without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForTimeout(3200)
  await page.screenshot({
    path: 'artifacts/mobile-introduction.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Begin the journey' }).click()
  await page
    .getByRole('button', { name: 'Chapter 8: Explore Mars', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'A small base.',
  )
  await page.waitForTimeout(3200)
  await page.screenshot({
    path: 'artifacts/mobile-surface.png',
    fullPage: true,
  })
  await page.getByRole('button', { name: 'Previous chapter' }).click()
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '6')
})

test('drag changes the camera and the return sequence ends at Earth', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await page.waitForTimeout(3000)
  const before = await page.locator('canvas').screenshot()
  await page.mouse.move(950, 350)
  await page.mouse.down()
  await page.mouse.move(1070, 400, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(500)
  expect((await page.locator('canvas').screenshot()).equals(before)).toBe(false)
  await page
    .getByRole('button', { name: 'Chapter 9: Come home', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Replay chapter and reset camera' })
    .click()
  await page.waitForTimeout(19000)
  await expect(page.locator('.scene-label.blue')).toBeVisible()
  const earth = await page.locator('.scene-label.blue').boundingBox()
  expect(earth!.x).toBeGreaterThan(720)
  await page.screenshot({ path: 'artifacts/return-to-earth.png' })
})
