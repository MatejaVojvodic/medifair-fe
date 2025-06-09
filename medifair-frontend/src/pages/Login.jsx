import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { login } from "../api/authService"
import { useAuth } from "../context/AuthContext"
import "../assets/styles/auth.css"

const Login = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // UI state
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin, isLoggedIn } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location])

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
    setSuccessMessage("")

    try {
    //   // Call the login API
    //   const token = await login(formData)

    //   // Update auth context with token
    //   authLogin(token)

    //   // Redirect to home page or intended page
    //   const redirectTo = location.state?.from?.pathname || "/"
    //   navigate(redirectTo)
    // } catch (err) {
    //   setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    // } finally {
    //   setIsLoading(false)
    // }
    const result = await authLogin(formData)

    if (result.success) {
      const redirectTo = location.state?.from?.pathname || "/"
      navigate(redirectTo)
    } else {
      setError(result.error || "Login failed")
    }
  } catch (err) {
    setError("Something went wrong.")
  } finally {
    setIsLoading(false)

  }

  return (
    <div className="container">
      <div className="auth-page-container">
        <div className="auth-container login-container">
          <h2 className="auth-title">Login to MediFair</h2>

          {/* Success message */}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* Login form */}
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
                placeholder="Enter your password"
                className="form-control"
              />
            </div>

            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-redirect">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login