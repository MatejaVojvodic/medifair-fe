// // cypress/e2e/products/create.cy.js

// describe('Product Creation', () => {
//   beforeEach(() => {
//     cy.interceptApi();
//     cy.login();
//   });

//   it('should create a new product successfully', () => {
//     const productName = `Test Product ${Date.now()}`;
    
//     cy.visit('/create');
//     cy.get('input[name="name"]').type(productName);
//     cy.get('textarea[name="description"]').type('This is a test product description');
//     cy.get('input[name="price"]').type('99.99');
//     cy.get('input[name="quantity"]').type('10');
//     cy.get('button[type="submit"]').click();
    
//     cy.wait('@createProduct');
    
//     // Should redirect to home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
    
//     // New product should be in the list
//     cy.get('.product-item').should('contain', productName);
//   });

//   it('should validate form fields', () => {
//     cy.visit('/create');
    
//     // Try to submit empty form
//     cy.get('button[type="submit"]').click();
    
//     // Form should not submit due to HTML5 validation
//     cy.url().should('include', '/create');
    
//     // Fill only some fields
//     cy.get('input[name="name"]').type('Incomplete Product');
//     cy.get('button[type="submit"]').click();
    
//     // Form should still not submit
//     cy.url().should('include', '/create');
//   });

//   it('should cancel creation and return to home', () => {
//     cy.visit('/create');
    
//     // Fill form
//     cy.get('input[name="name"]').type('Product to Cancel');
    
//     // Click cancel button (assuming there is one)
//     cy.get('button').contains('Cancel').click();
    
//     // Should return to home without creating
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
// });