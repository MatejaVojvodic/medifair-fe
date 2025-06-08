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

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null)

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    if (storedToken) {
      setAuthToken(storedToken)
      setAuthHeader(storedToken)
      getCurrentUser()
        .then((userData) => {
          setUser(userData)
          setIsLoggedIn(true)
        })
        .catch((err) => {
          console.error("Error fetching user data on app load:", err)
          localStorage.removeItem("authToken")
          setAuthHeader(null)
        })
    }
  }, [])

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`)
      return response.data
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  }

  const login = async (token) => {
    try {
      // Prevent double calls
      if (isLoading) {
        console.log("Login already in progress, skipping...")
        return
      }

      setIsLoading(true)
      setError(null)

      if (!token || typeof token !== "string") {
        throw new Error("Invalid token provided to login function")
      }

      console.log("AuthContext: Processing login with token")

      // Store token
      localStorage.setItem("authToken", token)
      setAuthHeader(token)

      // Get user profile
      const userData = await getCurrentUser()
      console.log("AuthContext: User data retrieved:", userData)

      setUser(userData)
      setIsLoggedIn(true)

      console.log("AuthContext: Login completed successfully")
    } catch (error) {
      console.error("AuthContext: Login failed:", error)
      setError(error.message)

      // Clean up on error
      localStorage.removeItem("authToken")
      setAuthHeader(null)
      setUser(null)
      setIsLoggedIn(false)

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsLoading(true)

    // Clear auth state
    localStorage.removeItem("authToken")
    setAuthHeader(null)
    setUser(null)
    setIsLoggedIn(false)
    setError(null)

    console.log("AuthContext: User logged out")
    setIsLoading(false)
  }

  const value = {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    logout,
    authToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }

