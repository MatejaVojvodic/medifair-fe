import { createContext, useState, useEffect, useContext } from "react"
import { isAuthenticated, logout, setupAuthInterceptor, getToken } from "../api/authService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRoles, setUserRoles] = useState([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Set up axios interceptors and check authentication
    setupAuthInterceptor()

    // Check if user is already logged in
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)

      if (authenticated) {
        const token = getToken()
        if (token) {
          try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(token.split(".")[1]))
            console.log("Decoded token payload:", payload) // Debug log
            setUserRoles(payload.roles || [])
            setUsername(payload.sub || "")
          } catch (error) {
            console.error("Error decoding token:", error)
            setUserRoles([])
            setUsername("")
          }
        }
      } else {
        setUserRoles([])
        setUsername("")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (token) => {
    setIsLoggedIn(true)

    if (token) {
      try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log("Login - Decoded token payload:", payload) // Debug log
        setUserRoles(payload.roles || [])
        setUsername(payload.sub || "")
      } catch (error) {
        console.error("Error decoding token:", error)
        setUserRoles([])
        setUsername("")
      }
    }
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUserRoles([])
    setUsername("")
  }

  const isAdmin = () => {
    console.log("isAdmin check - userRoles:", userRoles) // Debug log
    return Array.isArray(userRoles) && userRoles.includes("ADMIN")
  }

  const isUser = () => {
    console.log("isUser check - userRoles:", userRoles) // Debug log
    return Array.isArray(userRoles) && userRoles.includes("USER")
  }

  const value = {
    isLoggedIn,
    isLoading,
    userRoles,
    username,
    login: handleLogin,
    logout: handleLogout,
    isAdmin,
    isUser,
    getToken, // Add getToken method
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
