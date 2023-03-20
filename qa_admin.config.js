const { defineConfig } = require("cypress")

module.exports = defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    //change url for other companies, 
    baseUrl: 'https://qa-skynet.cyberdynemortgage.com/',
    lsAccountsCompanyId: "47432c6f-a899-422e-a421-9d53c9eb37a0",
    isAllFFEnabled: "true",
    viewportHeight : 1080,
    viewportWidth : 1920,
    defaultCommandTimeout : 30000,
    responseTimeout : 120000,
    requestTimeout : 60000,
    numTestsKeptInMemory : 10
  },
  env: {
    build : "stage",
  },
});