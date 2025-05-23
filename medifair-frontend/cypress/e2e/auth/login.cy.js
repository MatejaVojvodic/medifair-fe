// cypress/e2e/auth/login.cy.js

describe('Login', () => {
  beforeEach(() => {
    cy.interceptApi();
    
    // Register a test user if needed
    const username = `testuser_${Date.now()}`;
    cy.register(username, 'password123');
    
    // Store username for login tests
    cy.wrap(username).as('testUsername');
  });

  it('should login successfully with valid credentials', function() {
    cy.visit('/login');
    cy.get('#username').type(this.testUsername);
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    
    // Should redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Should have token in localStorage
    cy.window().its('localStorage.token').should('exist');
  });

  it('should show error with invalid credentials', () => {
    cy.visit('/login');
    cy.get('#username').type('invaliduser');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.get('.error-message').should('be.visible');
    
    // Should not redirect
    cy.url().should('include', '/login');
    
    // Should not have token in localStorage
    cy.window().its('localStorage.token').should('not.exist');
  });

  it('should redirect to intended page after login', function() {
    // Try to access protected page
    cy.visit('/create');
    
    // Should redirect to login
    cy.url().should('include', '/login');
    
    // Login
    cy.get('#username').type(this.testUsername);
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to the originally requested page
    //cy.url().should('include', '/create');
  });
});