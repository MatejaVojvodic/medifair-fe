import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../api/authService"
import { useAuth } from "../context/AuthContext"
import "../assets/styles/auth.css"

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  // UI state
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 3) {
      setError("Password must be at least 3 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Prepare user data - automatically assign USER role
      const userData = {
        username: formData.username,
        password: formData.password,
        roles: ["USER"], // Always assign USER role
      }

      // Call the register API
      await register(userData)

      // Redirect to login page with success message
      navigate("/login", {
        state: { message: "Registration successful! Please log in with your new account." },
      })
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="auth-page-container">
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
                placeholder="Enter your username"
                className="form-control"
                minLength="3"
              />
              <small className="form-text text-muted">Username must be at least 3 characters long</small>
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
                placeholder="Enter your password"
                className="form-control"
                minLength="3"
              />
              <small className="form-text text-muted">Password must be at least 3 characters long</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="form-control"
              />
            </div>

            <div className="registration-info">
              <p>
                <strong>Note:</strong> All new accounts are created as regular users. You'll be able to browse
                products, add items to your cart, and place orders.
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-redirect">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register