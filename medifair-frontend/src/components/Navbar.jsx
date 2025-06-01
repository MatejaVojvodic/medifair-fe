import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import "../assets/styles/product.css"

const Navbar = () => {
  const { isLoggedIn, logout, isAdmin, isUser, username, userRoles } = useAuth()
  const { getCartItemCount } = useCart()

  // Debug logs
  console.log("Navbar - Auth state:", { isLoggedIn, username, userRoles })
  console.log("Navbar - isAdmin function:", typeof isAdmin)

  // Safety check for functions
  const checkIsAdmin = () => {
    if (typeof isAdmin === "function") {
      return isAdmin()
    }
    console.error("isAdmin is not a function")
    return false
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MediFair</Link>
      </div>
      <div className="navbar-menu">
        {isLoggedIn ? (
          <>
            <Link to="/" className="navbar-item">
              Home
            </Link>
            {checkIsAdmin() && (
              <Link to="/create" className="navbar-item">
                Create Product
              </Link>
            )}
            <Link to="/cart" className="navbar-item cart-link">
              🛒 Cart ({getCartItemCount()})
            </Link>
            <Link to="/orders" className="navbar-item">
              My Orders
            </Link>
            <Link to="/profile" className="navbar-item">
              Profile
            </Link>
            <span className="navbar-item user-info">
              {username}
            </span>
            <button onClick={logout} className="navbar-item logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">
              Login
            </Link>
            <Link to="/register" className="navbar-item">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
