import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../fixtures/users';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(page);
  });

  // Happy path: proves a valid user reaches the inventory page after login
  test('standard user can log in successfully', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  // Locked-out user: proves the app blocks the right users with the right message
  test('locked out user sees correct error message', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  // Wrong credentials: proves the error message guides the user correctly
  test('wrong password shows error message', async () => {
    await loginPage.login(users.standard.username, 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  // Empty username: proves client-side validation fires before a network request
  test('empty username shows validation error', async () => {
    await loginPage.login('', users.standard.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  // Empty password: same principle — each missing field has its own specific message
  test('empty password shows validation error', async () => {
    await loginPage.login(users.standard.username, '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });
});
