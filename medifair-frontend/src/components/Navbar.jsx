import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartProvider"
import { useChat } from "../context/ChatContext"
import "../assets/styles/navbar.css"

const Navbar = () => {
  const { isLoggedIn, logout, isAdmin, username } = useAuth()
  const { getCartItemCount } = useCart()
  const { getTotalUnreadCount, connected } = useChat()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MediFair
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              {isAdmin() && (
                <Link to="/create" className="navbar-link">
                  Add Product
                </Link>
              )}
              <Link to="/orders" className="navbar-link">
                Orders
              </Link>
              <Link to="/chat" className="navbar-link">
                Chat
                {getTotalUnreadCount() > 0 && <span className="unread-badge">{getTotalUnreadCount()}</span>}
                {connected ? (
                  <span className="connection-indicator online"></span>
                ) : (
                  <span className="connection-indicator offline"></span>
                )}
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="navbar-link cart-link">
                🛒 Cart ({getCartItemCount()})
              </Link>
              <div className="user-info">
                <span className="username">
                  {username} {isAdmin() ? "(Admin)" : "(User)"}
                </span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
