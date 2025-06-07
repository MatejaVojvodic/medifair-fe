//"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../api/productService"
import AddToCartButton from "../components/AddToCartButton"
import "../assets/styles/product.css"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsLoading(true)
    getProductById(id)
      .then((data) => {
        console.log("Product Detail Data:", data)
        setProduct(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching product:", error)
        setError("Failed to load product details")
        setIsLoading(false)
      })
  }, [id])

  const getProductImage = () => {
    if (product?.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0]
    }
    if (product?.imageUrl) {
      return product.imageUrl
    }
    return "https://via.placeholder.com/300x300?text=No+Image"
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading product details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error-message">Product not found</div>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-detail-header">
          <h1 className="product-detail-title">{product.name}</h1>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-image">
            <img
              src={getProductImage() || "/placeholder.svg"}
              alt={product.name}
              className="detail-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x300?text=No+Image"
              }}
            />
          </div>

          <div className="product-detail-info">
            <div className="product-detail-section">
              <div className="product-detail-label">Description</div>
              <div className="product-detail-value">{product.description}</div>
            </div>

            <div className="product-detail-section">
              <div className="product-detail-label">Price</div>
              <div className="product-detail-value">${product.price.toFixed(2)}</div>
            </div>

            <div className="product-detail-section">
              <div className="product-detail-label">Available Quantity</div>
              <div className="product-detail-value">{product.quantity}</div>
            </div>
          </div>
        </div>

        <div className="product-detail-actions">
          <AddToCartButton productId={product.id} />
          <button onClick={() => navigate("/")} className="btn btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail


