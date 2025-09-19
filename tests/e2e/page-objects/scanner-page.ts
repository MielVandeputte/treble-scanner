import { expect, type Locator, type Page } from '@playwright/test';

export class ScannerPage {
  readonly page: Page;
  readonly scannerCard: Locator;
  readonly manualScannerButton: Locator;
  readonly scanHistoryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.scannerCard = page.getByTestId('scanner-card');
    this.manualScannerButton = page.getByTestId('manual-scanner-button');
    this.scanHistoryButton = page.getByTestId('scan-history-button');
  }

  async navigateToManualScannerPage(): Promise<void> {
    await this.manualScannerButton.click();
  }

  async navigateToScanHistoryPage(): Promise<void> {
    await this.scanHistoryButton.click();
  }

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL('/');
  }

  async verifyScanResultIsAlreadyScanned(): Promise<void> {
    await expect(this.scannerCard).toContainText(new RegExp('Al gescand'));
  }
}
