import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { mkdirSync } from 'node:fs'

// Keep browser profiles, temporary files, and test artifacts inside the project.
const temp = path.resolve('artifacts/tmp')
mkdirSync(temp, { recursive: true })
process.env.TEMP = temp
process.env.TMP = temp
process.env.TMPDIR = temp

export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts/test-results',
  timeout: 180_000,
  expect: { timeout: 15_000 },
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    viewport: { width: 1440, height: 960 },
    launchOptions: {
      ...(process.platform === 'win32'
        ? {
            executablePath:
              'C:/Program Files/Google/Chrome/Application/chrome.exe',
          }
        : {}),
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev -- --port 5173 --strictPort',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 30_000,
      },
})
