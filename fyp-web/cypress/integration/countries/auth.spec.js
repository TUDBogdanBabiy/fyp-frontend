context('Authentication', () => {
    beforeEach(() => {
      cy.visit('/#/login');
    });
  
    it('logs the user in', () => {
      cy.get('#login__form > .q-input').eq(0).type('User@email.com');
      cy.get('#login__form > .q-input').eq(1).type('password123');

      cy.get('#login__btn').click();
      cy.wait('@login');

      cy.url().should('not.include', '/login');
    });

    it('registers a new user', () => {
        cy.get('#register__btn').click();
        cy.url().should('include', '/register');
        
        cy.get('#register__form > .q-input').eq(0).type('Bogdan');
        cy.get('#register__form > .q-input').eq(1).type('Babiy');
        cy.get('#register__form > .q-input').eq(2).type('Bogdan@email.com');
        cy.get('#register__form > .q-input').eq(3).type('password123');
        cy.get('#register__form > .q-input').eq(4).type('password123');
        cy.get('#register__btn').click();
        cy.wait('@register');
        cy.url().should('not.include', '/register');
      });
  });
  