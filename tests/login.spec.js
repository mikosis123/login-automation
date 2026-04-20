const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test('Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('dave@moa.com', 'P@ssw0rd');

    // Increase timeout and wait for dashboard content
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    // await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 15000 });
});
