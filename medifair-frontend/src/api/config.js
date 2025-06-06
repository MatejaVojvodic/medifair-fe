// API Configuration
const isDevelopment = import.meta.env.DEV

// Base URLs - these will be proxied by Nginx in production
export const API_BASE_URL = isDevelopment ? "http://localhost:8080" : "/api"
export const CHAT_API_BASE_URL = isDevelopment ? "http://localhost:8081/api/chat" : "/api/chat"
export const WS_BASE_URL = isDevelopment ? "ws://localhost:8081/ws/chat" : "/ws/chat"

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",

  // User endpoints
  USERS: "/api/users",
  PROFILE: "/api/users/profile",

  // Product endpoints
  PRODUCTS: "/products",

  // Cart endpoints
  CART: "/api/cart",

  // Order endpoints
  ORDERS: "/api/orders",
}

// Chat API endpoints
export const CHAT_ENDPOINTS = {
  ROOMS: "/rooms",
  MESSAGES: "/messages",
  USERS: "/users",
  SEND: "/send",
  HEALTH: "/health",
}

export default {
  API_BASE_URL,
  CHAT_API_BASE_URL,
  WS_BASE_URL,
  API_ENDPOINTS,
  CHAT_ENDPOINTS,
}
