import { expect, type Locator, type Page } from '@playwright/test';

export class ScanHistoryPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly scanHistoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.scanHistoryList = page.getByTestId('scan-history-list');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL('/scan-history');
  }

  async verifyHistoryContainsAlreadyScannedTicketWithSecretCode(secretCode: string): Promise<void> {
    await expect(this.scanHistoryList).toHaveText(new RegExp('Al gescand'));
    await expect(this.scanHistoryList).toContainText(new RegExp(secretCode));
  }
}
