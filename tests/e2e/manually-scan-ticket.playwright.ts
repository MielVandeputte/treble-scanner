import { test } from '@playwright/test';

import { LoginPage } from './page-objects/login-page.ts';
import { ManualScannerPage } from './page-objects/manual-scanner-page.ts';
import { ScanHistoryPage } from './page-objects/scan-history-page.ts';
import { ScannerPage } from './page-objects/scanner-page.ts';

test('should successfully log in and manually scan a QR code', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const scannerPage = new ScannerPage(page);
  const manualScannerPage = new ManualScannerPage(page);
  const scanHistoryPage = new ScanHistoryPage(page);

  await test.step('log in to the application', async () => {
    await loginPage.goto();
    await loginPage.login('test', '4H3R531ITM');
    await scannerPage.verifyOnPage();
  });

  await test.step('manually scan ticket', async () => {
    await scannerPage.navigateToManualScannerPage();
    await manualScannerPage.verifyOnPage();
    await manualScannerPage.scanTicketWithSecretCode('2a830045dfc9a99785a358cf2ea97344');
    await manualScannerPage.verifyScanResultIsAlreadyScanned();
    await manualScannerPage.navigateToScannerPage();
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
