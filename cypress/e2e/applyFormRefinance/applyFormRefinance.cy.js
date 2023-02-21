import { BaseHelper } from "../../support/baseHepler"

describe('applyForm_refinance', () => {
    beforeEach(() => {
        // BaseHelper.logout();
        indexedDB.deleteDatabase('localforage')
        window.localStorage.setItem('interfirstApply.changedDomainName', 'bfg-division-apply.cyberdynemortgage.com')
        BaseHelper.login();
    })
    // afterEach(() => {
    //     BaseHelper.logout();
    // })
    it('Base refinance flow', () => {
        cy.intercept({
            method: "GET",
            url: "api/application/*/progress/v1"
        }).as('progress_pass')

        cy.intercept({
            method: "GET",
            url: "api/application/*/loan-options/v3"
        }).as('ProgramsReceived_first')

        cy.intercept({
            method: "POST",
            url: "api/application/*/submit-first-part/v1"
        }).as('FirstPartSubmit')

        cy.intercept({
            method: "POST",
            url: "api/application/*/start-getting-credit-report/v1"
        }).as('startGettingCreditReport')

        cy.intercept({
            method: "GET",
            url: "api/application/*/final-loan-options/v2"
        }).as('ProgramsReceived_second')

        cy.intercept({
            method: "POST",
            url: "api/application/*/submit-second-part/v1"
        }).as('SecondPartSubmit')

        //Pre-Qualification

        cy.contains('Start new application')
            .click()
        //What would you like to do today?
        cy.contains('refinance')
            .click()

        //What kind of property are you interested in?
        cy.contains('condo')
            .click()

        //Will this be a...
        cy.wait('@progress_pass')
            .its('response.statusCode')
            .should('equal', 200);
        cy.contains('primary residence').should('be.visible')
        cy.contains('primary residence')
            .click()
        
        //Property Address
        cy.get('[data-testid="address__streetAddressInput"]')
            .type('7700 Floyd Curl Dr', {force: true, scrollBehavior: 'center'})
        cy.get('[data-testid="address__cityInput"]')
            .type('San Antonio', {force: true, scrollBehavior: 'center'})
        cy.get('input[role="combobox"][aria-expanded="false"]')
            .type('Texas', {force: true, scrollBehavior: 'center'})
        cy.get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="address__zipCodeInput"]')
            .focus()
            .type('78229')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Property Value
        cy.get('[name="propertyValue"]')
            .focus()
            .type('700000')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //How much do you owe on your current mortgage?
        cy.get('[name="firstMortgageBalance"]') 
            .focus()
            .type('210279')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //What would you like to do today?
        cy.contains('Take cash out of your home')
            .click()
        
        //Cash Out Amount
        cy.get('[name="cashOutAmount"]')
            .focus()
            .type('2500')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Please give us an idea of your credit score
        cy.contains('Excellent')
            .click()

        // //Additional question
        // cy.get('[name="Answer"]')
        //     .focus()
        //     .type('1234')
        // cy.get('[data-testid="footer__nextButton"]')
        //     .click()

        //Enter the information below to see your rates
        cy.get('input[name="isConsentObtained"]')
            .check({ force: true })
        cy.get('input[name="isUserAgreeToReceiveSms"]')
            .check({ force: true })
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Rate Comparison
        cy.wait('@ProgramsReceived_first')
            .its('response.statusCode')
            .should('equal', 200);
        cy.get('[data-testid="rate_30"]')
            .eq(0)
            .click('left', { force: true })
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        cy.wait('@FirstPartSubmit')
            .its('response.statusCode')
            .should('equal', 200);

        //Personal Info
        cy.get('input[data-testid="personalInfoPart__dateOfBirth"]')
            .clear()
            .type('11111930', {force: true, scrollBehavior: 'center'})
            .trigger('tab', {key: 9})
        cy.get('[data-testid="personalInfoPart__maritalStatusSelect"]')
            .find('input[autocapitalize="none"][aria-autocomplete="list"][role="combobox"]')
            .type('Married')
            .get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[name="borrowers[0].socialSecurityNumber"]')
            .focus()
            .type('999603333')
        cy.get('[data-testid="personalInfoPart__citizenshipStatusSelect"]')
            .find('input[autocapitalize="none"][autocorrect="off"][spellcheck="false"]')
            .focus()
            .type('Citizen')
        cy.get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Do you want to add a co-borrower?
        cy.get('[aria-label="cancel action"]')
            .contains('No')
            .click()
        
        //Credit Profile
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //You will not be able to add, edit or delete co-borrowers at further steps. Would you like to proceed?
        cy.get('[aria-label="confirm action"]')
            .contains('Yes')
            .click()

        //Property Information
        // cy.wait('@startGettingCreditReport')
        //     .its('response.statusCode')
        //     .should('equal', 200);
        cy.wait(1000)
        cy.get('[name="yearBuilt"]')
            .focus()
            .type('2000')
        cy.get('input[name="taxesInsuranceEscrowed"]')
            .eq(0)
            .check({force:true})
        // cy.get('[id="mortgages[0].monthlyMortgagePayment28"]')
        //     .focus()
        //     .type('1,691')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Title Holder
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Residence Info
        cy.get('[data-testid="currentResidence__startOfResidencePicker"]')
            .focus()
            .type('002011998')
            .trigger('keydown', { keyCode: 9 })
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        
        //Additional Real Estate Owned
        cy.get('[data-testid="NoRadioButton__component"]')
            .find('[name="hasProperties"]')
            .check({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click() 
            
        //Income
        cy.get('[data-testid="NoRadioButton__component"]')
            .find('[name="hasIncomes"]')
            .check({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click() 
        
        //Assets
        cy.get('[data-testid="NoRadioButton__component"]')
            .find('[name="hasAssets"]')
            .check({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click() 
        //Property and Loan Declarations
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Declarations about your finances
        cy.wait(1000)
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Military Services
        cy.wait(1000)
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Homeownership Education and Housing Counseling
        cy.get('[data-testid="isBorrowerCompletedHomeownershipEducationRadioGroup__component"]')
            .find('[data-testid="NoRadioButton__component"]')
            .find('[name="isBorrowerCompletedHomeownershipEducation"]')
            .check()
        cy.get('[data-testid="isBorrowerCompletedHousingCounselingRadioGroup__component"]')
            .find('[data-testid="NoRadioButton__component"]')
            .find('[name="isBorrowerCompletedHousingCounseling"]')
            .check()
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Language Preferences
        cy.get('[data-testid="languagePreferenceRadioGroup__component"]')
            .find('[data-testid="EnglishRadioButton__component"]')
            .find('[name="languagePreference"]')
            .check({force:true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Demographic Information
        cy.get('input[name="isEthnicityNotProvided"]')
            .check({force:true})
        cy.get('input[name="sex"][value="NotProvided"]')
            .check({force:true})
        cy.get('input[name="isRaceNotProvided"]')
            .check({force:true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Review
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Compare Terms
        cy.wait('@ProgramsReceived_second')
            .its('response.statusCode')
            .should('equal', 200);
        // cy.get('[data-testid="rate_30"]')
        //     .eq(0)
        //     .click('left', { force: true })
        // cy.get('[data-testid="footer__nextButton"]')
        //     .click()
        // cy.wait('@SecondPartSubmit')
        //     .its('response.statusCode')
        //     .should('equal', 200);

        // //Document SIGN
        // cy.wait(10000)
        // cy.get('[class="m-signature-request-preview--test-warning--content"]')
        //     .find('[data-btn="common"]')
        //     .click()

        // cy.get('[class="m-signature-request-preview--get-started-button-container"]')
        //     .find('[data-btn="common"]')
        //     .click()

        // cy.get('[data-qa-ref="field-signature"]')
        //     .click()
        
        // cy.get('[class="signature-modal-tab-bar__list"]')
        //     .find('[data-qa-ref="signing-modal--T"]')
        //     .click()

        // cy.get('[data-qa-ref="signing-modal--type-in-field"]')
        //     .clear()
        //     .type('Cypress', {force: true})
    })
})