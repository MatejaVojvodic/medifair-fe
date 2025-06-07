//"use client"

import ProductList from "../components/ProductList"
import ProductFilter from "../components/ProductFilter.jsx"
import { useContext } from "react"
import { ProductContext } from "../context/ProductContext"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import "../assets/styles/product.css"

const Home = () => {
  const { error, isLoading } = useContext(ProductContext)
  const { isAdmin } = useAuth()

  const checkIsAdmin = () => {
    if (typeof isAdmin === "function") {
      return isAdmin()
    }
    return false
  }

  return (
    <div className="container">
      {checkIsAdmin() && <h1>Product Management</h1>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <p>Please make sure your backend server is running on http://localhost:8080</p>
        </div>
      )}

      {isLoading && <div className="loading-spinner">Loading products...</div>}

      {checkIsAdmin() && (
        <Link to="/create" className="btn btn-primary" style={{ marginBottom: "1rem" }}>
          Create Product
        </Link>
      )}

      <ProductFilter />
      <ProductList />
    </div>
  )
}

export default Home


