/// <reference types="Cypress" />

context('Networks Table', () => {
  beforeEach(() => {
    cy.visit('/#/countries/edit/AF/details');

    cy.wait('@getUserCredentials');

    cy.wait('@getCountry');

    cy.get('#country__networks__tab___BV_tab_button__').click();

    cy.get('#networks__table > tbody > tr').should('have.length', 2);
  });

  it('shows the network name', () => {
    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', 'AFGAR_MTN');
  });

  it('shows the network Tap Codes', () => {
    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', 'AFGAR');
  });

  it('shows the network MCC-MNCS', () => {
    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', '41240');
  });

  it('shows the network E214-mapping', () => {
    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', '41240 -> 9377944444');
  });

  it('shows the network IP Routing Prefixes', () => {
    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', '');
  });

  it('filters', () => {
    cy.get('#networks__search__input').type('AFGAR_MTN');

    cy.get('#networks__table > tbody > tr')
      .eq(0)
      .should('contain', 'AFGAR_MTN');

    cy.get('#networks__search__input').clear();

    cy.get('#networks__search__input').type('does not exist');

    cy.get('#networks__table > tbody').should(
      'contain',
      'There are no records matching your request'
    );

    cy.get('#networks__search__input').clear();
  });

  it('adds a network', () => {
    cy.get('#networks__add__button').click();

    cy.get('#network__name__input').type('AFGAN MTN');
    cy.get('#network__name__feedback').should(
      'contain',
      'Must contain only alphanumeric characters and undercores'
    );
    cy.get('#network__name__input').clear();
    cy.get('#network__name__input').type('AFGAN_MTN');

    cy.get('#network__tapCodes__select').type('AFGANISTAN{enter}', {
      force: true
    });
    cy.get('#network__tapCode__feedback').should(
      'contain',
      'Must contain alphanumeric characters and be 5 characters in length'
    );
    cy.get('#network__tapCodes__select').clear({ force: true });
    cy.get('#network__tapCodes__select').type('AFGAN{enter}', {
      force: true
    });

    cy.get('#network__mccMncs__select').type('cc-mnc{enter}', {
      force: true
    });
    cy.get('#network__mccMnc__feedback').should(
      'contain',
      'Must contain only numeric characters'
    );
    cy.get('#network__mccMncs__select').clear({ force: true });
    cy.get('#network__mccMncs__select').type('9876{enter}', {
      force: true
    });

    cy.get('#network__ccNdcs__select').type('cc-ndc{enter}', {
      force: true
    });
    cy.get('#network__ccNdc__feedback').should(
      'contain',
      'Must contain only numeric characters'
    );
    cy.get('#network__ccNdcs__select').clear({ force: true });
    cy.get('#network__ccNdcs__select').type('6543{enter}', {
      force: true
    });

    cy.get('#network__add__e214Mapping__button').click();
    cy.get('#network__e214Mapping__0__mccMnc__select').type('9876{enter}', {
      force: true
    });
    cy.get('#network__e214Mapping__0__ccNdc__select').type('6543{enter}', {
      force: true
    });

    cy.get('#network__domainNames__select').type(
      'afgan.mtn.afg{enter}',
      {
        force: true
      }
    );

    cy.get(
      '#network__ipRoutingPrefixes__select'
    ).type('1.2.3.4.5{enter}', { force: true });
    cy.get('#network__ipRoutingPrefixes__feedback').should(
      'contain',
      'Must be in CIDR notation format'
    );
    cy.get('#network__ipRoutingPrefixes__select').clear({
      force: true
    });
    cy.get(
      '#network__ipRoutingPrefixes__select'
    ).type('1.1.1.1/24{enter}', { force: true });

    cy.get('#network__save__button').click();
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });

  it('edits a network', () => {
    cy.get('#networks__table > tbody > tr')
      .contains('AFGAR_MTN')
      .click();

    cy.get('#network__tapCodes__select').clear({ force: true });
    cy.get('#network__tapCodes__select').type('AFGANISTAN{enter}', {
      force: true
    });
    cy.get('#network__tapCode__feedback').should(
      'contain',
      'Must contain alphanumeric characters and be 5 characters in length'
    );
    cy.get('#network__tapCodes__select').clear({ force: true });
    cy.get('#network__tapCodes__select').type('AFGAN{enter}', {
      force: true
    });

    cy.get('#network__mccMncs__select').clear({ force: true });
    cy.get('#network__mccMncs__select').type('cc-mnc{enter}', {
      force: true
    });
    cy.get('#network__mccMnc__feedback').should(
      'contain',
      'Must contain only numeric characters'
    );
    cy.get('#network__mccMncs__select').clear({ force: true });
    cy.get('#network__mccMncs__select').type('9876{enter}', {
      force: true
    });

    cy.get('#network__ccNdcs__select').clear({ force: true });
    cy.get('#network__ccNdcs__select').type('cc-ndc{enter}', {
      force: true
    });
    cy.get('#network__ccNdc__feedback').should(
      'contain',
      'Must contain only numeric characters'
    );
    cy.get('#network__ccNdcs__select').clear({ force: true });
    cy.get('#network__ccNdcs__select').type('6543{enter}', {
      force: true
    });

    cy.get('#network__remove__mapping__0__btn').click();
    cy.get('#network__add__e214Mapping__button').click();
    cy.get('#network__e214Mapping__0__mccMnc__select').type('9876{enter}', {
      force: true
    });
    cy.get('#network__e214Mapping__0__ccNdc__select').type('6543{enter}', {
      force: true
    });

    cy.get('#network__domainNames__select').type(
      'afgan.mtn.afg{enter}',
      {
        force: true
      }
    );

    cy.get(
      '#network__ipRoutingPrefixes__select'
    ).type('1.2.3.4.5{enter}', { force: true });
    cy.get('#network__ipRoutingPrefixes__feedback').should(
      'contain',
      'Must be in CIDR notation format'
    );
    cy.get('#network__ipRoutingPrefixes__select').clear({
      force: true
    });
    cy.get(
      '#network__ipRoutingPrefixes__select'
    ).type('1.1.1.1/24{enter}', { force: true });

    cy.get('#network__save__button')
      .should('be.enabled')
      .click();
    cy.get('.vue-notification-wrapper')
      .should('be.visible')
      .should('contain', 'Success');
  });
});
