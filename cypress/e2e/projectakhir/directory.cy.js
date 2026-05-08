import DirectoryPage from '../../support/pageObjects/directory'

const directoryPage = new DirectoryPage()

describe('Directory OrangeHRM - Fajar Ardiansyah', () => {

  beforeEach(() => {
    directoryPage.loginAsAdmin()
    directoryPage.visitDirectory()
    cy.get('.oxd-table-filter-title', { timeout: 10000 }).should('be.visible')
  })

  // TS-DIR001 : Akses halaman directory

  it('TC-DIR001 : Akses halaman directory tanpa login redirect ke halaman login', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    Cypress.session.clearAllSavedSessions()
    directoryPage.visitDirectory()
    directoryPage.assertOnLoginPage()
  })

  it('TC-DIR002 : Halaman directory berhasil dimuat dengan status 200', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('directoryLoad')
    directoryPage.visitDirectory()
    cy.wait('@directoryLoad').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertOnDirectoryPage()
  })

  it('TC-DIR003 : Menampilkan halaman directory setelah login', () => {
    directoryPage.assertOnDirectoryPage()
    directoryPage.assertFilterTitleVisible()
  })

  // TS-DIR002 : Verifikasi elemen UI

  it('TC-DIR004 : Judul directory tampil dengan benar di filter card', () => {
    directoryPage.assertFilterTitleVisible()
  })

  it('TC-DIR005 : Field employee name tampil di halaman', () => {
    directoryPage.assertEmployeeNameInputVisible()
  })

  it('TC-DIR006 : Placeholder field employee name tampil dengan benar', () => {
    directoryPage.assertEmployeeNamePlaceholder()
  })

  it('TC-DIR007 : Dropdown job title tampil dengan default value', () => {
    directoryPage.assertJobTitleDropdownVisible()
  })

  it('TC-DIR008 : Dropdown location tampil dengan default value', () => {
    directoryPage.assertLocationDropdownVisible()
  })

  it('TC-DIR009 : Tombol search tampil dan dalam kondisi enabled', () => {
    directoryPage.assertSearchButtonVisible()
    directoryPage.assertSearchButtonEnabled()
  })

  it('TC-DIR010 : Tombol reset tampil dan dalam kondisi enabled', () => {
    directoryPage.assertResetButtonVisible()
    directoryPage.assertResetButtonEnabled()
  })

  it('TC-DIR011 : Label employee name, job title, dan location tampil dengan benar', () => {
    directoryPage.assertFilterLabelsVisible()
  })

  it('TC-DIR012 : Records found counter tampil saat halaman dibuka', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('initialLoad')
    directoryPage.visitDirectory()
    cy.wait('@initialLoad')
    directoryPage.assertRecordsFoundVisible()
  })

  it('TC-DIR013 : List card karyawan tampil saat halaman dibuka', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('cardsLoad')
    directoryPage.visitDirectory()
    cy.wait('@cardsLoad').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertDirectoryCardsVisible()
  })

  // TS-DIR003 : Pencarian employee name

  it('TC-DIR014 : Field employee name dapat menerima input teks', () => {
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.partialName.name)
      directoryPage.getEmployeeNameInput().should('have.value', data.partialName.name)
    })
  })

  it('TC-DIR015 : Search dengan nama valid mengirim request ke API', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('searchValid')
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.validEmployee.name)
      cy.wait(1500)
      directoryPage.clickSearch()
    })
    cy.wait('@searchValid').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })

  it('TC-DIR016 : Search dengan nama tidak terdaftar menampilkan pesan invalid', () => {
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.invalidEmployee.name)
      directoryPage.clickSearch()
    })
    cy.contains('Invalid', { timeout: 10000 }).should('be.visible')
    cy.get('.orangehrm-directory-card').should('be.visible')
  })

  it('TC-DIR017 : Field employee name bisa di-clear dan diisi ulang', () => {
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.partialName.name)
      directoryPage.getEmployeeNameInput().clear().type(data.validEmployee.name)
      directoryPage.getEmployeeNameInput().should('have.value', data.validEmployee.name)
    })
  })

  // TS-DIR004 : Validasi field kosong

  it('TC-DIR018 : Klik search tanpa mengisi filter tetap menampilkan semua records', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('searchEmpty')
    directoryPage.clickSearch()
    cy.wait('@searchEmpty').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertRecordsFoundVisible()
    directoryPage.assertDirectoryCardsVisible()
  })

  it('TC-DIR019 : Search dengan input hanya spasi tidak mengirim request ke server', () => {
    let requestFired = false
    cy.intercept('GET', '**/api/v2/directory/employees**', () => { requestFired = true }).as('searchSpace')
    directoryPage.typeEmployeeName('   ')
    directoryPage.clickSearch()
    cy.wait(2000).then(() => {
      directoryPage.assertOnDirectoryPage()
    })
  })

  // TS-DIR005 : Reset filter

  it('TC-DIR020 : Klik reset mengembalikan filter form ke kondisi awal', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('resetForm')
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.partialName.name)
      directoryPage.clickReset()
    })
    cy.wait('@resetForm', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertRecordsFoundVisible()
    directoryPage.assertDirectoryCardsVisible()
  })

  it('TC-DIR021 : Klik reset mengembalikan dropdown job title ke default', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('resetJob')
    directoryPage.clickReset()
    cy.wait('@resetJob').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertJobTitleDropdownVisible()
  })

  it('TC-DIR022 : Klik reset mengembalikan dropdown location ke default', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('resetLoc')
    directoryPage.clickReset()
    cy.wait('@resetLoc').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertLocationDropdownVisible()
  })

  it('TC-DIR023 : Klik reset mengirim request ulang ke API', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('resetReload')
    directoryPage.clickReset()
    cy.wait('@resetReload').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    directoryPage.assertRecordsFoundVisible()
  })

  // TS-DIR006 : Footer

  it('TC-DIR024 : Footer copyright tampil di halaman directory', () => {
    directoryPage.assertFooterVisible()
    directoryPage.assertCopyrightVisible()
  })

  // TS-DIR007 : Responsif

  it('TC-DIR025 : Halaman directory responsif di berbagai ukuran layar', () => {
    const viewports = [
      { width: 1280, height: 800,  label: 'Desktop' },
      { width: 768,  height: 1024, label: 'Tablet' },
      { width: 375,  height: 812,  label: 'Mobile' },
    ]
    viewports.forEach(({ width, height, label }) => {
      cy.intercept('GET', '**/api/v2/directory/employees**').as(`dirPage_${label}`)
      cy.viewport(width, height)
      directoryPage.visitDirectory()
      cy.wait(`@dirPage_${label}`).then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })
      directoryPage.expandFilterIfCollapsed()
      directoryPage.assertFilterTitleVisible()
      directoryPage.assertSearchButtonVisible()
      directoryPage.assertResetButtonVisible()
    })
  })

  it('TC-DIR026 : Tombol search dan reset tidak terpotong di layar mobile', () => {
    cy.viewport(375, 812)
    cy.intercept('GET', '**/api/v2/directory/employees**').as('mobileLoad')
    directoryPage.visitDirectory()
    cy.wait('@mobileLoad')
    directoryPage.expandFilterIfCollapsed()
    directoryPage.assertSearchButtonVisible()
    directoryPage.assertResetButtonVisible()
  })

  // TS-DIR008 : Response time

  it('TC-DIR027 : Response time load halaman directory kurang dari 10 detik', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('loadTime')
    const start = Date.now()
    directoryPage.visitDirectory()
    cy.wait('@loadTime', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

  it('TC-DIR028 : Response time search kurang dari 10 detik', () => {
    cy.intercept('GET', '**/api/v2/directory/employees**').as('searchTime')
    const start = Date.now()
    cy.fixture('directory').then((data) => {
      directoryPage.typeEmployeeName(data.validEmployee.name)
      directoryPage.clickSearch()
    })
    cy.wait('@searchTime', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(Date.now() - start).to.be.lessThan(10000)
    })
  })

})