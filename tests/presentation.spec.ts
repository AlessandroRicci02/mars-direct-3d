import { test, expect } from '@playwright/test'
import { industrySteps } from '../src/data/development'

test('concept selectors change scene content and the completed network persists', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Beyond Mars', exact: true }).click()
  await page
    .getByRole('button', { name: 'New World analogy', exact: true })
    .click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'AMERICAS' }),
  ).toHaveCount(1)
  await page
    .getByRole('button', { name: 'Transport networks', exact: true })
    .click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'AMERICAS' }),
  ).toHaveCount(0)
  await expect(
    page.locator('.scene-label').filter({ hasText: 'REPEATED LOGISTICS' }),
  ).toHaveCount(1)

  await page.locator('.timeline-step').nth(2).click()
  for (const [i, stage] of industrySteps.entries()) {
    await page.getByRole('button', { name: stage.short, exact: true }).click()
    await expect(page.locator('.network-phase')).toContainText(
      `${String(i + 1).padStart(2, '0')} / 07`,
    )
    await expect(
      page.locator('.scene-label').filter({ hasText: stage.title }),
    ).toHaveCount(1)
    await expect(
      page.locator('.scene-label b').filter({ hasText: /^MANUFACTURING$/ }),
    ).toHaveCount(i >= 4 ? 1 : 0)
  }
  await page.locator('.timeline-step').nth(9).click()
  await page.getByRole('button', { name: 'NEP vehicle', exact: true }).click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'CONVERSION' }),
  ).toHaveCount(1)
  await expect(
    page.locator('.scene-label').filter({ hasText: 'ELECTRIC THRUSTERS' }),
  ).toHaveCount(1)
  await page.getByRole('button', { name: 'Lunar power', exact: true }).click()
  await expect(
    page.locator('.scene-label').filter({ hasText: 'LUNAR POLAR REACTOR' }),
  ).toHaveCount(1)
  await expect(
    page.locator('.scene-label').filter({ hasText: 'ELECTRIC THRUSTERS' }),
  ).toHaveCount(0)

  await page.locator('.timeline-step').nth(10).click()
  await expect(page.locator('.beyond-panel')).toHaveAttribute(
    'data-development',
    '5',
    { timeout: 35000 },
  )
  for (const label of ['MOON', 'ASTEROIDS', 'ORBITAL DEPOT', 'SURFACE POWER'])
    await expect(
      page.locator('.scene-label b').filter({ hasText: label }),
    ).toHaveCount(1)
  await page.waitForTimeout(15500)
  await expect(page.locator('.beyond-panel')).toHaveAttribute(
    'data-development',
    '5',
  )
  await expect(
    page.locator('.scene-label b').filter({ hasText: 'ORBITAL DEPOT' }),
  ).toHaveCount(1)
  await page.screenshot({ path: 'artifacts/network-complete.png' })
  await page
    .getByRole('button', { name: 'Replay chapter and reset camera' })
    .click()
  await expect(page.locator('.beyond-panel')).toHaveAttribute(
    'data-development',
    '0',
  )
  await expect(
    page.locator('.scene-label b').filter({ hasText: 'ORBITAL DEPOT' }),
  ).toHaveCount(0)
  expect(errors).toEqual([])
})

test('mobile fuel notes are interactive and clearly separate the optional variant', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('.timeline-step').nth(4).click()
  await page
    .getByRole('button', { name: 'Future/local-water variant', exact: true })
    .click()
  await expect(page.locator('.process-note')).toContainText(
    'continues to show the original',
  )
  await expect(page.locator('.isru-summary')).toContainText('~6 t from Earth')
  await expect(page.locator('.isru-summary')).toContainText('100 kW')
  await page
    .getByRole('button', { name: 'Original Mars Direct', exact: true })
    .click()
  await expect(page.locator('.process-note')).toContainText('hydrogen recycled')
  const story = await page.locator('.story').boundingBox()
  const fuel = await page.locator('.fuel-panel').boundingBox()
  expect(story!.y + story!.height).toBeLessThan(fuel!.y)
  await page.waitForTimeout(3000)
  await page.screenshot({
    path: 'artifacts/mobile-fuel-final.png',
    fullPage: true,
  })
})
