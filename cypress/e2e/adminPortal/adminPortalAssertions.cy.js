import { BaseHelper } from "../../support/baseHepler"
import adminPortalJson from "../../fixtures/adminPortal.json"

describe('Admin Portal Assertions', () => {
    beforeEach(() => {
        const lsAccountsCompanyId = Cypress.config('lsAccountsCompanyId')
        const isAllFFEnabled = Cypress.config('isAllFFEnabled')
        const lsRedirectUrl = Cypress.config('lsRedirectUrl')

        window.localStorage.setItem('lsDomainName', 'bfg-division-apply.cyberdynemortgage.com')
        window.localStorage.setItem('lsAccountsCompanyId', lsAccountsCompanyId)
        window.localStorage.setItem('isAllFFEnabled', isAllFFEnabled)
        window.localStorage.setItem('isAllFFEnabled', lsRedirectUrl)

        BaseHelper.loginToAdmin();
    })
    it('Credit report received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains(adminPortalJson.data.refinanceLoanID)
            .click({force: true})

        cy.contains('Personal Info/Credit')
            .click({force: true})

        cy.get('[class="MuiButtonBase-root MuiAccordionSummary-root"]')
            .find('[class="MuiButtonBase-root MuiIconButton-root MuiAccordionSummary-expandIcon MuiIconButton-edgeEnd"]')
            .find('span[class="MuiIconButton-label"]')
            .find('svg[class="MuiSvgIcon-root"]')
            .click({force: true})

        cy.get('[data-testid="2-group"]')
            .find('[data-testid="0-row"]')
            .find('[data-testid="credit-score"]')
            .should('have.text', adminPortalJson.data.creditScore)
    }),
    
    it('Doc Review Fee received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains(adminPortalJson.data.refinanceLoanID)
            .click({force: true})

        cy.get('[class="MuiButtonBase-root MuiTabScrollButton-root MuiTabs-scrollButtons MuiTabs-scrollButtonsDesktop"]')
            .find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"]')
            .click()
            .click()

        cy.get('[class="MuiTab-wrapper"]')
            .contains('Fees')
            .click({force: true})

        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pr-5 content-view-generator__field-label content-view-generator__field-label-[8].amount w-full truncate"]')
            .should('have.text', 'Doc Review Fee:')
        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pl-5 content-view-generator__field-value content-view-generator__field-value-[8].amount max-w-136 text-right"]')
            .find('span')
            .should('have.text', adminPortalJson.data.DocReviewFeeValue)
    }),

    it('CONDOMINIUM DOCS received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains(adminPortalJson.data.refinanceLoanID)
            .click({force: true})

        cy.get('[class="MuiButtonBase-root MuiTabScrollButton-root MuiTabs-scrollButtons MuiTabs-scrollButtonsDesktop"]')
            .find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"]')
            .click()
            .click()

        cy.get('[class="MuiTab-wrapper"]')
            .contains('Fees')
            .click({force: true})

        cy.get('[data-testid="0-group"]')
            .find('[class="w-1/2 pr-5 content-view-generator__field-label content-view-generator__field-label-[0].amount w-full truncate"]')
            .should('have.text', 'CONDOMINIUM DOCS:')
        cy.get('[data-testid="0-group"]')
            .find('[class="w-1/2 pl-5 content-view-generator__field-value content-view-generator__field-value-[0].amount max-w-136 text-right"]')
            .find('span')
            .should('have.text', adminPortalJson.data.CondominimumDocsValue)
    }),

    it('Subordination Fee received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains(adminPortalJson.data.refinanceLoanID)
            .click({force: true})

        cy.get('[class="MuiButtonBase-root MuiTabScrollButton-root MuiTabs-scrollButtons MuiTabs-scrollButtonsDesktop"]')
            .find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"]')
            .click()
            .click()

        cy.get('[class="MuiTab-wrapper"]')
            .contains('Fees')
            .click({force: true})

        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pr-5 content-view-generator__field-label content-view-generator__field-label-[6].amount w-full truncate"]')
            .should('have.text', 'Subordination Fee:')
        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pl-5 content-view-generator__field-value content-view-generator__field-value-[6].amount max-w-136 text-right"]')
            .find('span')
            .should('have.text', adminPortalJson.data.SubordinationFeeValue)
    }),

    it('Recording fees and other taxes received', () => {
        //Open loans page
        cy.get('[data-testid="loans"]')
            .click({force: true})
        
        cy.contains(adminPortalJson.data.purchaseLoanID)
            .click({force: true})

        cy.get('[class="MuiButtonBase-root MuiTabScrollButton-root MuiTabs-scrollButtons MuiTabs-scrollButtonsDesktop"]')
            .find('[class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"]')
            .click()
            .click()

        cy.get('[class="MuiTab-wrapper"]')
            .contains('Fees')
            .click({force: true})

        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pr-5 content-view-generator__field-label content-view-generator__field-label-[11].amount w-full truncate"]')
            .should('have.text', 'Recording fees and other taxes:')
        cy.get('[data-testid="1-group"]')
            .find('[class="w-1/2 pl-5 content-view-generator__field-value content-view-generator__field-value-[11].amount max-w-136 text-right"]')
            .find('span')
            .should('have.text', adminPortalJson.data.RecordingFeesAndOtherTaxesValue)
    })
})
