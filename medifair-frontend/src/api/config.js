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


// src/config.js or wherever your constants are

// src/api/config.js

const isProduction =
  import.meta.env.PROD ||
  (window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    !window.location.hostname.includes("localhost"));

// All API calls from the frontend should go through the Nginx proxy (159.223.240.149)
// Nginx then handles routing to the correct backend services (main or chat)
export const FRONTEND_BASE_URL = isProduction
  ? "http://159.223.240.149" // This is the public IP of your frontend Nginx proxy
  : "http://localhost:5173"; // Your local Vite dev server

// API Base URL for the main backend, accessed via Nginx proxy's /api/ path
export const API_BASE_URL = `${FRONTEND_BASE_URL}/api`;

// Chat API Base URL, accessed via Nginx proxy's /api/chat/ path
// Nginx will then proxy this to the chat service (209.38.52.45)
export const CHAT_API_BASE_URL = `${FRONTEND_BASE_URL}/api/chat`;

// WebSocket URL for the chat service, accessed via Nginx proxy's /ws/ path
// Nginx will then proxy this to the chat service's WebSocket endpoint (209.38.52.45/ws)
export const WS_BASE_URL = `${FRONTEND_BASE_URL}/ws`;

// Log the environment and URLs for debugging
console.log("Environment:", isProduction ? "production" : "development");
console.log("Hostname:", window.location.hostname);
console.log("Frontend Base URL:", FRONTEND_BASE_URL);
console.log("API Base URL:", API_BASE_URL);
console.log("Chat API URL:", CHAT_API_BASE_URL);
console.log("WebSocket URL:", WS_BASE_URL);



// const isProduction =
//   import.meta.env.PROD ||
//   (window.location.hostname !== "localhost" &&
//     window.location.hostname !== "127.0.0.1" &&
//     !window.location.hostname.includes("localhost"))

// // export const API_BASE_URL = isProduction
// //   ? "http://159.223.240.149/api" // Your main server
// //   : "http://localhost:8080"

// export const API_BASE_URL = isProduction
//   ? "http://159.223.240.149/api" // Your main server
//   : "http://localhost:8080"

// export const CHAT_API_BASE_URL = isProduction
//   ? "http://209.38.52.45/api" // Chat server
//   : "http://localhost:8081"

// export const WS_BASE_URL = isProduction
//   ? "http://209.38.52.45/ws" // WebSocket to chat service (use http, not ws)
//   : "http://localhost:8081/ws"

// // Log the environment and URLs for debugging
// console.log("Environment:", isProduction ? "production" : "development")
// console.log("Hostname:", window.location.hostname)
// console.log("API Base URL:", API_BASE_URL)
// console.log("Chat API URL:", CHAT_API_BASE_URL)
// console.log("WebSocket URL:", WS_BASE_URL)






