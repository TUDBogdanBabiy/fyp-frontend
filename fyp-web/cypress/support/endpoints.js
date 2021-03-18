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

  cy.intercept("GET", `${BASE_URL}/auth/user`, req => {
    const { body, headers } = req;
    if (headers.auth_token == "faketokenforbogdantheadmin")
      req.reply({ fixture: "adminUser" });
    if (headers.auth_token == "faketokenforbogdanthecustomer")
      req.reply({ fixture: "customerUser" });
  }).as("getUser");
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

function initialiseBookingEndpoints() {
  cy.intercept("GET", `${BASE_URL}/bookings`, { fixture: "bookings" }).as(
    "getAllBookings"
  );
  cy.intercept("GET", `${BASE_URL}/bookings/customer/*`, {
    fixture: "bookings"
  }).as("getCustomerBookings");
  cy.intercept("GET", `${BASE_URL}/bookings/attraction/*`, {
    fixture: "bookings"
  }).as("getAttractionBookings");
  cy.intercept("POST", `${BASE_URL}/bookings`, { statusCode: 200 }).as(
    "addBooking"
  );
  cy.intercept("PATCH", `${BASE_URL}/bookings/*`, {
    statusCode: 200
  }).as("updateBooking");
  cy.intercept("DELETE", `${BASE_URL}/bookings/*`, {
    statusCode: 200
  }).as("deleteBooking");
}

beforeEach(() => {
  initialiseAuthEndpoints();
  initialiseAttractionEndpoints();
  initialiseBookingEndpoints();
});
