import { BaseHelper } from "../../support/baseHepler"

describe('Admin Portal Assertions', () => {
    beforeEach(() => {
        const lsAccountsCompanyId = Cypress.config('lsAccountsCompanyId')
        const isAllFFEnabled = Cypress.config('isAllFFEnabled')

        window.localStorage.setItem('lsDomainName', 'bfg-division-apply.cyberdynemortgage.com')
        window.localStorage.setItem('lsAccountsCompanyId', lsAccountsCompanyId)
        window.localStorage.setItem('isAllFFEnabled', isAllFFEnabled)

        BaseHelper.loginToAdmin();
    })
    it('Credit report received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains('TBD Preapproval Houston 77077 TX')
            .click({force: true})

        cy.contains('Personal Info/Credit')
            .click({force: true})

        cy.get('[class="MuiButtonBase-root"]')
            .find('svg[class="MuiSvgIcon-root"]')
            .click({force: true})
    })
})
