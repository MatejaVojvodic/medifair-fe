// import axios from "axios"
// import SockJS from "sockjs-client"
// import { Stomp } from "@stomp/stompjs"
// import { getAuthToken } from "./authService"

// const API_URL = "http://localhost:8081/api/chat"
// const WS_URL = "http://localhost:8081/ws/chat"
// const MAIN_API_URL = "http://localhost:8080/api/users"

// let stompClient = null

// // Create axios instance with auth header
// const chatApi = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// })

// // Create axios instance for main server
// const mainApi = axios.create({
//   baseURL: MAIN_API_URL,
//   withCredentials: true,
// })

// // Add auth token to every request
// const addAuthInterceptor = (apiInstance) => {
//   apiInstance.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken()
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`
//       }
//       console.log("API request:", config.method?.toUpperCase(), config.url, config.headers)
//       return config
//     },
//     (error) => {
//       return Promise.reject(error)
//     },
//   )

//   apiInstance.interceptors.response.use(
//     (response) => {
//       console.log("API response:", response.status, response.config.url)
//       return response
//     },
//     (error) => {
//       console.error("API error:", error.response?.status, error.response?.data, error.config?.url)
//       return Promise.reject(error)
//     },
//   )
// }

// addAuthInterceptor(chatApi)
// addAuthInterceptor(mainApi)

// export const connectToChat = (token, onMessageReceived, onConnected, onError) => {
//   const socket = new SockJS(WS_URL)
//   stompClient = Stomp.over(socket)

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   }

//   stompClient.connect(
//     headers,
//     (frame) => {
//       console.log("Connected to chat: " + frame)
//       if (onConnected) onConnected()

//       // Subscribe to private messages
//       stompClient.subscribe("/user/queue/messages", (message) => {
//         const receivedMessage = JSON.parse(message.body)
//         if (onMessageReceived) onMessageReceived(receivedMessage)
//       })
//     },
//     (error) => {
//       console.error("Chat connection error: ", error)
//       if (onError) onError(error)
//     },
//   )
// }

// export const disconnectFromChat = () => {
//   if (stompClient && stompClient.connected) {
//     stompClient.disconnect()
//     console.log("Disconnected from chat")
//   }
// }

// export const sendMessage = async (receiverUsername, content, type = "TEXT") => {
//   try {
//     const response = await chatApi.post("/send", {
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

// // Create or get existing chat room with a user
// export const createChatRoom = async (receiverUsername) => {
//   try {
//     console.log("Creating chat room with:", receiverUsername)
//     const response = await chatApi.post("/rooms/create", {
//       receiverUsername: receiverUsername,
//     })
//     console.log("Chat room created:", response.data)
//     return response.data
//   } catch (error) {
//     console.error("Error creating chat room:", error)
//     throw error
//   }
// }

// export const getUserChatRooms = async () => {
//   try {
//     const response = await chatApi.get("/rooms")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching chat rooms:", error)
//     throw error
//   }
// }

// export const getChatMessages = async (chatRoomId, page = 0, size = 50) => {
//   try {
//     const response = await chatApi.get(`/rooms/${chatRoomId}/messages?page=${page}&size=${size}`)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching chat messages:", error)
//     throw error
//   }
// }

// export const markMessagesAsRead = async (chatRoomId) => {
//   try {
//     await chatApi.post(`/rooms/${chatRoomId}/read`)
//   } catch (error) {
//     console.error("Error marking messages as read:", error)
//     throw error
//   }
// }

// export const getUnreadMessageCount = async (chatRoomId) => {
//   try {
//     const response = await chatApi.get(`/rooms/${chatRoomId}/unread-count`)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching unread count:", error)
//     throw error
//   }
// }

// // Get users from chat system (fallback)
// export const getAvailableUsers = async () => {
//   try {
//     const response = await chatApi.get("/users")
//     console.log("Available users from chat system:", response.data)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching available users from chat system:", error)
//     throw error
//   }
// }

// // Get users from main system (primary method)
// export const getAvailableUsersFromMain = async () => {
//   try {
//     console.log("Fetching users from main system...")
//     const response = await mainApi.get("/for-chat")
//     console.log("Available users from main system:", response.data)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching users from main system:", error)
//     // Fallback to chat system
//     console.log("Falling back to chat system users...")
//     return await getAvailableUsers()
//   }
// }

// // Sync users from main to chat system
// export const syncUsersToChat = async () => {
//   try {
//     const response = await chatApi.post("/sync-users")
//     console.log("Users synced to chat system")
//     return response.data
//   } catch (error) {
//     console.error("Error syncing users to chat system:", error)
//     throw error
//   }
// }

// export const checkChatHealth = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/health`)
//     return response.data
//   } catch (error) {
//     console.error("Chat service health check failed:", error)
//     throw error
//   }
// }

