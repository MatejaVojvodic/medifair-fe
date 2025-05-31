import ProductList from "../components/ProductList"
import ProductFilter from "../components/ProductFilter.jsx"
import Navbar from "../components/Navbar.jsx"
import { useContext } from "react"
import { ProductContext } from "../context/ProductContext"
import { Link } from "react-router-dom"
import "../assets/styles/product.css"

const Home = () => {
  const { error, isLoading } = useContext(ProductContext)

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Product Management</h1>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please make sure your backend server is running on http://localhost:8080</p>
          </div>
        )}

        {isLoading && <div className="loading-spinner">Loading products...</div>}

        <Link to="/create" className="btn btn-primary" style={{ marginBottom: "1rem" }}>
          Create Product
        </Link>

        <ProductFilter />
        <ProductList />
      </div>
    </div>
  )
}

export default Home
