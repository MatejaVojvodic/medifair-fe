// import axios from "axios"

// const API_URL = "http://localhost:8080/orders"

// export const checkout = async (checkoutData) => {
//   const response = await axios.post(`${API_URL}/checkout`, checkoutData)
//   return response.data
// }

// export const getUserOrders = async () => {
//   const response = await axios.get(API_URL)
//   return response.data
// }

// export const getOrderById = async (orderId) => {
//   const response = await axios.get(`${API_URL}/${orderId}`)
//   return response.data
// }

import axios from "axios"
import { API_BASE_URL } from "./config.js"

// Create axios instance for orders
const orderAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth interceptor
orderAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const checkout = async (checkoutData) => {
  try {
    console.log("Creating checkout order at:", `${API_BASE_URL}/orders/checkout`)
    const response = await orderAPI.post("/orders/checkout", checkoutData)
    return response.data
  } catch (error) {
    console.error("Error during checkout:", error)
    throw error
  }
}

export const createOrder = async (orderData) => {
  try {
    console.log("Creating order at:", `${API_BASE_URL}/orders`)
    const response = await orderAPI.post("/orders", orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    console.log("Getting orders from:", `${API_BASE_URL}/orders`)
    const response = await orderAPI.get("/orders")
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export const getUserOrders = async () => {
  try {
    console.log("Getting user orders from:", `${API_BASE_URL}/orders`)
    const response = await orderAPI.get("/orders")
    return response.data
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error
  }
}

export const getOrderById = async (orderId) => {
  try {
    console.log("Getting order by ID from:", `${API_BASE_URL}/orders/${orderId}`)
    const response = await orderAPI.get(`/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}