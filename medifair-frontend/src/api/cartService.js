
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

// Get the current user's cart
export const getCart = async () => {
  try {
    console.log("Getting cart from:", `${API_BASE_URL}/cart`)
    const response = await cartAPI.get("/cart")
    return response.data
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

// Add an item to the cart
export const addToCart = async (cartItemData) => {
  try {
    console.log("Adding to cart at:", `${API_BASE_URL}/cart/items`)
    const response = await cartAPI.post("/cart/items", cartItemData)
    return response.data
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

// Update a cart item's quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    console.log("Updating cart item at:", `${API_BASE_URL}/cart/items/${productId}?quantity=${quantity}`)
    const response = await cartAPI.put(`/cart/items/${productId}?quantity=${quantity}`)
    return response.data
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

// Remove an item from the cart
export const removeFromCart = async (productId) => {
  try {
    console.log("Removing from cart at:", `${API_BASE_URL}/cart/items/${productId}`)
    const response = await cartAPI.delete(`/cart/items/${productId}`)
    return response.data
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

// Clear the entire cart
export const clearCart = async () => {
  try {
    console.log("Clearing cart at:", `${API_BASE_URL}/cart`)
    const response = await cartAPI.delete("/cart")
    return response.data
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}