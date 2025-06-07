// import axios from "axios"

// const API_URL = "http://localhost:8080/api/users"

// export const getUserProfile = async () => {
//   const response = await axios.get(`${API_URL}/profile`)
//   return response.data
// }

// export const updateProfile = async (profileData) => {
//   const response = await axios.put(`${API_URL}/profile`, profileData)
//   return response.data
// }

// export const changePassword = async (passwordData) => {
//   const response = await axios.put(`${API_URL}/change-password`, passwordData)
//   return response.data
// }

// export const deleteAccount = async () => {
//   const response = await axios.delete(`${API_URL}/account`)
//   return response.data
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
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getUserProfile = async () => {
  try {
    console.log("Getting user profile from:", `${API_BASE_URL}/api/users/profile`)
    const response = await userAPI.get("/api/users/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (profileData) => {
  try {
    console.log("Updating user profile at:", `${API_BASE_URL}/api/users/profile`)
    const response = await userAPI.put("/api/users/profile", profileData)
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
    console.log("Changing password at:", `${API_BASE_URL}/api/users/change-password`)
    const response = await userAPI.post("/api/users/change-password", passwordData)
    return response.data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

export const deleteAccount = async () => {
  try {
    console.log("Deleting account at:", `${API_BASE_URL}/api/users/account`)
    const response = await userAPI.delete("/api/users/account")
    return response.data
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}

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
    console.log("Getting available users from main service:", `${API_BASE_URL}/api/users/for-chat`)
    const response = await userAPI.get("/api/users/for-chat")
    return response.data
  } catch (error) {
    console.error("Error fetching available users:", error)
    // Fallback to getAllUsers if the specific endpoint doesn't exist
    return await getAllUsers()
  }
}