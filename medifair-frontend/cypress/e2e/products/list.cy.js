// // cypress/e2e/products/list.cy.js

// describe('Product Listing', () => {
//   beforeEach(() => {
//     cy.interceptApi();
    
//     // Login before each test
//     cy.login();
    
//     // Create some test products
//     cy.createProduct({ name: 'Product 1', price: 10.99, quantity: 5 });
//     cy.createProduct({ name: 'Product 2', price: 20.99, quantity: 10 });
//   });

//   it('should display list of products', () => {
//     cy.visit('/');
//     cy.wait('@getProducts');
    
//     // Should show product list
//     cy.get('.product-list').should('be.visible');
//     cy.get('.product-item').should('have.length.at.least', 2);
    
//     // Should show product details
//     cy.get('.product-item').first().should('contain', 'Product');
//   });

//   it('should filter products', () => {
//     cy.visit('/');
//     cy.wait('@getProducts');
    
//     // Filter by name
//     cy.get('input[placeholder*="Search"]').type('Product 1');
//     cy.get('button').contains('Filter').click();
    
//     cy.wait('@getProducts');
    
//     // Should show filtered results
//     cy.get('.product-item').should('have.length', 1);
//     cy.get('.product-item').should('contain', 'Product 1');
//   });

//   it('should navigate to product details', () => {
//     cy.visit('/');
//     cy.wait('@getProducts');
    
//     // Click on first product
//     cy.get('.product-item').first().click();
    
//     // Should navigate to product details
//     cy.url().should('include', '/product/');
//   });
// });