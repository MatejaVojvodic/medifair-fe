"use client"

import { useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import { useNavigate } from "react-router-dom"
import "../assets/styles/order.css"

const Orders = () => {
  const { orders, isLoading, error, loadUserOrders } = useOrder()
  const navigate = useNavigate()

  useEffect(() => {
    loadUserOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>My Orders</h1>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id}</strong>
                </div>
                <div className="order-date">{new Date(order.orderDate).toLocaleDateString()}</div>
                <div className="order-status">
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-items">
                  <h4>Items ({order.items.length}):</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-price">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="shipping-address">
                    <strong>Shipping Address:</strong>
                    <p>{order.shippingAddress}</p>
                  </div>
                  <div className="order-total">
                    <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
