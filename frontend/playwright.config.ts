import { defineConfig } from '@playwright/test';

// Inicia antes backend y frontend. La prueba crea registros con correos únicos.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://127.0.0.1:4200',
    browserName: 'chromium',
    channel: process.env['E2E_BROWSER_CHANNEL'] || undefined,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
