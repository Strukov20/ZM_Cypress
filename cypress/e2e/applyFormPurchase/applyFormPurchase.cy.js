import { BaseHelper } from "../../support/baseHepler"

describe('applyForm_refinance', () => {
    beforeEach(() => {
        indexedDB.deleteDatabase('localforage') // LogOut
        window.localStorage.setItem('interfirstApply.changedDomainName', 'bfg-division-apply.cyberdynemortgage.com')
        BaseHelper.login();
    })
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
        cy.contains('purchase')
            .click()

        //Are you a first time home buyer?
        cy.contains('No')
            .click()

        //Where are you in the process currently?
        cy.contains('Searching or Shopping Around')
            .click()

        //What kind of property are you interested in?
        cy.contains('single family')
            .click()

        //Will this be a...
        cy.wait('@progress_pass')
            .its('response.statusCode')
            .should('equal', 200);
        cy.contains('primary residence').should('be.visible')
        cy.contains('primary residence')
            .click()
        
        //Property Address
        cy.get('input[name="zip"]')
            .focus()
            .type('77077')
        cy.get('[class="pac-item"]')
            .click({force:true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()
            cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Property Value
        cy.get('[name="propertyValue"]')
            .focus()
            .type('444000')
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Please give us an idea of your credit score
        cy.contains('Excellent')
            .click()

        //Down Payment
        cy.contains('20%')
            .click()
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        
        //Are you working with a realtor?
        cy.contains('No')
            .click()
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
            .type('11111940', {force: true, scrollBehavior: 'center'})
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
        cy.get('input[name="taxesInsuranceEscrowed"]')
            .eq(0)
            .check({force:true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Title Holder
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Residence Info
        cy.get('[data-testid="currentResidenceAddress__streetAddressInput"]')
            .type('7700 Floyd Curl Dr', {force: true, scrollBehavior: 'center'})
        cy.get('[data-testid="currentResidenceAddress__cityInput"]')
            .type('San Antonio', {force: true, scrollBehavior: 'center'})
        cy.get('input[role="combobox"][aria-expanded="false"]')
            .eq(0)
            .type('Texas', {force: true, scrollBehavior: 'center'})
        cy.get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="currentResidenceAddress__zipCodeInput"]')
            .focus()
            .type('77077')
        cy.get('[data-testid="currentResidence__startOfResidencePicker"]')
            .clear()
            .type('11111990', {force: true})
            .wait(1000)
            .trigger('tab', {key: 9})
            .trigger('tab', {key: 9})
        cy.get('input[role="combobox"][aria-expanded="false"]')
            .eq(1)
            .type('Own', {force: true, scrollBehavior: 'center'})
        cy.get('[class=" css-11lfppk"]')
            .find('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        
        //Additional Real Estate Owned
        cy.get('[data-testid="hasPropertiesRadioGroup__component"]')
            .find('[data-testid="NoRadioButton__component"]')
            .find('input[name="hasProperties"]')
            .click({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Income
        cy.get('[data-testid="hasIncomesRadioGroup__component"]')
            .find('[data-testid="NoRadioButton__component"]')
            .find('input[name="hasIncomes"]')
            .click({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Down Payment Source
        cy.get('input[value="Gift"]')
            .check({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Assets
        cy.get('input[name="hasAssets"][value="No"]')
            .click({force: true})
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        cy.get('button[aria-label="confirm action"]')
            .click()
        cy.wait(1000)
        cy.get('input[type="text"][role="combobox"]')
            .clear()
            .type('Savings')
        cy.get('[class=" css-11lfppk"]')
            .find('[class=" css-z119h0-option"]')
            .click()
        cy.get('input[data-testid="assets[0]__financialInstitutionInput"]')
            .clear({force: true})
            .type('qwerty')
        cy.get('input[data-testid="assets[0]__accountNumberInput"]')
            .clear({force: true})
            .type('123123')
        cy.get('input[data-testid="assets[0]__cashOrMarketValueInput"]')
            .clear({force: true})
            .type('123456')
            .wait(1000)
        cy.get('[data-testid="footer__nextButton"]')
            .click() 
            
        //Do you have any other assets?
        cy.get('button[aria-label="cancel action"]')
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
        cy.get('[data-testid="rate_30"]')
            .eq(0)
            .click('left', { force: true })
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        cy.wait('@SecondPartSubmit')
            .its('response.statusCode')
            .should('equal', 200);

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