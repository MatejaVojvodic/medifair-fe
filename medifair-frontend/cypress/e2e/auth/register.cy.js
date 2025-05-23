// cypress/e2e/auth/register.cy.js

describe('Registration', () => {
  beforeEach(() => {
    cy.interceptApi();
  });

  it('should register a new user successfully', () => {
    const username = `testuser_${Date.now()}`;
    
    cy.visit('/register');
    cy.get('#username').type(username);
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@register');
    
    // Should redirect to login page
    cy.url().should('include', '/login');
    
    // Should show success message
    cy.get('.success-message').should('be.visible')
      .and('contain', 'Registration successful');
  });

  it('should show error for duplicate username', () => {
    // First register a user
    const username = `testuser_${Date.now()}`;
    cy.register(username, 'password123');
    
    // Try to register with the same username
    cy.visit('/register');
    cy.get('#username').type(username);
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Should show error message
    cy.get('.error-message').should('be.visible');
  });

  it('should validate form fields', () => {
    cy.visit('/register');
    
    // Try to submit empty form
    cy.get('button[type="submit"]').click();
    
    // Form should not submit due to HTML5 validation
    cy.url().should('include', '/register');
  });
});