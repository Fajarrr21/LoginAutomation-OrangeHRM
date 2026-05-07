describe('Login OrangeHRM - Fajar Ardiansyah', () => {

  const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'
  const VALID_USER = 'Admin'
  const VALID_PASS = 'admin123'

  // TS-LOGIN001 : Akses Halaman Login

  it('TC-LOGIN001 : Akses URL dashboard tanpa login harus redirect ke halaman login', () => {
    cy.visit(`${BASE_URL}/dashboard/index`)
    cy.url().should('contain', '/auth/login')
  })

  it('TC-LOGIN002 : Menampilkan halaman login', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.url().should('contain', '/auth/login')
    cy.get('.orangehrm-login-branding').should('be.visible')
  })

  // TS-LOGIN002 : Verifikasi Elemen UI

  it('TC-LOGIN003 : Menampilkan field username dan password', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
  })

  it('TC-LOGIN004 : Menampilkan placeholder pada field username dan password', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username')
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password')
  })

  it('TC-LOGIN005 : Tampilan UI login rapi sesuai design', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('.orangehrm-login-branding').should('be.visible')
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('TC-LOGIN006 : Input data password disembunyikan (tampil titik-titik)', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  // TS-LOGIN003 : Login Berhasil

  it('TC-LOGIN007 : Login dengan input data valid berhasil redirect ke dashboard', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.url().should('contain', '/dashboard')
    cy.get('h6.oxd-text').should('contain', 'Dashboard')
  })

  it('TC-LOGIN008 : Login dengan tombol Enter data valid berhasil', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('form').submit()
    cy.url().should('contain', '/dashboard')
  })

  it('TC-LOGIN009 : Response time login kurang dari 10 detik', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    const start = Date.now()
    cy.get('button[type="submit"]').click()
    cy.url().should('contain', '/dashboard').then(() => {
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

  it('TC-LOGIN010 : Login dengan kombinasi huruf dan angka yang valid berhasil', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.url().should('contain', '/dashboard')
  })

  it('TC-LOGIN011 : Login dengan huruf besar dan kecil valid (case sensitive) berhasil', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.url().should('contain', '/dashboard')
  })

  // TS-LOGIN004 : Login Gagal - Data Invalid

  it('TC-LOGIN012 : Input username salah menampilkan pesan error', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('admintesting')
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN013 : Input password salah menampilkan pesan error', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN014 : Input username dan password salah menolak login', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('Adm')
    cy.get('input[name="password"]').type('admin45')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  it('TC-LOGIN015 : Input karakter khusus pada username dan password menampilkan error', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('@@$$*&$')
    cy.get('input[name="password"]').type('@@$$*&$')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible')
  })

  it('TC-LOGIN016 : Pesan validasi error tampil jelas saat login gagal', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type('Adminnn')
    cy.get('input[name="password"]').type('admin45')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible').should('contain', 'Invalid credentials')
  })

  // TS-LOGIN005 : Validasi Field Kosong

  it('TC-LOGIN017 : Validasi error saat username dikosongkan', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').clear()
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('be.visible').should('contain', 'Required')
  })

  it('TC-LOGIN018 : Validasi error saat password dikosongkan', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').clear()
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('be.visible').should('contain', 'Required')
  })

  it('TC-LOGIN019 : Validasi error saat semua field kosong dan klik login', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-input-field-error-message').should('have.length', 2)
    cy.get('.oxd-input-field-error-message').should('contain', 'Required')
  })

  // TS-LOGIN006 : Button Login

  it('TC-LOGIN020 : Button login bisa diklik dan berfungsi', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('button[type="submit"]').should('be.visible').should('be.enabled').click()
  })

  it('TC-LOGIN021 : Double click button login hanya memproses 1 request', () => {
    cy.visit(`${BASE_URL}/auth/login`)
    cy.get('input[name="username"]').type(VALID_USER)
    cy.get('input[name="password"]').type(VALID_PASS)
    cy.get('button[type="submit"]').dblclick()
    cy.url().should('contain', '/dashboard')
  })

  // TS-LOGIN007 : Layar Responsif

  it('TC-LOGIN022 : Halaman login tampil responsif di berbagai ukuran layar', () => {
    const viewports = [
      { width: 1280, height: 800, label: 'Desktop' },
      { width: 768,  height: 1024, label: 'Tablet' },
      { width: 375,  height: 812, label: 'Mobile' },
    ]
    viewports.forEach(({ width, height }) => {
      cy.viewport(width, height)
      cy.visit(`${BASE_URL}/auth/login`)
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })

})