import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;
  private readonly productCards: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(productName: string) {
    const card = this.page.locator('.inventory_item', { hasText: productName });
    await card.getByRole('button', { name: /add to cart/i }).click();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10);
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price');
    const prices = await priceLocators.allInnerTexts();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }
}
