import { defineConfig, devices } from "@playwright/test";

/**
 * Minimal e2e bootstrap. Uses **system Microsoft Edge** (`channel: 'msedge'`) so
 * `npx playwright install` is not required (helps when disk space is tight).
 * To use bundled Chromium instead: add a `chromium` project and run `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: "./playwright/e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "off",
  },
  projects: [
    {
      name: "Microsoft Edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
