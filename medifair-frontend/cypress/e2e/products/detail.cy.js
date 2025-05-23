// // cypress/e2e/products/detail.cy.js

// describe('Product Detail', () => {
//   beforeEach(() => {
//     cy.interceptApi();
//     cy.login();
    
//     // Create a product to view
//     cy.createProduct({
//       name: 'Detailed Product',
//       description: 'This is a detailed description',
//       price: 29.99,
//       quantity: 15
//     });
    
//     // Get the ID of the created product
//     cy.visit('/');
//     cy.wait('@getProducts');
//     cy.get('.product-item').first().click();
//     cy.url().then(url => {
//       const id = url.split('/').pop();
//       cy.wrap(id).as('productId');
//     });
//   });

//   it('should display product details correctly', function() {
//     cy.visit(`/product/${this.productId}`);
//     cy.wait('@getProduct');
    
//     // Check all product details are displayed
//     cy.get('h2').should('contain', 'Product Details');
//     cy.contains('Name:').should('contain', 'Detailed Product');
//     cy.contains('Description:').should('contain', 'This is a detailed description');
//     cy.contains('Price:').should('contain', '29.99');
//     cy.contains('Quantity:').should('contain', '15');
//   });

//   it('should navigate back to home page', function() {
//     cy.visit(`/product/${this.productId}`);
//     cy.wait('@getProduct');
    
//     // Click back button
//     cy.get('button').contains('Back to Home').click();
    
//     // Should navigate to home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });

//   it('should handle non-existent products', () => {
//     // Visit a product that doesn't exist
//     cy.visit('/product/999999');
    
//     // Should show error message or fallback UI
//     // This depends on how your app handles 404s
//     cy.get('p').should('contain', 'Loading');
    
//     // After a timeout, might show an error
//     cy.wait(5000);
//     cy.get('body').should('contain', 'Error');
//   });
// });