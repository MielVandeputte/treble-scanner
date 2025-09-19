import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly eventIdInput: Locator;
  readonly codeInput: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventIdInput = page.getByTestId('event-id-input');
    this.codeInput = page.getByTestId('code-input');
    this.startButton = page.getByTestId('start-button');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(eventId: string, code: string): Promise<void> {
    await this.eventIdInput.fill(eventId);
    await this.codeInput.fill(code);
    await this.startButton.click();
  }

  async verifyOnPage(): Promise<void> {
    await expect(this.page).toHaveURL('/login');
  }
}
