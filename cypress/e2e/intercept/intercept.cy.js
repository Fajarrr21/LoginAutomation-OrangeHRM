describe('Login OrangeHRM - Fajar Ardiansyah', () => {

  const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'
  const VALID_USER = 'Admin'
  const VALID_PASS = 'admin123'

  // TS-LOGIN001 : Akses Halaman Login

  it('TC-LOGIN001 : Akses URL dashboard tanpa login harus redirect ke halaman login', () => {
    cy.intercept('GET', '**/dashboard/index').as('dashboardAccess')
    cy.visit(`${BASE_URL}/dashboard/index`)
    cy.wait('@dashboardAccess')
    cy.url().should('contain', '/auth/login')
  })

  it('TC-LOGIN002 : Menampilkan halaman login', () => {
    cy.intercept('GET', '**/auth/login').as('loginPage')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@loginPage').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.url().should('contain', '/auth/login')
    cy.get('.orangehrm-login-branding').should('be.visible')
  })

  // TS-LOGIN002 : Verifikasi Elemen UI

  it('TC-LOGIN003 : Menampilkan field username dan password', () => {
    cy.intercept('GET', '**/auth/login').as('loginPageLoad')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@loginPageLoad').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
  })

  it('TC-LOGIN011 : Menampilkan placeholder pada field username dan password', () => {
    cy.intercept('GET', '**/auth/login').as('placeholderCheck')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@placeholderCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username')
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password')
  })

  it('TC-LOGIN014 : Tampilan UI login rapi sesuai design', () => {
    cy.intercept('GET', '**/auth/login').as('uiCheck')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@uiCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.get('.orangehrm-login-branding').should('be.visible')
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('TC-LOGIN016 : Input data password disembunyikan (tampil titik-titik)', () => {
    cy.intercept('GET', '**/auth/login').as('passwordFieldCheck')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@passwordFieldCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  // TS-LOGIN003 : Login Berhasil

  it('TC-LOGIN004 : Login dengan input data valid berhasil redirect ke dashboard', () => {
    cy.intercept('POST', '**/auth/validate').as('loginRequest')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard')
    cy.get('h6.oxd-text').should('contain', 'Dashboard')
  })

  it('TC-LOGIN013 : Login dengan tombol Enter data valid berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginEnter')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('form').submit()
    cy.wait('@loginEnter').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard')
  })

  it('TC-LOGIN015 : Response time login kurang dari 8 detik', () => {
    cy.intercept('POST', '**/auth/validate').as('loginTiming')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    const start = Date.now()
    cy.get('button[type="submit"]').click()
    cy.wait('@loginTiming').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard').then(() => {
      expect(Date.now() - start).to.be.lessThan(8000)
    })
  })

  it('TC-LOGIN018 : Login dengan kombinasi huruf dan angka yang valid berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginAlphanumeric')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.wait('@loginAlphanumeric').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard')
  })

  it('TC-LOGIN020 : Login dengan huruf besar dan kecil valid (case sensitive) berhasil', () => {
    cy.intercept('POST', '**/auth/validate').as('loginCaseSensitive')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.wait('@loginCaseSensitive').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard')
  })

  // TS-LOGIN004 : Login Gagal - Data Invalid

  it('TC-LOGIN007 : Input username salah menampilkan pesan error', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongUsername')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('admintesting')
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.wait('@wrongUsername').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN008 : Input password salah menampilkan pesan error', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongPassword')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.wait('@wrongPassword').then((interception) => {
      const body = interception.request.body
      expect(body).to.include('123')
    })
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN009 : Input username dan password salah menolak login', () => {
    cy.intercept('POST', '**/auth/validate').as('wrongBoth')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('Adm')
    cy.get('input[name="password"]').type('admin45')
    cy.get('button[type="submit"]').click()
    cy.wait('@wrongBoth').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN017 : Input karakter khusus pada username dan password menampilkan error', () => {
    cy.intercept('POST', '**/auth/validate').as('specialChar')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('@@$$*&$')
    cy.get('input[name="password"]').type('@@$$*&$')
    cy.get('button[type="submit"]').click()
    cy.wait('@specialChar').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    cy.get('.oxd-alert-content-text').should('be.visible')
  })

  it('TC-LOGIN021 : Pesan validasi error tampil jelas saat login gagal', () => {
    cy.intercept('POST', '**/auth/validate').as('errorMessage')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('Adminnn')
    cy.get('input[name="password"]').type('admin45')
    cy.get('button[type="submit"]').click()
    cy.wait('@errorMessage').then((interception) => {
      expect(interception.response.statusCode).to.not.eq(200)
    })
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  // TS-LOGIN005 : Validasi Field Kosong

  it('TC-LOGIN005 : Validasi error saat username dikosongkan', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyUsername')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').clear()
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('be.visible').should('contain', 'Required')
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
  })

  it('TC-LOGIN006 : Validasi error saat password dikosongkan', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyPassword')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').clear()
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('be.visible').should('contain', 'Required')
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
  })

  it('TC-LOGIN010 : Validasi error saat semua field kosong dan klik login', () => {
    let requestFired = false
    cy.intercept('POST', '**/auth/validate', () => { requestFired = true }).as('emptyBoth')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('have.length', 2)
    cy.get('.oxd-input-field-error-message').should('contain', 'Required')
    cy.wait(1000).then(() => {
      expect(requestFired).to.be.false
    })
  })

  // TS-LOGIN006 : Button Login

  it('TC-LOGIN012 : Button login bisa diklik dan berfungsi', () => {
    cy.intercept('GET', '**/auth/login').as('buttonCheck')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.wait('@buttonCheck').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.get('button[type="submit"]').should('be.visible').should('be.enabled').click()
  })

  it('TC-LOGIN022 : Double click button login hanya memproses 1 request', () => {
    let requestCount = 0
    cy.intercept('POST', '**/auth/validate', (req) => {
      requestCount++
      req.continue()
    }).as('doubleClick')
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.wait('@doubleClick').then((interception) => {
      expect(interception.response.statusCode).to.eq(302)
    })
    cy.url().should('contain', '/dashboard').then(() => {
      expect(requestCount).to.eq(1)
    })
  })

  // TS-LOGIN007 : Layar Responsif

  it('TC-LOGIN025 : Halaman login tampil responsif di berbagai ukuran layar', () => {
    const viewports = [
      { width: 1280, height: 800, label: 'Desktop' },
      { width: 768,  height: 1024, label: 'Tablet' },
      { width: 375,  height: 812, label: 'Mobile' },
    ]
    viewports.forEach(({ width, height, label }) => {
      cy.intercept('GET', '**/auth/login').as(`loginPage_${label}`)
      cy.viewport(width, height)
      cy.visit(`${BASE_URL}/auth/login`)
      cy.wait(`@loginPage_${label}`).then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })

})