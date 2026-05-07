const BASE_URL = 'https://api.escuelajs.co/api/v1'

describe('API Testing Platzi - Fajar Ardiansyah', () => {

  // Request 1: Ambil semua kategori
  it('GET semua categories', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null
      })
  })

  // Request 2: Cek response body adalah array
  it('GET categories - response harus berupa array', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
  })

  // Request 3: Cek jumlah kategori tidak kosong
  it('GET categories - jumlah data tidak kosong', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.be.greaterThan(0)
      })
  })

  // Request 4: Cek struktur data kategori (punya field id, name, image)
  it('GET categories - struktur data harus punya field id, name, image', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        const category = response.body[0]
        expect(category).to.have.property('id')
        expect(category).to.have.property('name')
        expect(category).to.have.property('image')
      })
  })

  // Request 5: Ambil kategori berdasarkan ID
  it('GET category by ID 1', () => {
    cy.request('GET', `${BASE_URL}/categories/1`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(1)
      })
  })

  // Request 6: Cek nama kategori tidak kosong
  it('GET category by ID - field name tidak boleh kosong', () => {
    cy.request('GET', `${BASE_URL}/categories/1`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.name).to.not.be.empty
      })
  })

  // Request 7: Cek field id bertipe number
  it('GET category by ID - field id harus bertipe number', () => {
    cy.request('GET', `${BASE_URL}/categories/1`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.be.a('number')
      })
  })

  // Request 8: Ambil kategori ID 2
  it('GET category by ID 2', () => {
    cy.request('GET', `${BASE_URL}/categories/2`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(2)
      })
  })

  // Request 9: Ambil kategori ID 3
  it('GET category by ID 3', () => {
    cy.request('GET', `${BASE_URL}/categories/3`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(3)
      })
  })

  // Request 10
it('POST create category baru', () => {
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/categories/`,
    body: {
      name: `Kategori Testing ${Date.now()}`,
      image: 'https://picsum.photos/640/640?r=111'
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
  })
})

// Request 11
it('POST create category - response harus punya ID', () => {
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/categories/`,
    body: {
      name: `Kategori Kedua ${Date.now()}`,
      image: 'https://picsum.photos/640/640?r=222'
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body).to.have.property('id')
  })
})

// Request 12
it('POST create category - nama harus sesuai yang dikirim', () => {
  const nama = `Kategori Ketiga ${Date.now()}`
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/categories/`,
    body: {
      name: nama,
      image: 'https://picsum.photos/640/640?r=333'
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body.name).to.eq(nama)
  })
})

// Request 13
it('POST create category - image harus sesuai yang dikirim', () => {
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/categories/`,
    body: {
      name: `Kategori Keempat ${Date.now()}`,
      image: 'https://picsum.photos/640/640?r=444'
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body.image).to.eq('https://picsum.photos/640/640?r=444')
  })
})

  // Request 14: Update kategori
  it('PUT update category - status 200', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/categories/1`,
      body: {
        name: 'Kategori Diupdate'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  // Request 15: Update kategori dan cek nama berubah
  it('PUT update category - nama harus berubah sesuai input', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/categories/2`,
      body: {
        name: 'Nama Baru Category 2'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq('Nama Baru Category 2')
    })
  })

  // Request 16: Update kategori dan cek ID tidak berubah
  it('PUT update category - ID tidak boleh berubah', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/categories/3`,
      body: {
        name: 'Update Category 3'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(3)
    })
  })

  // Request 17: Update image kategori
  it('PUT update category - update field image', () => {
    cy.request({
      method: 'PUT',
      url: `${BASE_URL}/categories/1`,
      body: {
        image: 'https://picsum.photos/640/640?r=777'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.image).to.eq('https://picsum.photos/640/640?r=777')
    })
  })

  // Request 18: Hapus kategori (buat dulu, baru hapus)
  it('DELETE category - status berhasil', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/categories/`,
      body: {
        name: 'Category Akan Dihapus',
        image: 'https://picsum.photos/640/640?r=888'
      }
    }).then((createResponse) => {
      const newId = createResponse.body.id
      cy.request({
        method: 'DELETE',
        url: `${BASE_URL}/categories/${newId}`,
        failOnStatusCode: false
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.be.oneOf([200, 201, 204])
      })
    })
  })

  // Request 19: Ambil produk berdasarkan kategori
  it('GET products by category ID', () => {
    cy.request('GET', `${BASE_URL}/categories/1/products`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
  })

  // Request 20: Cek produk by kategori tidak null
  it('GET products by category - response tidak null', () => {
    cy.request('GET', `${BASE_URL}/categories/2/products`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null
      })
  })

  // Request 21: Cek header Content-Type
  it('GET categories - header Content-Type harus application/json', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')
      })
  })

  // Request 22: Cek response time tidak terlalu lama
  it('GET categories - response time harus di bawah 5 detik', () => {
    const start = Date.now()
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lessThan(5000)
      })
  })

  // Request 23: GET kategori ID yang tidak ada
  it('GET category ID tidak valid - harus return error', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/categories/99999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404])
    })
  })

  // Request 24: POST kategori tanpa field name
  it('POST category tanpa nama - harus return error', () => {
    cy.request({
      method: 'POST',
      url: `${BASE_URL}/categories/`,
      body: {
        image: 'https://picsum.photos/640/640?r=555'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 422, 500])
    })
  })

  // Request 25: Cek field name di setiap kategori bertipe string
  it('GET categories - semua field name harus bertipe string', () => {
    cy.request('GET', `${BASE_URL}/categories`)
      .then((response) => {
        expect(response.status).to.eq(200)
        response.body.forEach((category) => {
          expect(category.name).to.be.a('string')
        })
      })
  })

})