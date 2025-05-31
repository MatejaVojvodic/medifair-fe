import axios from "axios"

const API_URL = "http://localhost:8080/orders"

export const checkout = async (checkoutData) => {
  const response = await axios.post(`${API_URL}/checkout`, checkoutData)
  return response.data
}

export const getUserOrders = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/${orderId}`)
  return response.data
}