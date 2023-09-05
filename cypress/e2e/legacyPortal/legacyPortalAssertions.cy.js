import { BaseHelper } from "../../support/baseHepler"
import legacyPortalJson from "../../fixtures/legacyPortal.json"

describe('legacy Portal', () => {
    beforeEach(() => {
        BaseHelper.loginToLegacyPortal()
    })

    context('Dashboard page', () => {

        it('Legacy Portal was loaded', () => {
            cy.get('[class="dashboardtitle"]')
                .contains(legacyPortalJson.dashboardPage.dashboardTitle)
                .should('be.visible')
        }),
    
        it('Loan was opened on Legacy Portal', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[class="liheader-who-ln"]')
                .should('contain.text', legacyPortalJson.dashboardPage.borrowerName)
        }),
    
        it+('Property Address is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[id="ctl00_ContentPlaceHolder1_labelBIPropertyAddress"]')
                .should('contain.text', legacyPortalJson.dashboardPage.propertyAddress)      
        })
    
        it('LoanFICO is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[id="ctl00_ContentPlaceHolder1_labelBIFICO"]')
                .should('contain.text', legacyPortalJson.dashboardPage.LoanFICO)
        }),
    
        it('Loan Amount is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[id="ctl00_ContentPlaceHolder1_labelBILoanAmount"]')
                .should('contain.text', legacyPortalJson.dashboardPage.loanAmount)
        }),
    
        it('Appraised Value is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[id="ctl00_ContentPlaceHolder1_labelBIAppraisedValue"]')
                .should('contain.text', legacyPortalJson.dashboardPage.appraisedValue)
        }),
    
        it('Loan Status is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[class="stepmajorlabel"]')
                .contains(legacyPortalJson.dashboardPage.loanStatus)
                .should('contain.text', legacyPortalJson.dashboardPage.loanStatus)
        })

    }),

    context('General page', () => {

        it('Originator is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[class="rtsTxt"]')
                .contains('General')
                .click()
            cy.get('[id="ctl00_ContentPlaceHolder1_generalTab_labelOriginator"]')
                .should('contain.text', legacyPortalJson.generalPage.originator)
        }),
    
        it('Property Type is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[class="rtsTxt"]')
                .contains('General')
                .click()
            cy.get('[id="ctl00_ContentPlaceHolder1_generalTab_labelPropertyType"]')
                .should('contain.text', legacyPortalJson.generalPage.propertyType)
        }),
        
        it('Purpose Of Refinance is correct', () => {
            cy.get('input[value="Search Pipeline"]')
                .clear()
                .type(legacyPortalJson.dashboardPage.portalLoanNumber)
                .type('{enter}')
            cy.get('[class="rtsTxt"]')
                .contains('General')
                .click()
            cy.get('[id="ctl00_ContentPlaceHolder1_generalTab_labelRefinacePurpose"]')
                .should('contain.text', legacyPortalJson.generalPage.purposeOfRefinance)
        })
    })    
})