// // Cleanup duplicate users
// export const cleanupDuplicateUsers = async () => {
//   try {
//     const response = await chatApi.post("/cleanup-duplicates")
//     console.log("Duplicate users cleaned up")
//     return response.data
//   } catch (error) {
//     console.error("Error cleaning up duplicate users:", error)
//     throw error
//   }
// }

import axios from "axios"
import { CHAT_API_BASE_URL, WS_BASE_URL } from "./config.js"

// Create axios instance with base URL
const chatAPI = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Set auth token for chat API
export const setChatAuthHeader = (token) => {
  if (token) {
    chatAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete chatAPI.defaults.headers.common["Authorization"]
  }
}

// Initialize auth header from stored token
const token = localStorage.getItem("token")
if (token) {
  setChatAuthHeader(token)
}

// Get all chat rooms for current user
export const getChatRooms = async () => {
  try {
    console.log("Getting chat rooms from:", `${CHAT_API_BASE_URL}/api/chat/rooms`)
    const response = await chatAPI.get("/api/chat/rooms")
    return response.data
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    throw error
  }
}

// Alias for getChatRooms to maintain compatibility with existing code
export const getUserChatRooms = getChatRooms

// Get messages for a specific chat room
export const getChatMessages = async (roomId) => {
  try {
    console.log("Getting chat messages from:", `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/messages`)
    const response = await chatAPI.get(`/api/chat/rooms/${roomId}/messages`)
    return response.data
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw error
  }
}

// Create a new chat room
export const createChatRoom = async (receiverUsername) => {
  try {
    console.log("Creating chat room with:", `${CHAT_API_BASE_URL}/api/chat/rooms/create`)
    const response = await chatAPI.post("/api/chat/rooms/create", { receiverUsername })
    return response.data
  } catch (error) {
    console.error("Error creating chat room:", error)
    throw error
  }
}

// Send a message via HTTP API
export const sendMessage = async (receiverUsername, content, type = "TEXT") => {
  try {
    console.log("Sending message to:", `${CHAT_API_BASE_URL}/api/chat/send`)
    const response = await chatAPI.post("/api/chat/send", {
      receiverUsername,
      content,
      type,
    })
    return response.data
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Get available users to chat with
export const getAvailableUsers = async () => {
  try {
    console.log("Getting available users from:", `${CHAT_API_BASE_URL}/api/chat/users`)
    const response = await chatAPI.get("/api/chat/users")
    return response.data
  } catch (error) {
    console.error("Error fetching available users:", error)
    throw error
  }
}

// Get available users from main service (fallback)
export const getAvailableUsersFromMain = async () => {
  try {
    // Import userService to avoid circular dependency
    const { getAvailableUsersFromMain: getUsersFromMain } = await import("./userService.js")
    return await getUsersFromMain()
  } catch (error) {
    console.error("Error fetching users from main service:", error)
    return []
  }
}

// Cleanup duplicate users
export const cleanupDuplicateUsers = async () => {
  try {
    console.log("Cleaning up duplicate users:", `${CHAT_API_BASE_URL}/api/chat/cleanup-duplicates`)
    const response = await chatAPI.post("/api/chat/cleanup-duplicates")
    return response.data
  } catch (error) {
    console.error("Error cleaning up duplicate users:", error)
    // Don't throw error, just log it
    return { message: "Cleanup attempted" }
  }
}

// Mark messages as read
export const markMessagesAsRead = async (roomId) => {
  try {
    console.log("Marking messages as read:", `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/read`)
    const response = await chatAPI.post(`/api/chat/rooms/${roomId}/read`)
    return response.data
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// Get unread message count
export const getUnreadMessageCount = async (roomId) => {
  try {
    if (roomId) {
      console.log(
        "Getting unread message count for room:",
        `${CHAT_API_BASE_URL}/api/chat/rooms/${roomId}/unread-count`,
      )
      const response = await chatAPI.get(`/api/chat/rooms/${roomId}/unread-count`)
      return response.data
    } else {
      console.log("Getting total unread message count:", `${CHAT_API_BASE_URL}/api/chat/messages/unread/count`)
      const response = await chatAPI.get("/api/chat/messages/unread/count")
      return response.data
    }
  } catch (error) {
    console.error("Error fetching unread message count:", error)
    return 0 // Return 0 as a fallback
  }
}

// Get WebSocket URL for chat
export const getWebSocketUrl = () => {
  return `${WS_BASE_URL}/chat?token=${localStorage.getItem("token")}`
}
