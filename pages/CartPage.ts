import { Page, Locator } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async removeItem(productName: string) {
    const item = this.page.locator('.cart_item', { hasText: productName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
