context("Attractions", () => {
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

  it("displays the attractions to a customer user", () => {
    login();
    cy.wait("@getAttractions");
    cy.url().should("include", "/home");
    cy.get("#attractions__table  .q-card").should("have.length", 3);
  });

  it("displays the attractions to an admin user", () => {
    login("admin@gmail.com");
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/#/admin/attractions");
    cy.wait("@getAttractions");
    cy.get("#attractions__table tbody > tr").should("have.length", 3);
  });

  it("adds a new attraction", () => {
    login("admin@gmail.com");
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/#/admin/attractions");
    cy.wait("@getAttractions");
    cy.get("#add__attraction__btn").click();
    cy.get("#form__heading").should("contain", "New Attraction");
    cy.get("#attractions__form .q-textarea").type(
      "Descritpion about the waterpark."
    );
    cy.get("#attractions__form input")
      .eq(0)
      .type("Waterpark");
    cy.get("#attractions__form input")
      .eq(1)
      .type(6);
    cy.get("#attractions__form input")
      .eq(2)
      .type(5);
    cy.get("#attractions__form input")
      .eq(3)
      .type(90);
    cy.get("#attractions__form input")
      .eq(4)
      .type(100);
    cy.get("#attractions__form input")
      .eq(5)
      .type(2);
    cy.get("#attractions__form input")
      .eq(6)
      .type(1200);
    cy.get("#attractions__form input")
      .eq(7)
      .type(1600);
    cy.get("#attractions__form input")
      .eq(8)
      .type(30);
    cy.get("#generate_timeslots__btn").click();
    cy.get("#attractions__form input").should("have.length", 25);
    cy.get("#submit__btn").click();
    cy.wait("@addAttraction");
  });

  it("update an attraction", () => {
    login("admin@gmail.com");
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/#/admin/attractions");
    cy.wait("@getAttractions");
    cy.get("#attractions__table tbody > tr")
      .eq(0)
      .get("#actions__dropdown")
      .click();
    cy.get("#edit__item").click();

    cy.get("#form__heading").should("contain", "Edit Skyclimb");
    cy.get("textarea").should(
      "contain.value",
      "Some description about the Skyclimb attraction."
    );
    cy.get("#attractions__form input")
      .eq(0)
      .should("contain.value", 9);
    cy.get("#attractions__form input")
      .eq(1)
      .should("contain.value", 24);
    cy.get("#attractions__form input")
      .eq(2)
      .should("contain.value", 114);
    cy.get("#attractions__form input")
      .eq(3)
      .should("contain.value", 135);
    cy.get("#attractions__form input")
      .eq(4)
      .should("contain.value", 9);
    cy.get("#attractions__form input")
      .eq(5)
      .should("contain.value", "12:00");
    cy.get("#attractions__form input")
      .eq(6)
      .should("contain.value", "18:00");
    cy.get("#attractions__form input").should("have.length", 10);
    cy.get("#submit__btn").click();
    cy.wait("@updateAttraction");
  });

  it("displays the attractions to an admin user", () => {
    login("admin@gmail.com");
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/#/admin/attractions");
    cy.wait("@getAttractions");

    cy.get("#attractions__table tbody > tr")
      .eq(0)
      .get("#actions__dropdown")
      .click();
    cy.get("#delete__item").click();
    cy.get("#delete_attraction__dialog").contains(
      "Are you sure you want to delete Skyclimb?"
    );
    cy.get("#delete_attraction__dialog")
      .contains("Delete")
      .click();
    cy.wait("@deleteAttraction");
  });
});
