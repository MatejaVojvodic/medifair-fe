// import { createContext, useState, useContext, useEffect } from "react"
// import { login, register, logout, getCurrentUser } from "../api/authService.js"

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       getCurrentUser()
//         .then((userData) => {
//           setUser(userData)
//           setIsLoggedIn(true)
//         })
//         .catch((err) => {
//           console.error("Error getting current user:", err)
//           localStorage.removeItem("token")
//         })
//         .finally(() => {
//           setIsLoading(false)
//         })
//     } else {
//       setIsLoading(false)
//     }
//   }, [])

//   const handleLogin = async (credentials) => {
//     try {
//       setIsLoading(true)
//       setError("")
//       const token = await login(credentials)

//       if (token) {
//         localStorage.setItem("token", token)
//         setUser({ username: credentials.username })
//         setIsLoggedIn(true)
//         return { success: true, user: { username: credentials.username } }
//       } else {
//         throw new Error("No token received")
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || "Login failed"
//       setError(errorMessage)
//       console.error("Login error:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRegister = async (userData) => {
//     try {
//       setIsLoading(true)
//       setError("")
//       const token = await register(userData)

//       if (token) {
//         localStorage.setItem("token", token)
//         setUser({ username: userData.username })
//         setIsLoggedIn(true)
//         return { success: true, user: { username: userData.username } }
//       } else {
//         throw new Error("No token received")
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || "Registration failed"
//       setError(errorMessage)
//       console.error("Registration error:", err)
//       return { success: false, error: errorMessage }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (err) {
//       console.error("Logout error:", err)
//     } finally {
//       localStorage.removeItem("token")
//       setUser(null)
//       setIsLoggedIn(false)
//     }
//   }

//   const isAdmin = () => {
//     return user?.roles?.includes("ADMIN") || false
//   }

//   const getToken = () => {
//     return localStorage.getItem("token")
//   }

//   const value = {
//     user,
//     username: user?.username,
//     isLoggedIn,
//     isLoading,
//     error,
//     login: handleLogin,
//     register: handleRegister,
//     logout: handleLogout,
//     isAdmin,
//     getToken,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
  initializeAuth,
} from "../api/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize auth and check if token exists
        const hasToken = initializeAuth()

        if (hasToken) {
          // Try to get current user to verify token is valid
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        // Token might be invalid, clear it
        logoutService()
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const token = await loginService(credentials)

      // Get user data after successful login
      const userData = await getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, token }
    } catch (error) {
      console.error("Login failed:", error)
      setUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const token = await registerService(userData)

      // Get user data after successful registration
      const userProfile = await getCurrentUser()
      setUser(userProfile)
      setIsAuthenticated(true)

      return { success: true, token }
    } catch (error) {
      console.error("Registration failed:", error)
      setUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    logoutService()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


