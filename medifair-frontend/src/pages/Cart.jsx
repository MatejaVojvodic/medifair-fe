//"use client"

import { useEffect } from "react"
import { useCart } from "../context/CartProvider"
import { Link, useNavigate } from "react-router-dom"
import "../assets/styles/cart.css"

const Cart = () => {
  const { cart, isLoading, error, loadCart, updateCartItem, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    await updateCartItem(productId, newQuantity)
  }

  const handleRemoveItem = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await removeFromCart(productId)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart()
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading cart...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button onClick={handleClearCart} className="btn btn-secondary">
            Clear Cart
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Start shopping to add items to your cart.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <h4 className="item-name">{item.productName}</h4>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                </div>

                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-subtotal">
                  <strong>${item.subtotal.toFixed(2)}</strong>
                </div>

                <button onClick={() => handleRemoveItem(item.productId)} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)}):</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <strong>
                  <span>Total: ${cart.totalPrice.toFixed(2)}</span>
                </strong>
              </div>
              <button onClick={handleCheckout} className="btn btn-primary btn-lg checkout-btn">
                Proceed to Checkout
              </button>
              <Link to="/" className="btn btn-secondary btn-lg">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
