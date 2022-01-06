describe("About page", () => {
  it("renders the site information", () => {
    cy.visit("/#/about");
    cy.contains("h2", "Sociable Weaver");
    cy.contains("h3", "For the Authors");
    cy.contains("h3", "For the Readers");
  });
});
