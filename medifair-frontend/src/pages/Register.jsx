import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../api/authService"
import "../assets/styles/auth.css"

const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Default role
  })

  // UI state
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const navigate = useNavigate()

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
      // Prepare user data
      const userData = {
        username: formData.username,
        password: formData.password,
        roles: [formData.role], // Send as array
      }

      // Call the register API
      await register(userData)

      // Redirect to login page with success message
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      })
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-control">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="auth-redirect">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}

export default Register