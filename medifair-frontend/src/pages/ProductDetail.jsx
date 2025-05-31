import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../api/productService"
import AddToCartButton from "../components/AddToCartButton"
import Navbar from "../components/Navbar"
import "../assets/styles/product.css"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        console.log("Product Detail Data:", data)
        setProduct(data)
      })
      .catch((error) => {
        console.error("Error fetching product:", error)
      })
  }, [id])

  if (!product)
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    )

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-header">
            <h1 className="product-detail-title">{product.name}</h1>
          </div>

          <div className="product-detail-info">
            <div className="product-detail-section">
              <div className="product-detail-label">Description</div>
              <div className="product-detail-value">{product.description}</div>
            </div>

            <div className="product-detail-section">
              <div className="product-detail-label">Price</div>
              <div className="product-detail-value">${product.price}</div>
            </div>

            <div className="product-detail-section">
              <div className="product-detail-label">Available Quantity</div>
              <div className="product-detail-value">{product.quantity}</div>
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
    </div>
  )
}

export default ProductDetail

