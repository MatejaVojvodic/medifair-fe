// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/product.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MediFair</Link>
      </div>
      <div className="navbar-menu">
        {isLoggedIn ? (
          <>
            <Link to="/" className="navbar-item">Home</Link>
            <Link to="/create" className="navbar-item">Create Product</Link>
            <button onClick={logout} className="navbar-item logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;