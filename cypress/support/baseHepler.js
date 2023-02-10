export class BaseHelper {
    static login () {
        cy.visit('https://application.interfirst.com/')
        cy.intercept({
            method: "POST",
            url: "https://skynet-accounts-api.azurewebsites.net/api/signin/createrequest"
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
        cy.visit('https://application.interfirst.com/')
        cy.get('[data-testid="header__dropDownMenuButton"]')
        .click()
        cy.get('button')
            .contains('Log Out')
            .click()
        // cy.contains('Yes')
        //     .click()
    }   
}