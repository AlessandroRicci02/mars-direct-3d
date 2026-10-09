import { test, expect } from '@playwright/test'
import {
  EARTH_RADIUS,
  MARS_RADIUS,
  EARTH_ORBIT_RADIUS,
  MARS_ORBIT_RADIUS,
  EARTH,
  MARS,
  SUN,
  BODY_BOUNDS,
  keepCameraOutsideBodies,
} from '../src/data/solarSystem'
import { Vector3 } from 'three'

test('planet ratios, orbit positions, and collision clearance preserve physical constraints', () => {
  expect(MARS_RADIUS / EARTH_RADIUS).toBeCloseTo(6792 / 12756, 8)
  expect(MARS_ORBIT_RADIUS / EARTH_ORBIT_RADIUS).toBeCloseTo(1.524, 3)
  expect(EARTH.distanceTo(SUN)).toBeCloseTo(EARTH_ORBIT_RADIUS, 8)
  expect(MARS.distanceTo(SUN)).toBeCloseTo(MARS_ORBIT_RADIUS, 8)
  for (const body of BODY_BOUNDS) {
    for (const offset of [
      new Vector3(),
      new Vector3(0.01, 0, 0),
      new Vector3(0, -0.5, 0),
    ]) {
      const camera = keepCameraOutsideBodies(body.center.clone().add(offset))
      expect(camera.distanceTo(body.center)).toBeGreaterThanOrEqual(
        body.radius + 0.89,
      )
    }
  }
})

test('viewport changes and interrupted camera moves leave a usable scene', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (e) => {
    if (e.type() === 'error') errors.push(e.text())
  })
  const failedAssets: string[] = []
  page.on('response', (response) => {
    if (response.url().includes('/textures/') && !response.ok())
      failedAssets.push(response.url())
  })
  await page.goto('/')
  await expect(page.locator('.scene-label.blue')).toBeVisible()
  for (const [width, height, chapter] of [
    [1024, 768, 4],
    [390, 844, 4],
    [844, 390, 7],
    [1440, 960, 2],
  ]) {
    await page.setViewportSize({ width, height })
    await page.locator('.timeline-step').nth(chapter).click()
    await page.waitForTimeout(3100)
    await expect(page.locator('canvas')).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    const button = page.getByRole('button', {
      name: 'Next chapter',
      exact: true,
    })
    await expect(button).toBeVisible()
    await page.screenshot({
      path: `artifacts/polish-${width}-${chapter}.png`,
      fullPage: true,
    })
  }
  // A second selection during a flight must cancel the old tween cleanly.
  for (const chapter of [1, 7, 8, 3, 0]) {
    await page.locator('.timeline-step').nth(chapter).click()
    await page.waitForTimeout(100)
  }
  await page.waitForTimeout(3000)
  await expect(page.locator('.experience')).toHaveAttribute('data-stage', '0')
  await expect(page.locator('.scene-label.blue')).toBeVisible()
  expect(failedAssets).toEqual([])
  expect(errors).toEqual([])
})
