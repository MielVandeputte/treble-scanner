import { expect, type Locator, type Page } from '@playwright/test';

export class ScanHistoryPage {
  readonly page: Page;
  readonly scanHistoryList: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.scanHistoryList = page.getByTestId('scan-history-list');
    this.logoutButton = page.getByTestId('logout-button');
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
