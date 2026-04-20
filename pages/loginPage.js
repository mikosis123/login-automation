class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Your email');
    this.passwordInput = page.getByPlaceholder('**********');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.alert-error'); // adjust later
  }

  async goto() {
    await this.page.goto('https://megp-bo.dev.peragosystems.com/iam/auth/login');
  }

  async login(username, password) {
    await this.usernameInput.click();
    await this.usernameInput.fill(''); // Clear if any
    await this.usernameInput.pressSequentially(username, { delay: 50 });
    
    await this.passwordInput.click();
    await this.passwordInput.fill(''); // Clear if any
    await this.passwordInput.pressSequentially(password, { delay: 50 });
    
    await this.page.waitForTimeout(500); // Small pause before clicking
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };