import axios from "axios"

const API_URL = "http://localhost:8080/products"

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

export const createProduct = async (product) => {
  try {
    const response = await axios.post(API_URL, product)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, product)
    return response.data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

export const filterProducts = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/filter`, { params: filters })
    return response.data
  } catch (error) {
    console.error("Error filtering products:", error)
    return []
  }
}
