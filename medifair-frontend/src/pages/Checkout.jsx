import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useOrder } from "../context/OrderContext"
import Navbar from "../components/Navbar"
import "../assets/styles/checkout.css"

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const { cart, clearCart } = useCart()
  const { checkout } = useOrder()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address")
      return
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty")
      return
    }

    setIsProcessing(true)
    setError("")

    const result = await checkout(shippingAddress)

    if (result.success) {
      await clearCart()
      navigate("/order-success", {
        state: { order: result.order },
      })
    } else {
      setError(result.error)
    }

    setIsProcessing(false)
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="checkout-container">
          <h1>Checkout</h1>

          <div className="checkout-content">
            <div className="order-review">
              <h3>Order Review</h3>
              <div className="order-items">
                {cart.items.map((item) => (
                  <div key={item.productId} className="checkout-item">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total: ${cart.totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <div className="shipping-form">
              <h3>Shipping Information</h3>
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="shippingAddress">Shipping Address *</label>
                  <textarea
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your complete shipping address..."
                    rows="4"
                    className="form-control"
                    required
                  />
                </div>

                <div className="checkout-actions">
                  <button type="button" onClick={() => navigate("/cart")} className="btn btn-secondary">
                    Back to Cart
                  </button>
                  <button type="submit" disabled={isProcessing} className="btn btn-primary btn-lg">
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout