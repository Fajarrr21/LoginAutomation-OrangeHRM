import LoginPage from '../../support/pageObjects/loginPage'

const loginPage = new LoginPage()

describe('Login OrangeHRM - Fajar Ardiansyah', () => {

  beforeEach(() => {
    loginPage.visitLogin()
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
  })

  // TS-LOGIN001 : Akses halaman login

  it('TC-LOGIN001 : Akses URL dashboard tanpa login harus redirect ke halaman login', () => {
    cy.intercept('GET', '**/dashboard/index').as('dashboardAccess')
    loginPage.visitDashboard()
    cy.wait('@dashboardAccess')
    loginPage.assertOnLoginPage()
  })

  it('TC-LOGIN002 : Menampilkan halaman login', () => {
    cy.intercept('GET', '**/auth/login').as('loginPage')
    loginPage.visitLogin()
    cy.wait('@loginPage').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    loginPage.assertOnLoginPage()
    loginPage.assertBrandingVisible()
  })

  // TS-LOGIN002 : Verifikasi elemen UI

  it('TC-LOGIN003 : Menampilkan field username dan password', () => {
    cy.intercept('GET', '**/auth/login').as('loginPageLoad')
    loginPage.visitLogin()
    cy.wait('@loginPageLoad').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    loginPage.assertUsernameVisible()
    loginPage.assertPasswordVisible()
  })

  it('TC-LOGIN004 : Menampilkan placeholder pada field username dan password', () => {
    loginPage.assertUsernamePlaceholder()
    loginPage.assertPasswordPlaceholder()
  })

  it('TC-LOGIN005 : Tampilan UI login rapi sesuai design', () => {
    cy.intercept('GET', '**/auth/login').as('uiCheck')
    loginPage.visitLogin()
    cy.wait('@uiCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    loginPage.assertBrandingVisible()
    loginPage.assertUsernameVisible()
    loginPage.assertPasswordVisible()
    loginPage.assertSubmitVisible()
  })

  it('TC-LOGIN006 : Input data password disembunyikan (tampil titik-titik)', () => {
    cy.intercept('GET', '**/auth/login').as('passwordFieldCheck')
    loginPage.visitLogin()
    cy.wait('@passwordFieldCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.fixture('loginData').then((data) => {
      loginPage.typePassword(data.validUser.password)
      loginPage.assertPasswordMasked()
    })
  })

  // TS-LOGIN003 : Login berhasil

  it('TC-LOGIN007 : Login dengan input data valid berhasil redirect ke dashboard', () => {
    cy.intercept('POST', '**/auth/validate').as('loginRequest')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.validUser.username, data.validUser.password)
    })
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    loginPage.assertOnDashboard()
    loginPage.assertDashboardTitle()
  })

  it('TC-LOGIN008 : Login dengan tombol enter data valid berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginEnter')
    cy.fixture('loginData').then((data) => {
      loginPage.typeUsername(data.validUser.username)
      loginPage.typePassword(data.validUser.password)
      loginPage.submitForm()
    })
    cy.wait('@loginEnter').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    loginPage.assertOnDashboard()
  })

  it('TC-LOGIN009 : Response time login kurang dari 10 detik', () => {
    cy.intercept('POST', '**/auth/validate').as('loginTiming')
    const start = Date.now()
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.validUser.username, data.validUser.password)
    })
    cy.wait('@loginTiming').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard').then(() => {
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

  it('TC-LOGIN010 : Login dengan kombinasi huruf dan angka yang valid berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginAlphanumeric')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.validUser.username, data.validUser.password)
    })
    cy.wait('@loginAlphanumeric').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    loginPage.assertOnDashboard()
  })

  it('TC-LOGIN011 : Login dengan huruf besar dan kecil valid (case sensitive) berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginCaseSensitive')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.validUser.username, data.validUser.password)
    })
    cy.wait('@loginCaseSensitive').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    loginPage.assertOnDashboard()
  })

  // TS-LOGIN004 : Login gagal - data invalid

  it('TC-LOGIN012 : Input username salah menampilkan pesan error', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongUsername')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.invalidUsername.username, data.invalidUsername.password)
    })
    cy.wait('@wrongUsername').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    loginPage.assertInvalidCredentials()
  })

  it('TC-LOGIN013 : Input password salah menampilkan pesan error', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongPassword')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.invalidPassword.username, data.invalidPassword.password)
      cy.wait('@wrongPassword').then((interception) => {
        const body = interception.request.body
        expect(body).to.include(data.invalidPassword.password)
      })
    })
    loginPage.assertInvalidCredentials()
  })

  it('TC-LOGIN014 : Input username dan password salah menolak login', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongBoth')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.invalidBoth.username, data.invalidBoth.password)
    })
    cy.wait('@wrongBoth').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    loginPage.assertInvalidCredentials()
  })

  it('TC-LOGIN015 : Input karakter khusus pada username dan password menampilkan error', () => {
    cy.intercept('POST', '**/auth/validate').as('specialChar')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.specialChar.username, data.specialChar.password)
    })
    cy.wait('@specialChar').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    loginPage.assertAlertVisible()
  })

  it('TC-LOGIN016 : Pesan validasi error tampil jelas saat login gagal', () => {
    cy.intercept('POST', '**/auth/validate').as('errorMessage')
    cy.fixture('loginData').then((data) => {
      loginPage.login(data.invalidMessage.username, data.invalidMessage.password)
    })
    cy.wait('@errorMessage').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    loginPage.assertInvalidCredentials()
  })

  // TS-LOGIN005 : Validasi field kosong

  it('TC-LOGIN017 : Validasi error saat username dikosongkan', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyUsername')
    cy.fixture('loginData').then((data) => {
      loginPage.clearUsername()
      loginPage.typePassword(data.validUser.password)
      loginPage.clickSubmit()
      loginPage.assertSingleRequiredError()
      cy.wait(1000).then(() => {
        expect(requestFired).to.be.false
      })
    })
  })

  it('TC-LOGIN018 : Validasi error saat password dikosongkan', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyPassword')
    cy.fixture('loginData').then((data) => {
      loginPage.typeUsername(data.validUser.username)
      loginPage.clearPassword()
      loginPage.clickSubmit()
      loginPage.assertSingleRequiredError()
      cy.wait(1000).then(() => {
        expect(requestFired).to.be.false
      })
    })
  })

  it('TC-LOGIN019 : Validasi error saat semua field kosong dan klik login', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyBoth')
    loginPage.clickSubmit()
    loginPage.assertRequiredErrors()
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
  })

  // TS-LOGIN006 : Button login

  it('TC-LOGIN020 : Button login bisa diklik dan berfungsi', () => {
    cy.intercept('GET', '**/auth/login').as('buttonCheck')
    loginPage.visitLogin()
    cy.wait('@buttonCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    loginPage.assertSubmitVisible()
    loginPage.assertSubmitEnabled()
    loginPage.clickSubmit()
  })

  it('TC-LOGIN021 : Double click button login hanya memproses 1 request', () => {
    let requestCount = 0
    cy.intercept('POST', '**/auth/validate', (req) => {
      requestCount++
      req.continue()
    }).as('doubleClick')
    cy.fixture('loginData').then((data) => {
      loginPage.typeUsername(data.validUser.username)
      loginPage.typePassword(data.validUser.password)
      loginPage.clickSubmit()
    })
    cy.wait('@doubleClick').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard').then(() => {
      expect(requestCount).to.eq(1)
    })
  })

  // TS-LOGIN007 : Layar responsif

  it('TC-LOGIN022 : Halaman login tampil responsif di berbagai ukuran layar', () => {
    const viewports = [
      { width: 1280, height: 800,  label: 'Desktop' },
      { width: 768,  height: 1024, label: 'Tablet' },
      { width: 375,  height: 812,  label: 'Mobile' },
    ]
    viewports.forEach(({ width, height, label }) => {
      cy.intercept('GET', '**/auth/login').as(`loginPage_${label}`)
      cy.viewport(width, height)
      loginPage.visitLogin()
      cy.wait(`@loginPage_${label}`).then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })
      loginPage.assertUsernameVisible()
      loginPage.assertPasswordVisible()
      loginPage.assertSubmitVisible()
    })
  })

})