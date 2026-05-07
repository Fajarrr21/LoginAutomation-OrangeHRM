const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'

class LoginPage {

  // ── Selectors ──────────────────────────────────────────────
  get usernameInput()  { return cy.get('input[name="username"]') }
  get passwordInput()  { return cy.get('input[name="password"]') }
  get submitButton()   { return cy.get('button[type="submit"]') }
  get loginBranding()  { return cy.get('.orangehrm-login-branding') }
  get alertMessage()   { return cy.get('.oxd-alert-content-text') }
  get errorMessages()  { return cy.get('.oxd-input-field-error-message') }
  get dashboardTitle() { return cy.get('h6.oxd-text') }

  // ── Actions ────────────────────────────────────────────────
  visitLogin() {
    cy.visit(`${BASE_URL}/auth/login`)
  }

  visitDashboard() {
    cy.visit(`${BASE_URL}/dashboard/index`)
  }

  typeUsername(username) {
    this.usernameInput.type(username)
  }

  typePassword(password) {
    this.passwordInput.type(password)
  }

  clearUsername() {
    this.usernameInput.clear()
  }

  clearPassword() {
    this.passwordInput.clear()
  }

  clickSubmit() {
    this.submitButton.click()
  }

  submitForm() {
    cy.get('form').submit()
  }

  login(username, password) {
    this.typeUsername(username)
    this.typePassword(password)
    this.clickSubmit()
  }

  // ── Assertions ─────────────────────────────────────────────
  assertOnLoginPage() {
    cy.url().should('contain', '/auth/login')
  }

  assertOnDashboard() {
    cy.url().should('contain', '/dashboard')
  }

  assertBrandingVisible() {
    this.loginBranding.should('be.visible')
  }

  assertUsernameVisible() {
    this.usernameInput.should('be.visible')
  }

  assertPasswordVisible() {
    this.passwordInput.should('be.visible')
  }

  assertSubmitVisible() {
    this.submitButton.should('be.visible')
  }

  assertSubmitEnabled() {
    this.submitButton.should('be.enabled')
  }

  assertPasswordMasked() {
    this.passwordInput.should('have.attr', 'type', 'password')
  }

  assertUsernamePlaceholder() {
    this.usernameInput.should('have.attr', 'placeholder', 'Username')
  }

  assertPasswordPlaceholder() {
    this.passwordInput.should('have.attr', 'placeholder', 'Password')
  }

  assertInvalidCredentials() {
    this.alertMessage.should('be.visible').and('contain', 'Invalid credentials')
  }

  assertAlertVisible() {
    this.alertMessage.should('be.visible')
  }

  assertRequiredErrors() {
    this.errorMessages.should('have.length', 2).and('contain', 'Required')
  }

  assertSingleRequiredError() {
    this.errorMessages.should('be.visible').and('contain', 'Required')
  }

  assertDashboardTitle() {
    this.dashboardTitle.should('contain', 'Dashboard')
  }

}

export default LoginPage