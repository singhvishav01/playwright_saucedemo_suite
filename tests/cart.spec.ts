import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../fixtures/users';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(page);
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  // Proves added items actually appear in the cart — the add action persisted
  test('added item appears in cart', async ({ page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await page.locator('.shopping_cart_link').click();
    const names = await cartPage.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  // Proves multiple distinct items can be added and all persist to the cart
  test('multiple items can be added to cart', async ({ page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await page.locator('.shopping_cart_link').click();
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });

  // Proves remove actually deletes the item — not just hides it
  test('removing item from cart decrements count', async ({ page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.removeItem('Sauce Labs Backpack');
    const count = await cartPage.getItemCount();
    expect(count).toBe(0);
  });

  // Proves continue shopping navigates back to inventory with cart state intact
  test('continue shopping returns to inventory page', async ({ page }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.continueShopping();
    await expect(page).toHaveURL('/inventory.html');
  });
});
