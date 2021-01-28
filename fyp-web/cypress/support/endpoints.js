const BASE_URL = 'http://localhost:3000';

function initialiseAuthEndpoints() {
  cy.intercept('POST', `${BASE_URL}/auth/login`, {fixture:'user'}).as(
    'login'
  );

  cy.intercept('POST', `${BASE_URL}/auth/register`,  {fixture:'user'}).as(
    'register'
  );

  cy.intercept('GET', `${BASE_URL}/auth/user`,  {fixture:'user'}).as(
    'getUser'
  );
}

beforeEach(() => {
  initialiseAuthEndpoints();
});
