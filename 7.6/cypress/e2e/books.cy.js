describe("BooksApp autotests", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("Successfull auth", () => {
    cy.login("test@test.com", "test");
    cy.contains("Добро пожаловать test@test.com").should("be.visible");
    cy.contains("Log out").should("be.visible");
  });

  it("Unsuccessfull auth", () => {
    cy.login(" ", "123");
    cy.get("#mail")
      .then(($el) => $el[0].checkValidity())
      .should("be.false");
  });

  it("Add new book", () => {
    cy.login("test@test.com", "test");
    cy.addBook("Brave New World", "Aldous Huxley");
    cy.contains("Brave New World").should("be.visible");
  });

  it("Add book to favorites", () => {
    cy.login("test@test.com", "test");
    cy.addBook("Brave New World", "Aldous Huxley");

    cy.contains("Add to favorite").click();
    cy.visit("/favorites");
    cy.contains("Brave New World").should("be.visible");
  });

  it("Delete book from favorites", () => {
    cy.login("test@test.com", "test");
    cy.addBook("Brave New World", "Aldous Huxley");

    cy.contains("Add to favorite").click();
    cy.visit("/favorites");
    cy.contains("Brave New World").should("be.visible");
    cy.contains("Delete from favorite").click();
  });
});