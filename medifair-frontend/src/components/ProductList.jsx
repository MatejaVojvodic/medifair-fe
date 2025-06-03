import { useContext } from "react"
import { ProductContext } from "../context/ProductContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../assets/styles/product.css"

const ProductList = () => {
  const { products, handleDeleteProduct } = useContext(ProductContext)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await handleDeleteProduct(id)
      } catch (error) {
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  const checkIsAdmin = () => {
    if (typeof isAdmin === "function") {
      return isAdmin()
    }
    return false
  }

  const getProductImage = (product) => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0]
    }
    if (product.imageUrl) {
      return product.imageUrl
    }
    return "/placeholder.svg?height=80&width=80&text=No+Image"
  }

  if (products.length === 0) {
    return (
      <div className="empty-products">
        <h3>No products available</h3>
        <p>There are currently no products to display.</p>
      </div>
    )
  }

  return (
    <div className="products-container">
      <h2>Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-image">
              <img
                src={getProductImage(product) || "/placeholder.svg"}
                alt={product.name}
                className="product-img"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=80&width=80&text=No+Image"
                }}
              />
            </div>

            <div className="product-info">
              <h4 className="product-name" onClick={() => navigate(`/products/${product.id}`)}>
                {product.name}
              </h4>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-quantity">Stock: {product.quantity}</p>
              <p className="product-description">{product.description}</p>
            </div>

            {checkIsAdmin() && (
              <div className="product-actions">
                <button onClick={() => navigate(`/edit/${product.id}`)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id, product.name)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
