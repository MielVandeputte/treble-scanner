import { expect, type Locator, type Page } from '@playwright/test';

export class ManualScannerPage {
  private readonly page: Page;
  private readonly lastScanAttempt: Locator;
  private readonly secretCodeInput: Locator;
  private readonly backButton: Locator;
  private readonly scanButton: Locator;

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
    await expect(this.lastScanAttempt).toContainText('Al gescand');
  }
}
