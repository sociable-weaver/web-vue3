describe("About Page", () => {
  it("renders the site information", () => {
    cy.visit("/#/about");
    cy.contains("h1", "We are working hard to get this up and running");
  });
});
