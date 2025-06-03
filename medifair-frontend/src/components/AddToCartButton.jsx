"use client"

import { useState } from "react"
import { useCart } from "../context/CartProvider"

const AddToCartButton = ({ productId, className = "btn btn-primary" }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState("")
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    setMessage("")

    const result = await addToCart(productId, quantity)

    if (result.success) {
      setMessage("Added to cart!")
      setTimeout(() => setMessage(""), 2000)
    } else {
      setMessage(result.error)
      setTimeout(() => setMessage(""), 3000)
    }

    setIsAdding(false)
  }

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
          className="quantity-input"
        />
      </div>
      <button onClick={handleAddToCart} disabled={isAdding} className={className}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {message && <div className={`cart-message ${message.includes("Added") ? "success" : "error"}`}>{message}</div>}
    </div>
  )
}

export default AddToCartButton
