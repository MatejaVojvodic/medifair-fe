// cypress/e2e/auth/persistence.cy.js

describe('Authentication Persistence', () => {
  beforeEach(() => {
    cy.interceptApi();
    cy.login();
  });

  it('should maintain authentication across page reloads', () => {
    // Visit home page after login
    cy.visit('/');
    
    // Verify we're logged in (navbar should show username or logout button)
    cy.get('nav').should('contain', 'Logout');
    
    // Reload the page
    cy.reload();
    
    // Should still be logged in
    cy.get('nav').should('contain', 'Logout');
    
    // Should not redirect to login
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should maintain authentication when navigating between pages', () => {
    // Visit home page
    cy.visit('/');
    
    // Navigate to create page
    cy.get('a').contains('Create Product').click();
    
    // Should navigate without redirecting to login
    cy.url().should('include', '/create');
    
    // Navigate back to home
    cy.visit('/');
    
    // Should still be logged in
    cy.get('nav').should('contain', 'Logout');
  });

  it('should clear authentication on logout', () => {
    cy.visit('/');
    
    // Click logout button
    cy.get('button').contains('Logout').click();
    
    // Should redirect to login page
    cy.url().should('include', '/login');
    
    // Token should be removed from localStorage
    cy.window().its('localStorage.token').should('not.exist');
    
    // Try to access protected page
    cy.visit('/create');
    
    // Should redirect to login
    cy.url().should('include', '/login');
  });
});