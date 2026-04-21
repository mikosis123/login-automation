const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test.setTimeout(60000);

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

test('Empty Form Validation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // Submit without entering credentials.
    await loginPage.usernameInput.fill('');
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();

    // We should remain on login and see validation feedback.
    await expect(page).toHaveURL(/\/iam\/auth\/login/, { timeout: 15000 });
    await expect.poll(async () => {
        const inlineValidationCount = await page
            .locator('.invalid-feedback:visible, .error-message:visible, .text-danger:visible, [role="alert"]:visible')
            .count();

        const usernameValidationMessage = await loginPage.usernameInput.evaluate(
            (el) => el.validationMessage || ''
        );
        const passwordValidationMessage = await loginPage.passwordInput.evaluate(
            (el) => el.validationMessage || ''
        );

        const hasNativeValidationMessage =
            usernameValidationMessage.trim().length > 0 || passwordValidationMessage.trim().length > 0;

        return inlineValidationCount > 0 || hasNativeValidationMessage;
    }, { timeout: 15000 }).toBeTruthy();
});
