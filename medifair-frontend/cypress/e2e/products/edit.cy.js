// // cypress/e2e/products/edit.cy.js

// describe('Product Editing', () => {
//   beforeEach(() => {
//     cy.interceptApi();
//     cy.login();
    
//     // Create a product to edit
//     cy.createProduct({ name: 'Product to Edit', price: 15.99, quantity: 7 });
    
//     // Get the ID of the created product
//     cy.visit('/');
//     cy.wait('@getProducts');
//     cy.get('.product-item').first().click();
//     cy.url().then(url => {
//       const id = url.split('/').pop();
//       cy.wrap(id).as('productId');
//     });
//   });

//   it('should edit a product successfully', function() {
//     cy.visit(`/edit/${this.productId}`);
//     cy.wait('@getProduct');
    
//     // Update product details
//     cy.get('input[name="name"]').clear().type('Updated Product Name');
//     cy.get('input[name="price"]').clear().type('25.99');
//     cy.get('button[type="submit"]').click();
    
//     cy.wait('@updateProduct');
    
//     // Should redirect to home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
    
//     // Product should be updated in the list
//     cy.get('.product-item').should('contain', 'Updated Product Name');
//   });

//   it('should load existing product data', function() {
//     cy.visit(`/edit/${this.productId}`);
//     cy.wait('@getProduct');
    
//     // Form should be pre-filled with product data
//     cy.get('input[name="name"]').should('have.value', 'Product to Edit');
//     cy.get('input[name="price"]').should('have.value', '15.99');
//     cy.get('input[name="quantity"]').should('have.value', '7');
//   });

//   it('should handle errors when editing', function() {
//     // Intercept the update request and force it to fail
//     cy.intercept('PUT', `**/products/${this.productId}`, {
//       statusCode: 500,
//       body: { message: 'Server error' }
//     }).as('updateError');
    
//     cy.visit(`/edit/${this.productId}`);
//     cy.wait('@getProduct');
    
//     cy.get('input[name="name"]').clear().type('Will Fail Update');
//     cy.get('button[type="submit"]').click();
    
//     cy.wait('@updateError');
    
//     // Should show error message (assuming your app handles this)
//     cy.get('.error-message').should('be.visible');
    
//     // Should not redirect
//     cy.url().should('include', `/edit/${this.productId}`);
//   });
// });