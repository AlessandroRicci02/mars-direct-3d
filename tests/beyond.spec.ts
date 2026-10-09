import { test, expect } from '@playwright/test'
import { beyondStages } from '../src/data/beyond'
import {
  orbitPosition,
  transferPoint,
  EARTH_PERIOD,
  MARS_PERIOD,
  missionDays,
  transferDuration,
} from '../src/data/orbitalMotion'
import { SUN } from '../src/data/solarSystem'

test('accelerated orbits meet the future destination in the same direction', () => {
  for (const index of [2, 6, 8]) {
    const returning = index === 8
    const days = missionDays(index, 1, 0)
    const destination = orbitPosition(
      returning ? 'earth' : 'mars',
      days,
      returning,
      transferDuration(index),
    )
    expect(transferPoint(1, returning).distanceTo(destination)).toBeLessThan(
      0.00001,
    )
  }
  for (const returning of [false, true]) {
    expect(
      transferPoint(0, returning).distanceTo(
        orbitPosition(returning ? 'mars' : 'earth', 0, returning),
      ),
    ).toBeLessThan(0.00001)
    expect(
      transferPoint(1, returning).distanceTo(
        orbitPosition(returning ? 'earth' : 'mars', 180, returning),
      ),
    ).toBeLessThan(0.00001)
    expect(
      transferPoint(1, returning).distanceTo(
        orbitPosition(returning ? 'earth' : 'mars', 0, returning),
      ),
    ).toBeGreaterThan(10)
  }
  const angle = (kind: 'earth' | 'mars') =>
    orbitPosition(kind, 1).sub(SUN).angleTo(orbitPosition(kind, 0).sub(SUN))
  expect(angle('earth') / angle('mars')).toBeCloseTo(
    MARS_PERIOD / EARTH_PERIOD,
    6,
  )
})

test('all Beyond Mars chapters, options and responsive scenes work', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (e) => {
    if (e.type() === 'error') errors.push(e.text())
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await expect(page.locator('.timeline-step')).toHaveCount(11)
  for (let i = 0; i < beyondStages.length; i++) {
    await page.locator('.timeline-step').nth(i).click()
    await expect(page.locator('h1')).toContainText(beyondStages[i].title)
    await expect(page.locator('.epistemic-tag')).toHaveText(
      beyondStages[i].status!,
    )
    await page.waitForTimeout(3100)
    if (i === 2)
      await page.getByRole('button', { name: 'Industry', exact: true }).click()
    if (i === 2) await page.waitForTimeout(1400)
    if (i === 10) await page.waitForTimeout(6500)
    await page.screenshot({ path: `artifacts/beyond-${i}.png` })
    const choices = page.locator('.chapter-options button')
    for (let j = 0; j < (await choices.count()); j++) {
      await choices.nth(j).click()
      await expect(choices.nth(j)).toHaveAttribute('aria-pressed', 'true')
      await page.waitForTimeout(100)
    }
    await page.getByRole('button', { name: 'Inside this chapter' }).click()
    await expect(page.getByRole('dialog')).toContainText(beyondStages[i].detail)
    await page.getByRole('button', { name: 'Close dialog' }).click()
  }
  for (const [w, h, i] of [
    [390, 844, 2],
    [390, 844, 8],
    [1024, 768, 10],
    [844, 390, 5],
  ]) {
    await page.setViewportSize({ width: w, height: h })
    await page.locator('.timeline-step').nth(i).click()
    await page.waitForTimeout(3100)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.screenshot({
      path: `artifacts/beyond-${i}-${w}.png`,
      fullPage: true,
    })
  }
  expect(errors).toEqual([])
})

test('planets visibly move, pause holds them, and historical facts remain explicit', async ({
  page,
}) => {
  await page.goto('/')
  const earth = page.locator('.scene-label.blue')
  await page.waitForTimeout(3500)
  const start = await earth.boundingBox()
  await page.waitForTimeout(2200)
  const moved = await earth.boundingBox()
  expect(Math.hypot(moved!.x - start!.x, moved!.y - start!.y)).toBeGreaterThan(
    3,
  )
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  // Let the final queued projection frame settle after React commits pause.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  const stopped = await earth.boundingBox()
  await page.waitForTimeout(500)
  expect(await earth.boundingBox()).toEqual(stopped)
  await page.locator('.timeline-step').nth(4).click()
  await expect(page.locator('.fuel-panel')).toContainText('100 kW')
  await expect(page.locator('.fuel-panel')).toContainText('~6 t')
  await page.getByRole('button', { name: 'Inside this chapter' }).click()
  await expect(page.getByRole('dialog')).toContainText('hydrogen')
})
