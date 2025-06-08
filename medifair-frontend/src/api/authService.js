// // import axios from "axios"

// // const API_URL = "http://localhost:8080/auth"

// // export const register = async (userData) => {
// //   try {
// //     const response = await axios.post(`${API_URL}/register`, userData)
// //     return response.data
// //   } catch (error) {
// //     console.error("Registration error:", error)
// //     throw error
// //   }
// // }

// // export const login = async (userData) => {
// //   try {
// //     const response = await axios.post(`${API_URL}/login`, userData)

// //     // Store the JWT token in localStorage
// //     if (response.data) {
// //       localStorage.setItem("token", response.data)
// //       // Set the token in axios default headers for future requests
// //       setAuthHeader(response.data)
// //     }

// //     return response.data
// //   } catch (error) {
// //     console.error("Login error:", error)
// //     throw error
// //   }
// // }

// // export const setAuthHeader = (token) => {
// //   if (token) {
// //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
// //   } else {
// //     delete axios.defaults.headers.common["Authorization"]
// //   }
// // }

// // export const logout = () => {
// //   localStorage.removeItem("token")
// //   setAuthHeader(null)
// // }

// // export const isAuthenticated = () => {
// //   const token = localStorage.getItem("token")
// //   return !!token
// // }

// // export const getToken = () => {
// //   return localStorage.getItem("token")
// // }

// // // Add this missing export
// // export const getAuthToken = () => {
// //   return localStorage.getItem("token")
// // }

// // export const initializeAuth = () => {
// //   const token = getToken()
// //   if (token) {
// //     setAuthHeader(token)
// //     return true
// //   }
// //   return false
// // }

// // export const setupAuthInterceptor = () => {
// //   // Set up axios interceptors for handling token expiration, etc.
// //   axios.interceptors.response.use(
// //     (response) => response,
// //     (error) => {
// //       if (error.response && error.response.status === 401) {
// //         // Token expired or invalid
// //         logout()
// //         window.location.href = "/login"
// //       }
// //       return Promise.reject(error)
// //     },
// //   )

// //   // Set default headers
// //   axios.defaults.headers.common["Content-Type"] = "application/json"

// //   // Initialize auth header from stored token
// //   const token = getToken()
// //   if (token) {
// //     setAuthHeader(token)
// //   }
// // }

// import axios from "axios"
// import { API_BASE_URL } from "./config.js"

// // Create axios instance with base URL
// const authAPI = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// export const register = async (userData) => {
//   try {
//     console.log("Registering user with URL:", `${API_BASE_URL}/auth/register`)
//     console.log("User data:", userData)
//     const response = await authAPI.post("/auth/register", userData)

//     // Store the JWT token if received
//     if (response.data) {
//       localStorage.setItem("token", response.data)
//       setAuthHeader(response.data)
//     }

//     return response.data
//   } catch (error) {
//     console.error("Registration error:", error)
//     console.error("Error response:", error.response?.data)
//     throw error
//   }
// }

// export const login = async (userData) => {
//   try {
//     console.log("Logging in user with URL:", `${API_BASE_URL}/auth/login`)
//     console.log("Login data:", userData)
//     const response = await authAPI.post("/auth/login", userData)

//     // Store the JWT token in localStorage
//     if (response.data) {
//       localStorage.setItem("token", response.data)
//       setAuthHeader(response.data)
//     }

//     return response.data
//   } catch (error) {
//     console.error("Login error:", error)
//     console.error("Error response:", error.response?.data)
//     throw error
//   }
// }

// export const getCurrentUser = async () => {
//   try {
//     console.log("Getting current user with URL:", `${API_BASE_URL}/api/users/profile`)
//     const response = await authAPI.get("/api/users/profile")
//     return response.data
//   } catch (error) {
//     console.error("Get current user error:", error)
//     throw error
//   }
// }

// export const setAuthHeader = (token) => {
//   if (token) {
//     authAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
//   } else {
//     delete authAPI.defaults.headers.common["Authorization"]
//     delete axios.defaults.headers.common["Authorization"]
//   }
// }

// export const logout = () => {
//   localStorage.removeItem("token")
//   setAuthHeader(null)
// }

// export const isAuthenticated = () => {
//   const token = localStorage.getItem("token")
//   return !!token
// }

// export const getToken = () => {
//   return localStorage.getItem("token")
// }

// export const getAuthToken = () => {
//   return localStorage.getItem("token")
// }

// export const removeAuthToken = () => {
//   localStorage.removeItem("token")
//   setAuthHeader(null)
// }

// export const initializeAuth = () => {
//   const token = getToken()
//   if (token) {
//     setAuthHeader(token)
//     return true
//   }
//   return false
// }

// export const setupAuthInterceptor = () => {
//   authAPI.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         logout()
//         window.location.href = "/login"
//       }
//       return Promise.reject(error)
//     },
//   )

//   const token = getToken()
//   if (token) {
//     setAuthHeader(token)
//   }
// }

// // Initialize auth on module load
// setupAuthInterceptor()

import axios from "axios"
import { API_BASE_URL } from "./config.js"

// Create axios instance with base URL
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle auth errors
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const register = async (userData) => {
  try {
    console.log("Registering user with URL:", `${API_BASE_URL}/auth/register`)
    console.log("User data:", userData)
    const response = await authAPI.post("/auth/register", userData)

    // Store the JWT token if received
    const { token } = response.data
    if (token) {
      localStorage.setItem("authToken", token)
      console.log("Registration successful, token stored")
      return token
    } else {
      throw new Error("No token received from server")
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export const login = async (credentials) => {
  try {
    console.log("Attempting login with:", credentials.username)
    const response = await authAPI.post("/auth/login", credentials)

    const { token } = response.data
    if (token) {
      localStorage.setItem("authToken", token)
      console.log("Login successful, token stored")
      return token
    } else {
      throw new Error("No token received from server")
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const url = "/users/profile" // ✅ FIXED: Remove /api/ prefix
    console.log("Getting current user with URL:", API_BASE_URL + url)
    const response = await authAPI.get(url)
    return response.data
  } catch (error) {
    console.error("Error getting current user:", error)
    throw error
  }
}

export const updateProfile = async (profileData) => {
  try {
    const response = await authAPI.put("/users/profile", profileData) // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await authAPI.put("/users/change-password", passwordData) // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

export const deleteAccount = async () => {
  try {
    const url = "/users/account" // ✅ FIXED: Remove /api/ prefix
    console.log("Deleting account at:", API_BASE_URL + url)
    const response = await authAPI.delete(url)

    // Clear local storage after successful deletion
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    return response.data
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
  console.log("User logged out, tokens cleared")
}

export const initializeAuth = () => {
  const token = localStorage.getItem("authToken")
  return !!token
}

export default authAPI