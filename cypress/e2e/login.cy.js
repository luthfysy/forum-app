/* eslint-disable no-undef */
// cypress/e2e/login.cy.js
/// <reference types="cypress" />

/**
 * Skenario Pengujian End-to-End untuk Alur Login:
 * 1. Login berhasil untuk kredensial yang valid.
 * - Memastikan pengguna diarahkan ke halaman utama setelah login.
 * 2. Login gagal untuk kredensial yang tidak valid.
 * - Memastikan pesan error ditampilkan (melalui alert).
 * - Memastikan pengguna tetap berada di halaman login.
 */
describe('Login Flow E2E Test', () => {
  beforeEach(() => {
    // Kunjungi halaman login sebelum setiap tes
    cy.visit('/login');
    // Mocking window.alert to prevent blocking the test
    cy.on('window:alert', (str) => {
      cy.log(str); // Log the alert message
      return true; // Auto-confirm the alert
    });
    cy.on('window:confirm', (str) => {
      cy.log(str);
      return true;
    });
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'Login success',
        data: {
          token: 'mock_access_token_123',
        },
      },
    }).as('loginApiRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'User found',
        data: {
          user: {
            id: 'user-cypress',
            name: 'Cypress Test User',
            email: 'cypress@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Cypress+Test+User&background=random',
          },
        },
      },
    }).as('getProfileApiRequest');

    cy.get('input[type="email"]').type('cypress@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Memverifikasi bahwa API login dipanggil
    cy.wait('@loginApiRequest').its('request.body').should('deep.equal', {
      email: 'cypress@example.com',
      password: 'password123',
    });

    // Memverifikasi bahwa API getOwnProfile dipanggil
    cy.wait('@getProfileApiRequest');

    // Memverifikasi navigasi ke halaman utama
    cy.url().should('eq', 'http://localhost:3000/'); // Sesuaikan URL
    cy.contains('Forum App').should('be.visible'); // Contoh elemen di halaman utama
    cy.contains('Cypress Test User').should('be.visible'); // Memastikan nama user muncul di header
  });

  it('should show error alert and remain on login page with invalid credentials', () => {
    const errorMessage = 'Invalid credentials';
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 401, // Unauthorized
      body: {
        status: 'fail',
        message: errorMessage,
      },
    }).as('loginApiFailure');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Memverifikasi bahwa API login dipanggil
    cy.wait('@loginApiFailure');

    // Memverifikasi bahwa alert ditampilkan
    cy.contains(errorMessage).should('exist'); // Mengandalkan cy.on('window:alert')

    // Memverifikasi bahwa URL tidak berubah (tetap di halaman login)
    cy.url().should('include', '/login');
  });
});
