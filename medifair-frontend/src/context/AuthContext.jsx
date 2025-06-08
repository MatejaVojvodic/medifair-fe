import { createContext, useState, useContext, useEffect } from "react"
import { login, register, logout, getCurrentUser } from "../api/authService.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      getCurrentUser()
        .then((userData) => {
          setUser(userData)
          setIsLoggedIn(true)
        })
        .catch((err) => {
          console.error("Error getting current user:", err)
          localStorage.removeItem("token")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      setError("")
      const token = await login(credentials)

      if (token) {
        localStorage.setItem("token", token)
        setUser({ username: credentials.username })
        setIsLoggedIn(true)
        return { success: true, user: { username: credentials.username } }
      } else {
        throw new Error("No token received")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed"
      setError(errorMessage)
      console.error("Login error:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    try {
      setIsLoading(true)
      setError("")
      const token = await register(userData)

      if (token) {
        localStorage.setItem("token", token)
        setUser({ username: userData.username })
        setIsLoggedIn(true)
        return { success: true, user: { username: userData.username } }
      } else {
        throw new Error("No token received")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed"
      setError(errorMessage)
      console.error("Registration error:", err)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const isAdmin = () => {
    return user?.roles?.includes("ADMIN") || false
  }

  const getToken = () => {
    return localStorage.getItem("token")
  }

  const value = {
    user,
    username: user?.username,
    isLoggedIn,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAdmin,
    getToken,
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
