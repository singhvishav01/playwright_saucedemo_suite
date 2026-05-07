import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../fixtures/users';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(page);
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
  });

  // Proves the inventory page loads the correct product catalogue (6 items is SauceDemo's fixed set)
  test('inventory page shows 6 products', async () => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  // Proves the cart state updates correctly when an item is added
  test('cart badge increments when item is added', async () => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  // Proves the sort feature actually reorders products — not just cosmetically but in DOM order
  test('sort by price low to high orders products correctly', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
