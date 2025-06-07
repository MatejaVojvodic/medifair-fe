//"use client"

import { useLocation, useNavigate } from "react-router-dom"
import "../assets/styles/order.css"

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="container">
        <div className="order-error">
          <h2>Order not found</h2>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="order-success-container">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your order has been confirmed.</p>

        <div className="order-details">
          <h3>Order Details</h3>
          <div className="order-info">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Shipping Address:</strong> {order.shippingAddress}
            </p>
          </div>

          <div className="order-items">
            <h4>Items Ordered:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.productName}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/orders")} className="btn btn-primary">
            View All Orders
          </button>
          <button onClick={() => navigate("/")} className="btn btn-secondary">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
