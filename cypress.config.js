/* eslint-disable import/no-extraneous-dependencies */
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});
