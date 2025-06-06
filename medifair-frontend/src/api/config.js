// Environment detection
const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
const isProduction = !isDevelopment

// Base URLs for different environments
const config = {
  development: {
    MAIN_API_URL: "http://localhost:8080",
    CHAT_API_URL: "http://localhost:8081",
    WS_URL: "ws://localhost:8081/ws/chat",
  },
  production: {
    MAIN_API_URL: "http://167.99.17.26",
    CHAT_API_URL: "http://209.38.52.45",
    WS_URL: "ws://209.38.52.45/ws/chat",
  },
}

// Get current environment config
const currentConfig = isDevelopment ? config.development : config.production

// Export the URLs
export const API_BASE_URL = currentConfig.MAIN_API_URL
export const CHAT_API_BASE_URL = currentConfig.CHAT_API_URL
export const WS_BASE_URL = currentConfig.WS_URL

// Debug logging
console.log("Environment:", isDevelopment ? "development" : "production")
console.log("API Base URL:", API_BASE_URL)
console.log("Chat API URL:", CHAT_API_BASE_URL)
console.log("WebSocket URL:", WS_BASE_URL)

export default {
  API_BASE_URL,
  CHAT_API_BASE_URL,
  WS_BASE_URL,
  isDevelopment,
  isProduction,
}
