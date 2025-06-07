// // Determine if we're in production or development
// const isProduction = import.meta.env.PROD || window.location.hostname !== "localhost"

// // Set the base URLs based on environment
// export const API_BASE_URL = isProduction
//   ? "http://167.99.17.26" // Your actual backend server IP
//   : "http://localhost:8080"

// export const CHAT_API_BASE_URL = isProduction
//   ? "http://209.38.52.45" // Your actual chat server IP
//   : "http://localhost:8081"

// export const WS_BASE_URL = isProduction
//   ? "ws://209.38.52.45/ws" // WebSocket connection to chat service
//   : "ws://localhost:8081/ws"

// // Log the environment and URLs for debugging
// console.log("Environment:", isProduction ? "production" : "development")
// console.log("API Base URL:", API_BASE_URL)
// console.log("Chat API URL:", CHAT_API_BASE_URL)
// console.log("WebSocket URL:", WS_BASE_URL)

// Determine if we're in production or development
const isProduction = import.meta.env.PROD || window.location.hostname !== "localhost"

// Set the base URLs based on environment
export const API_BASE_URL = isProduction
  ? "/api" // Use nginx proxy in production
  : "http://localhost:8080"

export const CHAT_API_BASE_URL = isProduction
  ? "/api/chat" // Use nginx proxy in production
  : "http://localhost:8081"

export const WS_BASE_URL = isProduction
  ? "/ws" // Use nginx proxy in production
  : "ws://localhost:8081/ws"

// Log the environment and URLs for debugging
console.log("Environment:", isProduction ? "production" : "development")
console.log("API Base URL:", API_BASE_URL)
console.log("Chat API URL:", CHAT_API_BASE_URL)
console.log("WebSocket URL:", WS_BASE_URL)


