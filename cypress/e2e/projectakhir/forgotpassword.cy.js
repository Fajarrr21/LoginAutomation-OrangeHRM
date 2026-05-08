import ForgotPasswordPage from '../../support/pageObjects/forgotpassword'

const forgotPage = new ForgotPasswordPage()

describe('Forgot Password OrangeHRM - Fajar Ardiansyah', () => {

  beforeEach(() => {
    forgotPage.visitForgotPassword()
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
  })

  // TS-FP001 : Akses halaman forgot password

  it('TC-FP001 : Klik link forgot password dari halaman login berpindah ke halaman reset', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('forgotPage')
    forgotPage.visitLogin()
    forgotPage.clickForgotPasswordLink()
    cy.wait('@forgotPage').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    forgotPage.assertOnForgotPasswordPage()
  })

  it('TC-FP002 : Halaman forgot password berhasil dimuat dengan status 200', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('forgotPageLoad')
    forgotPage.visitForgotPassword()
    cy.wait('@forgotPageLoad').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    forgotPage.assertOnForgotPasswordPage()
  })

  // TS-FP002 : Verifikasi elemen UI

  it('TC-FP003 : Judul reset password tampil dengan benar', () => {
    forgotPage.assertResetTitleVisible()
  })

  it('TC-FP004 : Field username, tombol reset dan cancel tampil di halaman', () => {
    forgotPage.assertUsernameInputVisible()
    forgotPage.assertResetButtonVisible()
    forgotPage.assertCancelButtonVisible()
  })

  it('TC-FP005 : Placeholder field username tampil dengan benar', () => {
    forgotPage.assertUsernamePlaceholder()
  })

  it('TC-FP006 : Card container reset password tampil dengan benar', () => {
    forgotPage.assertCardVisible()
  })

  it('TC-FP007 : Copyright text tampil di halaman forgot password', () => {
    forgotPage.assertCopyrightVisible()
  })

  it('TC-FP008 : Field username dapat menerima input teks', () => {
    cy.get('input[name="username"]').type('Blessy').should('have.value', 'Blessy')
  })

  it('TC-FP009 : Tombol reset password dalam kondisi enabled', () => {
    forgotPage.assertResetButtonVisible()
    cy.get('button[type="submit"]').should('be.enabled')
  })

  it('TC-FP010 : Tombol cancel dalam kondisi enabled', () => {
    cy.contains('button', 'Cancel').should('be.visible').and('be.enabled')
  })

  it('TC-FP011 : Halaman forgot password memiliki judul yang benar di browser', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('titleCheck')
    forgotPage.visitForgotPassword()
    cy.wait('@titleCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.title().should('not.be.empty')
  })

  it('TC-FP012 : Field username bisa di-clear dan diisi ulang', () => {
    cy.get('input[name="username"]').type('Blessy').clear().type('Admin')
    cy.get('input[name="username"]').should('have.value', 'Admin')
  })

  // TS-FP003 : Submit reset password

  it('TC-FP013 : Submit dengan username valid berhasil dikirim ke halaman konfirmasi', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('resetRequest')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@resetRequest', { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
  })

  it('TC-FP014 : Submit dengan username tidak terdaftar tetap redirect ke halaman konfirmasi', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('invalidReset')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.invalidUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@invalidReset', { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
  })

  it('TC-FP015 : Submit dengan karakter khusus pada username tetap diproses', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('specialCharReset')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.specialChar.username)
      forgotPage.clickReset()
    })
    cy.wait('@specialCharReset', { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
  })

  it('TC-FP016 : Halaman sukses menampilkan judul reset password link sent successfully', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('successReset')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@successReset', { timeout: 60000 })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
    cy.get('.orangehrm-forgot-password-title', { timeout: 10000 })
      .should('contain', 'Reset Password link sent successfully')
  })

  it('TC-FP017 : Halaman sukses menampilkan pesan link dikirim via email', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('emailMsg')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@emailMsg', { timeout: 60000 })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
    cy.contains('A reset password link has been sent to you via email.', { timeout: 10000 }).should('be.visible')
  })

  it('TC-FP018 : Halaman sukses menampilkan pesan instruksi memilih password baru', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('instruksiMsg')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@instruksiMsg', { timeout: 60000 })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
    cy.contains('You can follow that link and select a new password.', { timeout: 10000 }).should('be.visible')
  })

  it('TC-FP019 : Halaman sukses menampilkan catatan hubungi administrator', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('adminNote')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@adminNote', { timeout: 60000 })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
    cy.contains('If the email does not arrive, please contact your OrangeHRM Administrator.', { timeout: 10000 }).should('be.visible')
  })

  it('TC-FP020 : Halaman sukses menampilkan card container', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('successCard')
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@successCard', { timeout: 60000 })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset')
    cy.get('.orangehrm-card-container', { timeout: 10000 }).should('be.visible')
  })

  // TS-FP004 : Validasi field kosong

  it('TC-FP021 : Submit username kosong — request tidak terkirim ke server', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/requestResetPassword', () => { requestFired = true }).as('emptyReset')
    cy.get('input[name="username"]').clear()
    forgotPage.clickReset()
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
    forgotPage.assertOnForgotPasswordPage()
  })

  it('TC-FP022 : Submit username hanya spasi — request tidak terkirim ke server', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/requestResetPassword', () => { requestFired = true }).as('spaceReset')
    cy.get('input[name="username"]').type('   ')
    forgotPage.clickReset()
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
    forgotPage.assertOnForgotPasswordPage()
  })

  // TS-FP005 : Fungsi tombol cancel

  it('TC-FP023 : Klik tombol cancel kembali ke halaman login', () => {
    cy.intercept('GET', '**/auth/login').as('backToLogin')
    forgotPage.clickCancel()
    cy.wait('@backToLogin').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    forgotPage.assertOnLoginPage()
  })

  it('TC-FP024 : Klik cancel setelah mengisi username tidak menyimpan data', () => {
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickCancel()
      forgotPage.assertOnLoginPage()
    })
  })

  it('TC-FP025 : Klik cancel pada form kosong langsung kembali ke halaman login', () => {
    cy.intercept('GET', '**/auth/login').as('cancelEmpty')
    forgotPage.clickCancel()
    cy.wait('@cancelEmpty').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    forgotPage.assertOnLoginPage()
  })

  it('TC-FP026 : Setelah cancel, halaman login menampilkan form login dengan benar', () => {
    forgotPage.clickCancel()
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  // TS-FP006 : Responsif

  it('TC-FP027 : Halaman forgot password responsif di berbagai ukuran layar', () => {
    const viewports = [
      { width: 1280, height: 800,  label: 'Desktop' },
      { width: 768,  height: 1024, label: 'Tablet' },
      { width: 375,  height: 812,  label: 'Mobile' },
    ]
    viewports.forEach(({ width, height, label }) => {
      cy.intercept('GET', '**/auth/requestPasswordResetCode').as(`fpPage_${label}`)
      cy.viewport(width, height)
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode', { failOnStatusCode: false })
      cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
      cy.wait(`@fpPage_${label}`).then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })
      forgotPage.assertUsernameInputVisible()
      forgotPage.assertResetButtonVisible()
      forgotPage.assertCancelButtonVisible()
    })
  })

  it('TC-FP028 : Tombol reset dan cancel tidak terpotong di layar mobile', () => {
    cy.viewport(375, 812)
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode', { failOnStatusCode: false })
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible')
    cy.contains('button', 'Cancel').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  // TS-FP007 : Response time

  it('TC-FP029 : Response time submit reset password kurang dari 10 detik', () => {
    cy.intercept('POST', '**/auth/requestResetPassword').as('resetTiming')
    const start = Date.now()
    cy.fixture('forgotpassword').then((data) => {
      forgotPage.typeUsername(data.validUser.username)
      forgotPage.clickReset()
    })
    cy.wait('@resetTiming', { timeout: 60000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url({ timeout: 60000 }).should('contain', '/auth/sendPasswordReset').then(() => {
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

  it('TC-FP030 : Halaman forgot password load kurang dari 10 detik', () => {
    cy.intercept('GET', '**/auth/requestPasswordResetCode').as('pageLoadTime')
    const start = Date.now()
    forgotPage.visitForgotPassword()
    cy.wait('@pageLoadTime').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

})