// import axios from "axios"
// import { API_BASE_URL } from "./config.js"

// // Create axios instance for user operations
// const userAPI = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Add auth interceptor
// userAPI.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export const getUserProfile = async () => {
//   try {
//     console.log("Getting user profile from:", `${API_BASE_URL}/api/users/profile`)
//     const response = await userAPI.get("/api/users/profile")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching user profile:", error)
//     throw error
//   }
// }

// export const updateUserProfile = async (profileData) => {
//   try {
//     console.log("Updating user profile at:", `${API_BASE_URL}/api/users/profile`)
//     const response = await userAPI.put("/api/users/profile", profileData)
//     return response.data
//   } catch (error) {
//     console.error("Error updating user profile:", error)
//     throw error
//   }
// }

// // Alias for Profile.jsx compatibility
// export const updateProfile = updateUserProfile

// export const changePassword = async (passwordData) => {
//   try {
//     console.log("Changing password at:", `${API_BASE_URL}/api/users/change-password`)
//     const response = await userAPI.post("/api/users/change-password", passwordData)
//     return response.data
//   } catch (error) {
//     console.error("Error changing password:", error)
//     throw error
//   }
// }

// export const deleteAccount = async () => {
//   try {
//     console.log("Deleting account at:", `${API_BASE_URL}/api/users/account`)
//     const response = await userAPI.delete("/api/users/account")
//     return response.data
//   } catch (error) {
//     console.error("Error deleting account:", error)
//     throw error
//   }
// }

// export const getAllUsers = async () => {
//   try {
//     console.log("Getting all users from:", `${API_BASE_URL}/api/users/all`)
//     const response = await userAPI.get("/api/users/all")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching users:", error)
//     throw error
//   }
// }

// // Get users for chat functionality
// export const getAvailableUsersFromMain = async () => {
//   try {
//     console.log("Getting available users from main service:", `${API_BASE_URL}/api/users/for-chat`)
//     const response = await userAPI.get("/api/users/for-chat")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching available users:", error)
//     // Fallback to getAllUsers if the specific endpoint doesn't exist
//     return await getAllUsers()
//   }
// }

import axios from "axios"
import { API_BASE_URL } from "./config.js"

// Create axios instance for user operations
const userAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth interceptor
userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getCurrentUser = async () => {
  try {
    console.log("Getting current user with URL:", `${API_BASE_URL}/users/profile`)
    const response = await userAPI.get("/users/profile")
    return response.data
  } catch (error) {
    console.error("Get current user error:", error)
    throw error
  }
}

export const getUserProfile = async () => {
  try {
    const url = "/users/profile" // ✅ FIXED: Remove /api/ prefix
    console.log("Getting user profile from:", API_BASE_URL + url)
    const response = await userAPI.get(url)
    return response.data
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    console.log("Updating user profile at:", `${API_BASE_URL}/users/profile`)
    const response = await userAPI.put("/users/profile", profileData) // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Alias for Profile.jsx compatibility
export const updateProfile = updateUserProfile

export const changePassword = async (passwordData) => {
  try {
    console.log("Changing password at:", `${API_BASE_URL}/users/change-password`)
    const response = await userAPI.put("/users/change-password", passwordData) // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

export const deleteUserAccount = async () => {
  try {
    console.log("Deleting account at:", `${API_BASE_URL}/users/account`)
    const response = await userAPI.delete("/users/account") // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error deleting user account:", error)
    throw error
  }
}

// Alias for Profile.jsx compatibility
export const deleteAccount = deleteUserAccount

export const getAllUsers = async () => {
  try {
    console.log("Getting all users from:", `${API_BASE_URL}/api/users/all`)
    const response = await userAPI.get("/api/users/all")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

// Get users for chat functionality
export const getAvailableUsersFromMain = async () => {
  try {
    const url = "/users/for-chat" // ✅ FIXED: Remove /api/ prefix
    console.log("Getting available users from main service:", API_BASE_URL + url)
    const response = await userAPI.get(url)
    return response.data
  } catch (error) {
    console.error("Error getting available users:", error)
    throw error
  }
}

export default {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount, // Add this line
}
