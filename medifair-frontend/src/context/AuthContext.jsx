// import { createContext, useState, useEffect, useContext } from "react"
// import { isAuthenticated, logout, setupAuthInterceptor, getToken } from "../api/authService"

// const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [userRoles, setUserRoles] = useState([])
//   const [username, setUsername] = useState("")

//   useEffect(() => {
//     // Set up axios interceptors and check authentication
//     setupAuthInterceptor()

//     // Check if user is already logged in
//     const checkAuth = () => {
//       const authenticated = isAuthenticated()
//       setIsLoggedIn(authenticated)

//       if (authenticated) {
//         const token = getToken()
//         if (token) {
//           try {
//             // Decode JWT token to get user info
//             const payload = JSON.parse(atob(token.split(".")[1]))
//             console.log("Decoded token payload:", payload) // Debug log
//             setUserRoles(payload.roles || [])
//             setUsername(payload.sub || "")
//           } catch (error) {
//             console.error("Error decoding token:", error)
//             setUserRoles([])
//             setUsername("")
//           }
//         }
//       } else {
//         setUserRoles([])
//         setUsername("")
//       }

//       setIsLoading(false)
//     }

//     checkAuth()
//   }, [])

//   const handleLogin = (token) => {
//     setIsLoggedIn(true)

//     if (token) {
//       try {
//         // Decode JWT token to get user info
//         const payload = JSON.parse(atob(token.split(".")[1]))
//         console.log("Login - Decoded token payload:", payload) // Debug log
//         setUserRoles(payload.roles || [])
//         setUsername(payload.sub || "")
//       } catch (error) {
//         console.error("Error decoding token:", error)
//         setUserRoles([])
//         setUsername("")
//       }
//     }
//   }

//   const handleLogout = () => {
//     logout()
//     setIsLoggedIn(false)
//     setUserRoles([])
//     setUsername("")
//   }

//   const isAdmin = () => {
//     console.log("isAdmin check - userRoles:", userRoles) // Debug log
//     return Array.isArray(userRoles) && userRoles.includes("ADMIN")
//   }

//   const isUser = () => {
//     console.log("isUser check - userRoles:", userRoles) // Debug log
//     return Array.isArray(userRoles) && userRoles.includes("USER")
//   }

//   const value = {
//     isLoggedIn,
//     isLoading,
//     userRoles,
//     username,
//     login: handleLogin,
//     logout: handleLogout,
//     isAdmin,
//     isUser,
//     getToken, // Add getToken method
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