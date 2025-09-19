import { expect, type Locator, type Page } from '@playwright/test';

export class ManualScannerPage {
  readonly page: Page;
  readonly lastScanAttempt: Locator;
  readonly secretCodeInput: Locator;
  readonly backButton: Locator;
  readonly scanButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.lastScanAttempt = page.getByTestId('last-scan-attempt');
    this.secretCodeInput = page.getByTestId('secret-code-input');
    this.backButton = page.getByTestId('back-button');
    this.scanButton = page.getByTestId('scan-button');
  }

  async navigateToScannerPage(): Promise<void> {
    await this.backButton.click();
  }

  async scanTicketWithSecretCode(secretCode: string): Promise<void> {
    await this.secretCodeInput.fill(secretCode);
    await this.scanButton.click();
  }

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL('/manual-scanner');
  }

  async verifyScanResultIsAlreadyScanned(): Promise<void> {
    await expect(this.lastScanAttempt).toContainText(new RegExp('Al gescand'));
  }
}
