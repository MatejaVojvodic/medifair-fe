import axios from "axios"
import { API_BASE_URL, CHAT_API_BASE_URL } from "./config"
import { getAuthToken, removeAuthToken } from "./authService"

// Create axios instances
export const mainApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

export const chatApiClient = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// Request interceptor to add auth token
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      console.error("Request interceptor error:", error)
      return Promise.reject(error)
    },
  )
}

// Response interceptor to handle errors
const addResponseInterceptor = (client) => {
  client.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`)
      return response
    },
    (error) => {
      console.error("API Error:", error.response?.status, error.response?.data)

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401) {
        removeAuthToken()
        window.location.href = "/login"
      }

      return Promise.reject(error)
    },
  )
}

// Apply interceptors
addAuthInterceptor(mainApiClient)
addAuthInterceptor(chatApiClient)
addResponseInterceptor(mainApiClient)
addResponseInterceptor(chatApiClient)

export default { mainApiClient, chatApiClient }