const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test('Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('dave@moa.com', 'P@ssw0rd');

    // Cross-browser runs can be slower after auth redirect.
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 45000 });
    // await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 15000 });
});

test('Invalid Password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('dave@moa.com', 'WrongP@ss123');

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/iam\/auth\/login/, { timeout: 15000 });
});
