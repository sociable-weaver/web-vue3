describe("Book page", () => {
  it("renders the application state check", () => {
    cy.visit("/");
    cy.contains("h2", "The Sociable Weaver Application is not running or cannot be reached by this page");
    // cy.get("a[class=download-app]")
    //   .contains("sw-app.jar")
    //   .should("have.prop", "href")
    //   .then((href) => {
    //     cy.downloadFile(href, "cypress/downloads", "sw-app.jar");
    //   });
  });
});
