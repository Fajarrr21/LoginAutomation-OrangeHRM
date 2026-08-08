# OrangeHRM — Cypress Automation

Automation testing untuk [OrangeHRM](https://opensource-demo.orangehrmlive.com) menggunakan **Cypress** dengan **Page Object Model (POM)**. Project ini mencakup **UI testing** (Login, Forgot Password, Directory) dan **API testing** (Platzi Fake Store API), lengkap dengan CI via GitHub Actions.

## Tech Stack

- **Cypress** — E2E & API testing framework
- **JavaScript** (ES modules)
- **Page Object Model** — pemisahan selector & aksi dari test
- **cy.intercept** — verifikasi network request & response
- **GitHub Actions** — continuous integration

## Coverage

Total **105 test** tersebar di 4 spec.

| Modul | Skenario | Test |
|-------|----------|------|
| **Login** | akses halaman, verifikasi UI, login sukses/gagal, validasi field kosong, button behavior, responsif | 22 |
| **Forgot Password** | akses, verifikasi UI, submit reset, validasi, fungsi cancel, responsif, response time | 30 |
| **Directory** | pencarian & filter direktori karyawan | 28 |
| **API Platzi** | REST API testing (Platzi Fake Store API) | 25 |

## Test Strategy

- **Selector stabil** — memprioritaskan atribut `name` dan selector semantik.
- **Verifikasi via `cy.intercept`** — banyak test tidak hanya mengecek UI, tapi juga memvalidasi status code request/response (200, 302) untuk memastikan behavior di level network sesuai.
- **Data-driven via fixtures** — data test (kredensial valid/invalid, special char) dipisah ke file fixture, memudahkan maintenance.
- **Validasi field kosong** — menggunakan pengecekan apakah request benar-benar terkirim (bukan hanya UI), memastikan validasi front-end bekerja.
- **Pengujian responsif** — beberapa modul diuji di viewport Desktop, Tablet, dan Mobile.
- **Response time** — beberapa alur kritis diverifikasi selesai di bawah ambang waktu tertentu.

## Struktur Project

```
cypress/
├── e2e/
│   ├── projectakhir/
│   │   ├── loginfinal.cy.js
│   │   ├── forgotpassword.cy.js
│   │   └── directory.cy.js
│   └── Api Platzi/
│       └── api.cy.js
├── fixtures/
│   ├── logindata.json
│   ├── forgotpassword.json
│   └── directory.json
└── support/
    ├── commands.js
    ├── e2e.js
    └── pageObjects/
        ├── loginpage.js
        ├── forgotpassword.js
        └── directory.js
cypress.config.js
.github/workflows/cypress.yml
```

## Prasyarat

- **Node.js** LTS (20 / 22 / 24)
- **npm**

## Install & Run

```bash
git clone https://github.com/Fajarrr21/LoginAutomation-OrangeHRM.git
cd LoginAutomation-OrangeHRM
npm install

# buka Cypress GUI
npx cypress open

# jalankan semua test headless (+ generate report)
npx cypress run

# jalankan spec tertentu
npx cypress run --spec "cypress/e2e/projectakhir/loginfinal.cy.js"
```

## Reporting

Project ini menggunakan **cypress-mochawesome-reporter**. Setelah menjalankan `npx cypress run`, report HTML akan tergenerate di `cypress/reports/html/index.html` — berisi ringkasan pass/fail, chart, dan detail tiap test.

## Catatan

OrangeHRM demo adalah environment publik yang sesekali lambat atau di-reset. Jika ada test yang gagal karena timeout, jalankan ulang — biasanya bukan masalah pada test, melainkan kondisi server demo.

## Author

**Fajar Ardiansyah** — QA Engineer
[GitHub: @Fajarrr21](https://github.com/Fajarrr21)
