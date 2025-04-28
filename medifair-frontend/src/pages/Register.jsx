// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authService"; // Make sure this import path is correct
import "../assets/styles/auth.css"; // Make sure this path is correct

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roles: ["USER"] // Include roles as required by your backend
  });
  
  // Make sure to initialize the error state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Call the register API
      await register(formData);
      
      // Redirect to login page with success message
      navigate("/login", { 
        state: { message: "Registration successful! Please login." } 
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container register-container">
      <h2 className="auth-title">Register for MediFair</h2>
      
      {/* Error message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Registration form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Choose a password"
            className="form-control"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      
      <p className="auth-redirect">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;