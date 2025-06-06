
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

// Create axios instance for products
const productAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth interceptor
productAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllProducts = async () => {
  try {
    console.log("Fetching products from:", `${API_BASE_URL}/products`)
    const response = await productAPI.get("/products")
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const getProductById = async (id) => {
  try {
    console.log("Fetching product by ID from:", `${API_BASE_URL}/products/${id}`)
    const response = await productAPI.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

export const createProduct = async (product) => {
  try {
    console.log("Creating product at:", `${API_BASE_URL}/products`)
    const response = await productAPI.post("/products", product)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (id, product) => {
  try {
    console.log("Updating product at:", `${API_BASE_URL}/products/${id}`)
    const response = await productAPI.put(`/products/${id}`, product)
    return response.data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    console.log("Deleting product at:", `${API_BASE_URL}/products/${id}`)
    await productAPI.delete(`/products/${id}`)
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

export const filterProducts = async (filters) => {
  try {
    console.log("Filtering products at:", `${API_BASE_URL}/products/filter`)
    const response = await productAPI.get("/products/filter", { params: filters })
    return response.data
  } catch (error) {
    console.error("Error filtering products:", error)
    return []
  }
}
