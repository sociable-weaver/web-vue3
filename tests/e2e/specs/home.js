describe("Home page", () => {
  it("renders the header", () => {
    cy.visit("/");
    cy.contains("h1", "Sociable Weaver");
  });
});
