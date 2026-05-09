import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../fixtures/users';

test.describe('Checkout', () => {
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(page);
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart('Sauce Labs Backpack');

    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
  });

  // Happy path: proves a complete checkout reaches the confirmation page
  test('complete checkout shows order confirmation', async ({ page }) => {
    await checkoutPage.fillDetails('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    const confirmation = await checkoutPage.getConfirmationText();
    expect(confirmation).toContain('Thank you for your order');
  });

  // Proves the form blocks progression when first name is missing
  test('missing first name shows validation error', async () => {
    await checkoutPage.fillDetails('', 'Doe', '12345');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  // Proves the form blocks progression when last name is missing
  test('missing last name shows validation error', async () => {
    await checkoutPage.fillDetails('John', '', '12345');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  // Proves the form blocks progression when postal code is missing
  test('missing postal code shows validation error', async () => {
    await checkoutPage.fillDetails('John', 'Doe', '');
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  // Proves the step-two summary URL is reached after valid info is submitted
  test('valid details advance to order summary page', async ({ page }) => {
    await checkoutPage.fillDetails('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL('/checkout-step-two.html');
  });
});
