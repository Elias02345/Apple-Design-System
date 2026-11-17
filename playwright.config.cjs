const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 3 : 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', viewport: { width: 1280, height: 900 } },
  webServer: { command: 'node tests/serve.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  projects: [
    {name:'chromium',use:{browserName:'chromium',launchOptions:process.env.EDGE_PATH ? {executablePath:process.env.EDGE_PATH} : {}}},
    {name:'firefox',use:{browserName:'firefox'}},
    {name:'webkit',use:{browserName:'webkit'}}
  ]
});
