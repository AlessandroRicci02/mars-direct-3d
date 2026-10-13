import { test, expect } from '@playwright/test'
import { propulsionProgress, propulsionTime } from '../src/data/propulsion'

test('illustrative propulsion separates NTP, chemical and NEP and holds arrivals', () => {
  for (let time = 0.1; time < 9; time += 0.1) {
    expect(propulsionProgress('ntp', time)).toBeGreaterThan(
      propulsionProgress('chemical', time),
    )
    expect(propulsionProgress('chemical', time)).toBeGreaterThan(
      propulsionProgress('nep', time),
    )
  }
  expect(propulsionProgress('ntp', 9)).toBe(1)
  expect(propulsionProgress('chemical', 9)).toBeLessThan(1)
  expect(propulsionProgress('chemical', 14)).toBe(1)
  expect(propulsionProgress('nep', 14)).toBeLessThan(1)
  for (const kind of ['ntp', 'chemical', 'nep'] as const) {
    expect(propulsionProgress(kind, 0)).toBe(0)
    expect(propulsionProgress(kind, 21)).toBe(1)
    expect(propulsionProgress(kind, 60)).toBe(1)
  }
  expect(propulsionTime(0, true)).toBe(propulsionTime(15, true))
})

test('shared departure, pause, held arrivals and replay are visible in the comparison', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await page.locator('.timeline-step').nth(8).click()
  const progress = async (kind: string) =>
    Number(
      await page
        .locator(`.propulsion-results [data-engine="${kind}"]`)
        .getAttribute('data-progress'),
    )
  await expect.poll(() => progress('ntp')).toBeGreaterThan(0.35)
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await page.waitForTimeout(150)
  const stopped = await progress('ntp')
  expect(stopped).toBeGreaterThan(await progress('chemical'))
  expect(await progress('chemical')).toBeGreaterThan(await progress('nep'))
  await page.waitForTimeout(500)
  expect(await progress('ntp')).toBe(stopped)
  await page.getByRole('button', { name: 'NTP', exact: true }).click()
  expect(await progress('ntp')).toBe(stopped)
  await page.getByRole('button', { name: 'Compare all', exact: true }).click()
  await page
    .getByRole('button', { name: 'Resume animation', exact: true })
    .click()
  await expect(page.locator('[data-engine="ntp"]')).toHaveAttribute(
    'data-arrived',
    'true',
  )
  expect(await progress('chemical')).toBeLessThan(1)
  await expect(page.locator('[data-engine="chemical"]')).toHaveAttribute(
    'data-arrived',
    'true',
  )
  expect(await progress('nep')).toBeLessThan(1)
  await expect(page.locator('[data-engine="nep"]')).toHaveAttribute(
    'data-arrived',
    'true',
  )
  await page.waitForTimeout(1000)
  expect(await progress('ntp')).toBe(1)
  await page
    .getByRole('button', { name: 'Replay chapter and reset camera' })
    .click()
  expect(await progress('ntp')).toBeLessThan(0.15)
})

test('Focus 3D clears overlays, keeps controls and restores reading and labels on mobile', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('.timeline-step').nth(4).click()
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Focus 3D: hide interface', exact: true })
    .click()
  await expect(page.locator('.story')).not.toBeVisible()
  await expect(page.locator('.fuel-panel')).not.toBeVisible()
  await expect(page.locator('.mission-footer')).toHaveAttribute('inert', '')
  await expect(page.locator('.scene-label')).toHaveCount(0)
  const canvas = await page.locator('canvas').boundingBox()
  expect(canvas!.height).toBe(844)
  await expect(
    page.getByRole('button', { name: 'Next chapter', exact: true }),
  ).toBeInViewport()
  await expect(
    page.getByRole('button', { name: 'Show interface', exact: true }),
  ).toBeInViewport()
  await page.getByRole('button', { name: 'Show labels', exact: true }).click()
  await expect(page.locator('.scene-label').first()).toBeVisible()
  await expect(page.locator('.scene-labels')).toHaveCSS('clip-path', 'none')
  await page.getByRole('button', { name: 'Next chapter', exact: true }).click()
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '5')
  await page.keyboard.press('h')
  await expect(page.locator('.story')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Resume animation', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Hide labels', exact: true }),
  ).toBeVisible()
  await page.keyboard.press('h')
  await page.setViewportSize({ width: 844, height: 390 })
  await page.waitForTimeout(3000)
  await expect(
    page.getByRole('button', { name: 'Show interface', exact: true }),
  ).toBeInViewport()
  await expect(
    page.getByRole('button', { name: 'Next chapter', exact: true }),
  ).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-focus',
    'false',
  )
  expect(errors).toEqual([])
})

test('AI humanoid work and human possibilities are distinct selectable scenes', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await page.locator('.timeline-step').nth(6).click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'AI HUMANOID' }),
  ).toHaveCount(1)
  await page.getByRole('button', { name: 'Maintenance', exact: true }).click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'INSPECT' }),
  ).toHaveCount(1)
  await expect(page.locator('.beyond-panel')).toContainText('local autonomy')
  await page
    .getByRole('button', { name: 'Human possibilities', exact: true })
    .click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'SCIENCE' }),
  ).toHaveCount(1)
  await expect(
    page.locator('.scene-label').filter({ hasText: 'AI HUMANOID' }),
  ).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Cargo handling', exact: true })
    .click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'AI HUMANOID' }),
  ).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Inside this chapter', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toContainText(
    'Valkyrie is a research platform',
  )
  await page.keyboard.press('Escape')
  await page
    .getByRole('button', { name: 'Focus 3D: hide interface', exact: true })
    .click()
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'artifacts/robots-focus-validated.png' })
  expect(errors).toEqual([])
})

test('reduced-motion comparison retains a clear static ordering', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await page.locator('.timeline-step').nth(8).click()
  await expect(page.locator('.propulsion-readout')).toContainText(
    'STATIC COMPARISON',
  )
  const ntp = page.locator('[data-engine="ntp"]')
  await expect(ntp).toHaveAttribute('data-progress', '0.6667')
  await page.waitForTimeout(750)
  await expect(ntp).toHaveAttribute('data-progress', '0.6667')
})

test('mobile propulsion labels stay above the explanation panel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await page.locator('.timeline-step').nth(8).click()
  await page.waitForTimeout(3100)
  const panel = await page.locator('.beyond-panel').boundingBox()
  const story = await page.locator('.story').boundingBox()
  for (const name of ['CHEMICAL /', 'NTP /', 'NEP /']) {
    const label = await page
      .locator('.scene-label')
      .filter({ hasText: name })
      .boundingBox()
    expect(label!.y).toBeGreaterThan(story!.y + story!.height)
    expect(label!.y + label!.height).toBeLessThan(panel!.y)
  }
  await page.screenshot({
    path: 'artifacts/propulsion-mobile-validated.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect
    .poll(async () => {
      const active = await page.locator('.timeline-step.active').boundingBox()
      const timeline = await page.locator('.timeline').boundingBox()
      return (
        active!.x >= timeline!.x - 1 &&
        active!.x + active!.width <= timeline!.x + timeline!.width + 1
      )
    })
    .toBe(true)
})
