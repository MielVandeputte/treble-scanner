import { expect, type Page } from '@playwright/test';

export class ManualScannerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL('/manual-scanner');
  }
}
