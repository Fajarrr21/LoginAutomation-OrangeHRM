const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'

class ForgotPasswordPage {

  //Selectors 
  get forgotPasswordLink() { return cy.get('.orangehrm-login-forgot') }
  get usernameInput()      { return cy.get('input[name="username"]') }
  get resetButton()        { return cy.get('button[type="submit"]') }
  get cancelButton()       { return cy.contains('button', 'Cancel') }
  get resetTitle()         { return cy.get('.orangehrm-forgot-password-title') }
  get cardContainer()      { return cy.get('.orangehrm-card-container') }
  get copyrightText()      { return cy.get('.orangehrm-copyright') }

  //Actions 
  visitLogin() {
    cy.visit(`${BASE_URL}/auth/login`)
  }

  visitForgotPassword() {
    cy.visit(`${BASE_URL}/auth/requestPasswordResetCode`)
  }

  clickForgotPasswordLink() {
    this.forgotPasswordLink.click()
  }

  typeUsername(username) {
    this.usernameInput.type(username)
  }

  clearUsername() {
    this.usernameInput.clear()
  }

  clickReset() {
    this.resetButton.click()
  }

  clickCancel() {
    this.cancelButton.click()
  }

  //Assertions
  assertOnForgotPasswordPage() {
    cy.url().should('contain', '/auth/requestPasswordResetCode')
  }

  assertOnLoginPage() {
    cy.url().should('contain', '/auth/login')
  }

  assertResetTitleVisible() {
    this.resetTitle.should('be.visible').and('contain', 'Reset Password')
  }

  assertCardVisible() {
    this.cardContainer.should('be.visible')
  }

  assertUsernameInputVisible() {
    this.usernameInput.should('be.visible')
  }

  assertResetButtonVisible() {
    this.resetButton.should('be.visible').and('contain', 'Reset Password')
  }

  assertCancelButtonVisible() {
    this.cancelButton.should('be.visible').and('contain', 'Cancel')
  }

  assertUsernamePlaceholder() {
    this.usernameInput.should('have.attr', 'placeholder', 'Username')
  }

  assertOnSuccessPage() {
  cy.url().should('contain', '/auth/sendPasswordReset')
  cy.get('.orangehrm-forgot-password-title')
    .should('contain', 'Reset Password link sent successfully')
}

  assertCopyrightVisible() {
    this.copyrightText.should('be.visible')
  }

}

export default ForgotPasswordPage