class DirectoryPage {

  visitDirectory() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory', { failOnStatusCode: false })
  }

  visitLogin() {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { failOnStatusCode: false })
  }

  //Login

  loginAsAdmin() {
    cy.session('admin-session', () => {
      this.visitLogin()
      cy.get('input[name="username"]', { timeout: 10000 }).type('Admin')
      cy.get('input[name="password"]').type('admin123')
      cy.get('button[type="submit"]').click()
      cy.url({ timeout: 10000 }).should('contain', '/dashboard')
    })
  }

  // Selectors

  getBreadcrumb() { return cy.get('.oxd-topbar-header-breadcrumb-module') }

  getFilterTitle() { return cy.get('.oxd-table-filter-title') }
  getEmployeeNameInput() { return cy.get('input[placeholder="Type for hints..."]') }
  getJobTitleDropdown() { return cy.get('.oxd-select-text').eq(0) }
  getLocationDropdown() { return cy.get('.oxd-select-text').eq(1) }
  getSearchButton() { return cy.get('button[type="submit"]') }
  getResetButton() { return cy.get('button[type="reset"]') }
  getFilterLabels() { return cy.get('.oxd-label') }

  getAutocompleteOptions() { return cy.get('.oxd-autocomplete-dropdown') }

  getRecordsFoundText() { return cy.get('.orangehrm-horizontal-padding .oxd-text--span') }
  getDirectoryCards() { return cy.get('.orangehrm-directory-card') }
  getCardHeaders() { return cy.get('.orangehrm-directory-card-header') }
  getCardContainer() { return cy.get('.oxd-grid-4') }

  getFooter() { return cy.get('.oxd-layout-footer') }
  getCopyright() { return cy.get('.orangehrm-copyright') }

  // Helper - Filter Toggle & Records Container

  getFilterToggleButton() {
    return cy.get('.oxd-table-filter-header-options .oxd-icon-button')
  }

  getFilterArea() {
    return cy.get('.oxd-table-filter-area')
  }

  expandFilterIfCollapsed() {
    cy.get('body').then(($body) => {
      const filterArea = $body.find('.oxd-table-filter-area')
      if (filterArea.length && filterArea.css('display') === 'none') {
        cy.get('.oxd-table-filter-header-options .oxd-icon-button').click()
      }
    })
  }

  getRecordsFoundContainer() {
    return cy.get('.orangehrm-horizontal-padding')
  }

  // Actions

  typeEmployeeName(name) {
    this.getEmployeeNameInput().clear().type(name)
  }

  clickSearch() {
    this.getSearchButton().click()
  }

  clickReset() {
    this.getResetButton().click()
  }

  selectJobTitle(jobTitle) {
    this.getJobTitleDropdown().click()
    cy.get('.oxd-select-dropdown').contains(jobTitle).click()
  }

  selectLocation(location) {
    this.getLocationDropdown().click()
    cy.get('.oxd-select-dropdown').contains(location).click()
  }

  // Assertions

  assertOnDirectoryPage() {
    cy.url().should('contain', '/directory/viewDirectory')
    this.getBreadcrumb().should('contain', 'Directory')
  }

  assertOnLoginPage() {
    cy.url().should('contain', '/auth/login')
  }

  assertFilterTitleVisible() {
    this.getFilterTitle().should('be.visible').and('contain', 'Directory')
  }

  assertEmployeeNameInputVisible() {
    this.getEmployeeNameInput().should('be.visible')
  }

  assertEmployeeNamePlaceholder() {
    this.getEmployeeNameInput().should('have.attr', 'placeholder', 'Type for hints...')
  }

  assertJobTitleDropdownVisible() {
    this.getJobTitleDropdown().should('be.visible').and('contain', '-- Select --')
  }

  assertLocationDropdownVisible() {
    this.getLocationDropdown().should('be.visible').and('contain', '-- Select --')
  }

  assertSearchButtonVisible() {
    this.getSearchButton().should('be.visible').and('contain', 'Search')
  }

  assertResetButtonVisible() {
    this.getResetButton().should('be.visible').and('contain', 'Reset')
  }

  assertSearchButtonEnabled() {
    this.getSearchButton().should('be.enabled')
  }

  assertResetButtonEnabled() {
    this.getResetButton().should('be.enabled')
  }

  assertFilterLabelsVisible() {
    this.getFilterLabels().should('contain', 'Employee Name')
    this.getFilterLabels().should('contain', 'Job Title')
    this.getFilterLabels().should('contain', 'Location')
  }

  assertRecordsFoundVisible() {
    this.getRecordsFoundText().should('be.visible').and('contain', 'Records Found')
  }

  assertDirectoryCardsVisible() {
    this.getDirectoryCards().should('have.length.greaterThan', 0)
  }

  assertCardContainsName(name) {
    this.getCardHeaders().should('contain', name)
  }

  assertNoRecordsFound() {
    this.getRecordsFoundContainer().should(($el) => {
      const text = $el.text()
      expect(text).to.match(/\(0\)\s*Records\s*Found|No Records Found/i)
    })
  }

  assertFooterVisible() {
    this.getFooter().should('be.visible')
  }

  assertCopyrightVisible() {
    this.getCopyright().should('be.visible').and('contain', 'OrangeHRM')
  }
}

export default DirectoryPage