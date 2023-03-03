import { BaseHelper } from "../../support/baseHepler"
import purchaseJson from '../../fixtures/purchase.json'

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

        cy.contains('Start new application')
            .click()
        //What would you like to do today?
        cy.contains(purchaseJson.data.loanType)
            .click()

        //Are you a first time home buyer?
        cy.contains(purchaseJson.data.firstTimeHomeBuyer)
            .click()

        //Where are you in the process currently?
        cy.contains(purchaseJson.data.whereAreYouInTheProcessCurrently)
            .click()

        //What kind of property are you interested in?
        cy.contains(purchaseJson.data.propertyAreInterested)
            .click()

        //Will this be a...
        cy.wait('@progress_pass')
            .its('response.statusCode')
            .should('equal', 200);
        cy.contains(purchaseJson.data.willThisBe).should('be.visible')
        cy.contains(purchaseJson.data.willThisBe)
            .click()
        
        //Property Address
        cy.get('input[name="zip"]')
            .focus()
            .type(purchaseJson.data.propertyAdress)
        cy.get('[class="pac-item"]')
            .click({force:true})
            .wait(1000)
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Property Value
        cy.get('[name="propertyValue"]')
            .focus()
            .type(purchaseJson.data.propertyValue)
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Please give us an idea of your credit score
        cy.contains(purchaseJson.data.creditScore)
            .click()

        //Down Payment
        cy.contains(purchaseJson.data.downPayment)
            .click()
        cy.get('[data-testid="footer__nextButton"]')
            .click()
        
        //Are you working with a realtor?
        cy.contains(purchaseJson.data.workingWithRealtors)
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
            .type(purchaseJson.data.personalInformation.dataOfBirth, {force: true, scrollBehavior: 'center'})
            .wait(1000)
            .trigger('tab', {key: 9})
        cy.get('[data-testid="personalInfoPart__maritalStatusSelect"]')
            .find('input[autocapitalize="none"][aria-autocomplete="list"][role="combobox"]')
            .type(purchaseJson.data.personalInformation.mirintalStatus)
            .get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[name="borrowers[0].socialSecurityNumber"]')
            .focus()
            .type(purchaseJson.data.personalInformation.socialSecurityNumber)
        cy.get('[data-testid="personalInfoPart__citizenshipStatusSelect"]')
            .find('input[autocapitalize="none"][autocorrect="off"][spellcheck="false"]')
            .focus()
            .type(purchaseJson.data.personalInformation.citizenshipStatus)
        cy.get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //Do you want to add a co-borrower?
        cy.get('button[type="button"]')
            .contains(purchaseJson.data.addCoBorrower)
            .click()
        
        //Credit Profile
        cy.get('[data-testid="footer__nextButton"]')
            .click()

        //You will not be able to add, edit or delete co-borrowers at further steps. Would you like to proceed?
        // cy.get('[aria-label="confirm action"]')
        //     .contains(purchaseJson.data.editBorrowerInfo)
        //     .click()

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
            .type(purchaseJson.data.residenceInfo.streetAdress , {force: true, scrollBehavior: 'center'})
        cy.get('[data-testid="currentResidenceAddress__cityInput"]')
            .type(purchaseJson.data.residenceInfo.city , {force: true, scrollBehavior: 'center'})
        cy.get('input[role="combobox"][aria-expanded="false"]')
            .eq(0)
            .type(purchaseJson.data.residenceInfo.state , {force: true, scrollBehavior: 'center'})
        cy.get('[class=" css-z119h0-option"]')
            .click()
        cy.get('[data-testid="currentResidenceAddress__zipCodeInput"]')
            .focus()
            .type(purchaseJson.data.residenceInfo.zip)
        cy.get('[data-testid="currentResidence__startOfResidencePicker"]')
            .clear()
            .type(purchaseJson.data.residenceInfo.currentResidenceLivingData, {force: true})
            .wait(1500)
            .trigger('tab', {key: 9})
            // .trigger('tab', {key: 9})
        cy.get('input[role="combobox"][aria-expanded="false"]')
            .eq(1)
            .type(purchaseJson.data.residenceInfo.residenceType , {force: true, scrollBehavior: 'center'})
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
            .type(purchaseJson.data.assets.assetType)
        cy.get('[class=" css-11lfppk"]')
            .find('[class=" css-z119h0-option"]')
            .click()
        cy.get('input[data-testid="assets[0]__financialInstitutionInput"]')
            .clear({force: true})
            .type(purchaseJson.data.assets.depositorInstitution)
        cy.get('input[data-testid="assets[0]__accountNumberInput"]')
            .clear({force: true})
            .type(purchaseJson.data.assets.accountNumber)
        cy.get('input[data-testid="assets[0]__cashOrMarketValueInput"]')
            .clear({force: true})
            .type(purchaseJson.data.assets.assetValue)
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