context("Bookings", () => {
  beforeEach(() => {
    cy.visit("/#/login");
  });

  function login(email = "customer@gmail.com") {
    cy.get("#login__form > .q-input")
      .eq(0)
      .type(email);
    cy.get("#login__form > .q-input")
      .eq(1)
      .type("password123");

    cy.get("#login__btn").click();
    cy.wait("@login");
    cy.url().should("not.include", "/login");
  }

  it("displays the bookings to a customer user", () => {
    login();
    cy.wait("@getUser");
    cy.wait("@getAttractions");
    cy.visit("/#/bookings");
    cy.wait("@getAllBookings");
    cy.url().should("include", "/bookings");
    cy.get("#bookings__table  .q-card").should("have.length", 5);
  });

  it("displays the bookings to an admin user", () => {
    login("admin@gmail.com");
    cy.wait("@getUser");
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/#/admin/bookings");
    cy.wait("@getAllBookings");
    cy.url().should("include", "/bookings");
    cy.get("#bookings__table tbody > tr").should("have.length", 5);
  });
});
