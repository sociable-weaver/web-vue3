describe("About Page", () => {
  it("renders the site information", () => {
    cy.visit("/#/about");
    cy.contains("h1", "Sociable Weaver");
  });
});
