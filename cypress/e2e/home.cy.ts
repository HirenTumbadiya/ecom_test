describe("E-commerce app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the homepage and shows the product grid", () => {
    cy.contains("Shop the best products").should("be.visible");
    cy.get(".product_grid").should("exist");
  });

  it("navigates to the cart page", () => {
    cy.get(".cart_link").click();
    cy.url().should("include", "/cart");
    cy.contains("Shopping Cart").should("be.visible");
  });
});
