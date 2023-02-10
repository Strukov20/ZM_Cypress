import { BaseHelper } from "../../support/baseHepler"

describe('applyForm_refinance', () => {
    beforeEach(() => {
        BaseHelper.login();
    })
    afterEach(() => {
        BaseHelper.logout();
    })
    it('', () => {
        cy.contains('Start new application')
            .click()
    })
})