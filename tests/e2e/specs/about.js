describe("About Page", () => {
  it("renders the site information", () => {
    cy.visit("/#/about");
    cy.contains("h2", "Prime directive");
    cy.contains("h2", "Sociable Weaver");
  });
});
