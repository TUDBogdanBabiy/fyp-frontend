const BASE_URL = "http://localhost:3000";

function initialiseAuthEndpoints() {
  // cy.intercept("POST", `${BASE_URL}/auth/login`, { fixture: "user" }).as(
  //   "login"
  // );

  cy.intercept("POST", `${BASE_URL}/auth/login`, req => {
    const { body } = req;
    if (body.email == "admin@gmail.com") req.reply({ fixture: "adminUser" });
    if (body.email == "staff@gmail.com") req.reply({ fixture: "staffUser" });
    if (body.email == "customer@gmail.com")
      req.reply({ fixture: "customerUser" });
  }).as("login");

  cy.intercept("POST", `${BASE_URL}/auth/register`, {
    fixture: "customerUser"
  }).as("register");

  cy.intercept("GET", `${BASE_URL}/auth/user`, { fixture: "customerUser" }).as(
    "getUser"
  );
}

function initialiseAttractionEndpoints() {
  cy.intercept("GET", `${BASE_URL}/attractions`, { fixture: "attractions" }).as(
    "getAttractions"
  );
  cy.intercept("POST", `${BASE_URL}/attractions/add`, { statusCode: 200 }).as(
    "addAttraction"
  );
  cy.intercept("PATCH", `${BASE_URL}/attractions/update/*`, {
    statusCode: 200
  }).as("updateAttraction");
  cy.intercept("DELETE", `${BASE_URL}/attractions/delete/*`, {
    statusCode: 200
  }).as("deleteAttraction");
}

beforeEach(() => {
  initialiseAuthEndpoints();
  initialiseAttractionEndpoints();
});
