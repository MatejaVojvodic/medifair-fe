import axios from "axios"

const API_URL = "http://localhost:8080/users"

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`)
  return response.data
}

export const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData)
  return response.data
}

export const changePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/change-password`, passwordData)
  return response.data
}

export const deleteAccount = async () => {
  const response = await axios.delete(`${API_URL}/account`)
  return response.data
}