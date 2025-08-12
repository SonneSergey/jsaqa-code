// Логин с проверкой
Cypress.Commands.add("login", (email, pass) => {
  cy.get("body").then(($body) => {
    if ($body.find("button:contains('Log in')").length) {
      cy.contains("button", "Log in").should("be.visible").click();
      cy.get("#mail").type(email);
      cy.get("#pass").type(pass);
      cy.contains("button", "Submit").should("be.visible").click();
    } else {
      cy.log("Уже залогинен — пропускаем вход");
    }
  });
});

// Добавление книги
Cypress.Commands.add("addBook", (title, author) => {
  cy.contains("Add new").click();
  cy.get("#title").type(title);
  cy.get("#authors").type(author);
  cy.contains("Submit").click();
});
