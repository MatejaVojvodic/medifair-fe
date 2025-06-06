
// import axios from "axios"

// const API_URL = "http://localhost:8080/cart"

// export const getCart = async () => {
//   const response = await axios.get(API_URL)
//   return response.data
// }

// export const addToCart = async (cartItem) => {
//   const response = await axios.post(`${API_URL}/items`, cartItem)
//   return response.data
// }

// export const updateCartItem = async (productId, quantity) => {
//   const response = await axios.put(`${API_URL}/items/${productId}?quantity=${quantity}`)
//   return response.data
// }

// export const updateCartItemWithBody = async (productId, cartItem) => {
//   const response = await axios.patch(`${API_URL}/items/${productId}`, cartItem)
//   return response.data
// }

// export const removeFromCart = async (productId) => {
//   await axios.delete(`${API_URL}/items/${productId}`)
// }

// export const clearCart = async () => {
//   await axios.delete(API_URL)
// }

import axios from "axios"
import { API_BASE_URL } from "./config.js"

// Create axios instance for cart
const cartAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth interceptor
cartAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getCart = async () => {
  try {
    console.log("Getting cart from:", `${API_BASE_URL}/api/cart`)
    const response = await cartAPI.get("/api/cart")
    return response.data
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

export const addToCart = async (productId, quantity = 1) => {
  try {
    console.log("Adding to cart at:", `${API_BASE_URL}/api/cart/add`)
    const response = await cartAPI.post("/api/cart/add", {
      productId,
      quantity,
    })
    return response.data
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export const updateCartItem = async (productId, quantity) => {
  try {
    console.log("Updating cart item at:", `${API_BASE_URL}/api/cart/update`)
    const response = await cartAPI.put("/api/cart/update", {
      productId,
      quantity,
    })
    return response.data
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

export const removeFromCart = async (productId) => {
  try {
    console.log("Removing from cart at:", `${API_BASE_URL}/api/cart/remove/${productId}`)
    const response = await cartAPI.delete(`/api/cart/remove/${productId}`)
    return response.data
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export const clearCart = async () => {
  try {
    console.log("Clearing cart at:", `${API_BASE_URL}/api/cart/clear`)
    const response = await cartAPI.delete("/api/cart/clear")
    return response.data
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}
