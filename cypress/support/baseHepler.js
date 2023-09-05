export class BaseHelper {

    static login () {
        cy.visit('')
        cy.intercept({
            method: "POST",
            url: "api/signin/create-request"
        }).as('getVerification')
        cy.get('[data-testid="header__loginButton"]')
        .click()
        cy.get('[data-testid="phoneNumberModal__mobileNumberInput"]')
            .type('8888888888', {force: true})
        cy.get('[data-testid="phoneNumberModal__submitButton"]')
            .click()
        cy.wait('@getVerification')
            .then((intercept) => {
                const confirmationCode = intercept.response.body.type.confirmationCode;
                cy.get('[name="code"]')
                    .type(confirmationCode)
            })
        // cy.contains('Yes')
        //     .click()
    }

    static logout () {
        cy.visit('')

        cy.intercept({
            method: "GET",
            url: "api/application/*/loan-progress/v3"
        }).as('pageLoaded')

        cy.wait('@pageLoaded')
        .its('response.statusCode')
        .should('equal', 200);

        cy.get('[data-testid="header__dropDownMenuButton"]')
        .should("be.visible")
        .click()

        cy.get('button')
            .contains('Log Out')
            .click()
        // cy.contains('Yes')
        //     .click()
    }   

    static loginToAdmin () {
        cy.visit('')
        cy.get('[name="email"]')
            .type('bstrukov@interfirst.com')
        cy.get('[name="password"]')
            .clear()
            .type('Admin1admin.')
        cy.get('[data-testid="login-button"]')
            .click()
    }

    static clickNextButton () {
        cy.get('[data-testid="footer__nextButton"]')
        .click()
    }

    static loginToLegacyPortal () {
        cy.visit('')

        cy.get('[id="ctl00_ContentPlaceHolder1_loginToDataTrac_UserName"]')
            .type('dmdadmin')

        cy.get('[id="ctl00_ContentPlaceHolder1_loginToDataTrac_Password"]')
            .type('!dmd333')
            
        cy.get('input[value="Log In"]')
            .click()
    }
}