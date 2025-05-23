// cypress/support/commands.js

// Login command
Cypress.Commands.add('login', (username = 'testuser', password = 'password123') => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to home page
  cy.url().should('not.include', '/login');
  
  // Verify localStorage has token
  cy.window().its('localStorage.token').should('exist');
});

// Register command
Cypress.Commands.add('register', (username = 'testuser', password = 'password123') => {
  cy.visit('/register');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to login page
  cy.url().should('include', '/login');
  
  // Verify success message
  cy.get('.success-message').should('be.visible');
});

// Create product command
Cypress.Commands.add('createProduct', (product = {
  name: 'Test Product',
  description: 'This is a test product',
  price: 99.99,
  quantity: 10
}) => {
  cy.visit('/create');
  cy.get('input[name="name"]').type(product.name);
  cy.get('textarea[name="description"]').type(product.description);
  cy.get('input[name="price"]').type(product.price);
  cy.get('input[name="quantity"]').type(product.quantity);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to home page
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

// Intercept API requests
Cypress.Commands.add('interceptApi', () => {
  cy.intercept('GET', '**/products').as('getProducts');
  cy.intercept('GET', '**/products/*').as('getProduct');
  cy.intercept('POST', '**/products').as('createProduct');
  cy.intercept('PUT', '**/products/*').as('updateProduct');
  cy.intercept('DELETE', '**/products/*').as('deleteProduct');
  cy.intercept('POST', '**/auth/login').as('login');
  cy.intercept('POST', '**/auth/register').as('register');
});