
import axios from "axios"

const API_URL = "http://localhost:8080/cart"

export const getCart = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addToCart = async (cartItem) => {
  const response = await axios.post(`${API_URL}/items`, cartItem)
  return response.data
}

export const updateCartItem = async (productId, quantity) => {
  const response = await axios.put(`${API_URL}/items/${productId}?quantity=${quantity}`)
  return response.data
}

export const updateCartItemWithBody = async (productId, cartItem) => {
  const response = await axios.patch(`${API_URL}/items/${productId}`, cartItem)
  return response.data
}

export const removeFromCart = async (productId) => {
  await axios.delete(`${API_URL}/items/${productId}`)
}

export const clearCart = async () => {
  await axios.delete(API_URL)
}