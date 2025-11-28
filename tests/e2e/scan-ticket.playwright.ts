import { test } from '@playwright/test';

import { LoginPage } from './page-objects/login-page.ts';
import { ScanHistoryPage } from './page-objects/scan-history-page.ts';
import { ScannerPage } from './page-objects/scanner-page.ts';

test.use({
  launchOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--use-file-for-fake-video-capture=./test-data/ticket.y4m',
    ],
  },
});

test.skip(({ browserName }) => browserName !== 'chromium', 'relies on chromium specific launch options');

test('should successfully log in and scan a QR code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const scannerPage = new ScannerPage(page);
  const scanHistoryPage = new ScanHistoryPage(page);

  await test.step('log in to the application', async () => {
    await loginPage.goto();
    await loginPage.login('test', '4H3R531ITM');
    await scannerPage.verifyOnPage();
  });

  await test.step('scan ticket', async () => {
    await scannerPage.verifyScanResultIsAlreadyScanned();
  });

  await test.step('check last scanned ticket in scan history', async () => {
    await scannerPage.navigateToScanHistoryPage();
    await scanHistoryPage.verifyOnPage();
    await scanHistoryPage.verifyHistoryContainsAlreadyScannedTicketWithSecretCode('2a830045dfc9a99785a358cf2ea97344');
  });

  await test.step('log out', async () => {
    await scanHistoryPage.logout();
    await loginPage.verifyOnPage();
  });
});
