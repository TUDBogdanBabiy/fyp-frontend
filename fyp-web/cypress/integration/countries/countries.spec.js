/// <reference types="Cypress" />

context('Countries Table', () => {
  beforeEach(() => {
    cy.visit('/#/countries');

    cy.wait('@getUserCredentials');

    cy.wait('@getCountries');

    cy.get('#countries__table > tbody > tr').should('have.length', 10);
  });

  it('shows the country name', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', 'Afghanistan');
  });

  it('shows the country ISO Code', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', 'AF');
  });

  it('shows the number of networks for a country', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', '2');
  });

  it('shows the country names', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', 'Afghanistan');
  });

  it('shows who and when last modified each country', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', '2016-05-26T09:50:28+00:00 - support');
  });

  it('filters', () => {
    cy.get('#countries__search__input').type('Ukraine');

    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .should('contain', 'Ukraine');

    cy.get('#countries__search__input').clear();

    cy.get('#countries__search__input').type('does not exist');

    cy.get('#countries__table > tbody').should('contain', 'no records');

    cy.get('#countries__search__input').clear();
  });

  it('Adds a Country', () => {
    cy.get('#countries__add__button').click();
    cy.url().should('include', '/countries/add');
    cy.get('.breadcrumb-item')
      .eq(1)
      .should('contain', 'Add');

    cy.get('#country__name__input').type('111');
    cy.get('.invalid-feedback').should(
      'contain',
      'Must contain only alphabetic characters'
    );
    cy.get('#country__name__input').clear();
    cy.get('#country__name__input').type('Ireland');
    cy.get('#country__isoCode__input').type('*');
    cy.get('.invalid-feedback').should(
      'contain',
      'Must contain only alphabetic characters'
    );
    cy.get('#country__isoCode__input').clear();
    cy.get('#country__isoCode__input').type('IE');
    cy.get('#country__countryCodes__formGroup')
      .find('input')
      .focus()
      .type('353')
      .type('{enter}');
    cy.get('#country__mobileCountryCodes__formGroup')
      .find('input')
      .focus()
      .type('123')
      .type('{enter}');

    cy.get('#country__save__button').click();
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });

  it('Edits a Country', () => {
    cy.get('#countries__table > tbody > tr')
      .eq(0)
      .contains('Afghanistan')
      .click();
    cy.wait('@getCountry');
    cy.url().should('include', '/countries/edit/AF');
    cy.get('.breadcrumb-item')
      .eq(1)
      .should('contain', 'Edit');
    cy.get('.breadcrumb-item')
      .eq(2)
      .should('contain', 'AF');
    cy.get('#country__name__input').should('be.disabled');
    cy.get('#country__isoCode__input').should('be.disabled');
    cy.get('#country__countryCodes__formGroup')
      .find('input')
      .focus()
      .should('be.disabled');
    cy.get('#country__mobileCountryCodes__formGroup')
      .find('input')
      .focus()
      .should('be.disabled');
    cy.get('#country__edit__button').click();
    cy.get('#country__countryCodes__formGroup')
      .find('input')
      .focus()
      .type('359')
      .type('{enter}');
    cy.get('#country__save__button').click();
    cy.wait('@updateCountry');
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });

  it('Deletes Country', () => {
    cy.url().should('include', '/countries');
    cy.get('#countries__table__Afghanistan__actions')
      .contains('Delete')
      .click({ force: true });

    cy.get('button')
      .contains('Delete')
      .click();
    cy.wait('@deleteCountry');
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });

  it('Exports Countries & Networks as CSV', () => {
    cy.url().should('include', '/countries');
    cy.get('#countries__actions__BV_toggle_').click();
    cy.get('#countries__actions__export').click();
    cy.wait('@downloadCountries');
  });

  it('Imports Countries & Networks from a CSV', () => {
    cy.url().should('include', '/countries');
    cy.get('#countries__actions__BV_toggle_').click();
    cy.get('#countries__actions__import').click();
    cy.get('[data-cy="file-input"]').attachFile('Countries_Networks.csv');
    cy.get('[data-cy="file-input"]').trigger('change');
    cy.get('.btn-primary')
      .contains('Import')
      .click();
    cy.wait('@uploadCountries');
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });
});
