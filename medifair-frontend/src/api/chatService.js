// import axios from "axios"
// import { CHAT_API_BASE_URL, WS_BASE_URL } from "./config.js"

// // Create axios instance with base URL
// const chatAPI = axios.create({
//   baseURL: CHAT_API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Set auth token for chat API
// export const setChatAuthHeader = (token) => {
//   if (token) {
//     chatAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`
//   } else {
//     delete chatAPI.defaults.headers.common["Authorization"]
//   }
// }

// // Initialize auth header from stored token
// const token = localStorage.getItem("token")
// if (token) {
//   setChatAuthHeader(token)
// }

// // Get all chat rooms for current user
// export const getChatRooms = async () => {
//   try {
//     console.log("Getting chat rooms from:", `${CHAT_API_BASE_URL}/api/chat/rooms`)
//     const response = await chatAPI.get("/api/chat/rooms")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching chat rooms:", error)
//     throw error
//   }
// }

// // Alias for getChatRooms to maintain compatibility with existing code
// export const getUserChatRooms = getChatRooms

// // Get messages for a specific chat room
// export const getChatMessages = async (roomId) => {
//   try {
//     console.log("Getting chat messages from:", `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/messages`)
//     const response = await chatAPI.get(`/api/chat/rooms/${roomId}/messages`)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching chat messages:", error)
//     throw error
//   }
// }

// // Create a new chat room
// export const createChatRoom = async (receiverUsername) => {
//   try {
//     console.log("Creating chat room with:", `${CHAT_API_BASE_URL}/api/chat/rooms/create`)
//     const response = await chatAPI.post("/api/chat/rooms/create", { receiverUsername })
//     return response.data
//   } catch (error) {
//     console.error("Error creating chat room:", error)
//     throw error
//   }
// }

// // Send a message via HTTP API
// export const sendMessage = async (receiverUsername, content, type = "TEXT") => {
//   try {
//     console.log("Sending message to:", `${CHAT_API_BASE_URL}/api/chat/send`)
//     const response = await chatAPI.post("/api/chat/send", {
//       receiverUsername,
//       content,
//       type,
//     })
//     return response.data
//   } catch (error) {
//     console.error("Error sending message:", error)
//     throw error
//   }
// }

// // Get available users to chat with
// export const getAvailableUsers = async () => {
//   try {
//     console.log("Getting available users from:", `${CHAT_API_BASE_URL}/api/chat/users`)
//     const response = await chatAPI.get("/api/chat/users")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching available users:", error)
//     throw error
//   }
// }

// // Get available users from main service (fallback)
// export const getAvailableUsersFromMain = async () => {
//   try {
//     // Import userService to avoid circular dependency
//     const { getAvailableUsersFromMain: getUsersFromMain } = await import("./userService.js")
//     return await getUsersFromMain()
//   } catch (error) {
//     console.error("Error fetching users from main service:", error)
//     return []
//   }
// }

// // Cleanup duplicate users
// export const cleanupDuplicateUsers = async () => {
//   try {
//     console.log("Cleaning up duplicate users:", `${CHAT_API_BASE_URL}/api/chat/cleanup-duplicates`)
//     const response = await chatAPI.post("/api/chat/cleanup-duplicates")
//     return response.data
//   } catch (error) {
//     console.error("Error cleaning up duplicate users:", error)
//     // Don't throw error, just log it
//     return { message: "Cleanup attempted" }
//   }
// }

// // Mark messages as read
// export const markMessagesAsRead = async (roomId) => {
//   try {
//     console.log("Marking messages as read:", `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/read`)
//     const response = await chatAPI.post(`/api/chat/rooms/${roomId}/read`)
//     return response.data
//   } catch (error) {
//     console.error("Error marking messages as read:", error)
//     throw error
//   }
// }

// // Get unread message count
// export const getUnreadMessageCount = async (roomId) => {
//   try {
//     if (roomId) {
//       console.log(
//         "Getting unread message count for room:",
//         `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/unread-count`,
//       )
//       const response = await chatAPI.get(`/api/chat/rooms/${roomId}/unread-count`)
//       return response.data
//     } else {
//       console.log("Getting total unread message count:", `${CHAT_API_BASE_URL}/api/chat/messages/unread/count`)
//       const response = await chatAPI.get("/api/chat/messages/unread/count")
//       return response.data
//     }
//   } catch (error) {
//     console.error("Error fetching unread message count:", error)
//     return 0 // Return 0 as a fallback
//   }
// }

// // Get WebSocket URL for chat
// export const getWebSocketUrl = () => {
//   return `${WS_BASE_URL}/chat?token=${localStorage.getItem("token")}`
// }

import axios from "axios"
import { CHAT_API_BASE_URL } from "./config"

// Create axios instance for chat service
const chatApi = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getChatRooms = async () => {
  try {
    const url = "/rooms" // ✅ FIXED: Remove /api/chat/ prefix
    console.log("Getting chat rooms from:", CHAT_API_BASE_URL + url)
    const response = await chatApi.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    throw error
  }
}

export const createChatRoom = async (participantUsername) => {
  try {
    const url = "/rooms/create" // ✅ FIXED: Remove /api/chat/ prefix
    console.log("Creating chat room with:", CHAT_API_BASE_URL + url)
    const response = await chatApi.post(url, {
      participantUsername: participantUsername,
    })
    return response.data
  } catch (error) {
    console.error("Error creating chat room:", error)
    throw error
  }
}

export const getChatMessages = async (roomId) => {
  try {
    const response = await chatApi.get(`/rooms/${roomId}/messages`) // ✅ FIXED
    return response.data
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw error
  }
}

export const sendMessage = async (roomId, content) => {
  try {
    const response = await chatApi.post(`/rooms/${roomId}/messages`, {
      content: content,
    })
    return response.data
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const cleanupDuplicateUsers = async () => {
  try {
    const url = "/cleanup-duplicates" // ✅ FIXED: Remove /api/chat/ prefix
    console.log("Cleaning up duplicate users:", CHAT_API_BASE_URL + url)
    const response = await chatApi.post(url)
    console.log("Cleaned up duplicate users")
    return response.data
  } catch (error) {
    console.error("Error cleaning up duplicate users:", error)
    throw error
  }
}

export const getUnreadMessageCount = async (roomId) => {
  try {
    const response = await chatApi.get(`/rooms/${roomId}/unread-count`)
    return response.data
  } catch (error) {
    console.error("Error getting unread message count:", error)
    throw error
  }
}

export const markMessagesAsRead = async (roomId) => {
  try {
    await chatApi.post(`/rooms/${roomId}/mark-as-read`)
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

export const getAvailableUsers = async () => {
  try {
    const response = await chatApi.get("/available-users")
    return response.data
  } catch (error) {
    console.error("Error getting available users:", error)
    throw error
  }
}

export const getAvailableUsersFromMain = async () => {
  try {
    const response = await chatApi.get("/available-users-from-main")
    return response.data
  } catch (error) {
    console.error("Error getting available users from main:", error)
    throw error
  }
}

// Add this export alias for backward compatibility
export const getUserChatRooms = getChatRooms

// Update the default export to include all functions
export default {
  getChatRooms,
  getUserChatRooms, // Add this line
  createChatRoom,
  getChatMessages,
  sendMessage,
  cleanupDuplicateUsers,
  getUnreadMessageCount,
  markMessagesAsRead,
  getAvailableUsers,
  getAvailableUsersFromMain,
}
