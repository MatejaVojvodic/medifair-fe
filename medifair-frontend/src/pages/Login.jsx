// import { useState, useEffect } from "react"
// import { useNavigate, Link, useLocation } from "react-router-dom"
// import { login } from "../api/authService"
// import { useAuth } from "../context/AuthContext"
// import "../assets/styles/auth.css"

// const Login = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   })

//   // UI state
//   const [error, setError] = useState("")
//   const [successMessage, setSuccessMessage] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   // Hooks
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { login: authLogin, isLoggedIn } = useAuth()

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/")
//     }
//   }, [isLoggedIn, navigate])

//   // Check for success message from registration
//   useEffect(() => {
//     if (location.state?.message) {
//       setSuccessMessage(location.state.message)
//     }
//   }, [location])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")
//     setSuccessMessage("")

//     try {
//       // Call the login API
//       const token = await login(formData)

//       // Update auth context with token
//       authLogin(token)

//       // Redirect to home page or intended page
//       const redirectTo = location.state?.from?.pathname || "/"
//       navigate(redirectTo)
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please check your credentials.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="container">
//       <div className="auth-page-container">
//         <div className="auth-container login-container">
//           <h2 className="auth-title">Login to MediFair</h2>

//           {/* Success message */}
//           {successMessage && <div className="success-message">{successMessage}</div>}

//           {/* Error message */}
//           {error && <div className="error-message">{error}</div>}

//           {/* Login form */}
//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your username"
//                 className="form-control"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className="form-control"
//               />
//             </div>

//             <button type="submit" disabled={isLoading} className="auth-button">
//               {isLoading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <p className="auth-redirect">
//             Don't have an account? <Link to="/register">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

"use client"

import { useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { login } from "../api/auth"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent double submission
    if (isLoading) {
      console.log("Login already in progress...")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      console.log("Login form: Submitting with data:", { username: formData.username })

      // Validate form data
      if (!formData.username || !formData.password) {
        throw new Error("Username and password are required")
      }

      // Call the login API
      const token = await login(formData)
      console.log("Login form: Token received from API")

      // Update auth context with token
      await authLogin(token)
      console.log("Login form: Auth context updated")

      // Redirect to home page or intended page
      const redirectTo = location.state?.from?.pathname || "/"
      console.log("Login form: Redirecting to:", redirectTo)
      navigate(redirectTo)
    } catch (err) {
      console.error("Login form: Error occurred:", err)
      setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
