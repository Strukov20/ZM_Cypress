const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://dev-apply.cyberdynemortgage.com/',
    viewportHeight : 1080,
    viewportWidth : 1920,
    defaultCommandTimeout : 20000,
    responseTimeout : 120000,
    requestTimeout : 30000
  },
});
