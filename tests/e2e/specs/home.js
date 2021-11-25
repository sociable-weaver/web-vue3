describe("Home page", () => {
  it("renders the header", () => {
    cy.visit("/");
    cy.contains("h1", "Application is not running");
    cy.get("a[class=download-app]")
      .contains("sw-app.jar")
      .should("have.prop", "href")
      .then((href) => {
        cy.downloadFile(href, "cypress/downloads", "sw-app.jar");
      });
  });
});
