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
import SockJS from "sockjs-client"
import { Stomp } from "@stomp/stompjs"
import { API_BASE_URL, CHAT_API_BASE_URL, WS_BASE_URL } from "./config.js"

// Cloud URLs - dynamically determined
const CHAT_API_URL = CHAT_API_BASE_URL
const WS_CHAT_URL = `${WS_BASE_URL}/chat`
const MAIN_API_URL = API_BASE_URL

let stompClient = null

// Create axios instance with auth header for chat service
const chatApi = axios.create({
  baseURL: CHAT_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Create axios instance for main server
const mainApi = axios.create({
  baseURL: MAIN_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Add auth token to every request
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken()
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      console.log("API request:", config.method?.toUpperCase(), config.baseURL + config.url)
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  apiInstance.interceptors.response.use(
    (response) => {
      console.log("API response:", response.status, response.config.url)
      return response
    },
    (error) => {
      console.error("API error:", error.response?.status, error.response?.data, error.config?.url)
      return Promise.reject(error)
    },
  )
}

addAuthInterceptor(chatApi)
addAuthInterceptor(mainApi)

// WebSocket connection for real-time chat
export const connectToChat = (token, onMessageReceived, onConnected, onError) => {
  console.log("Connecting to WebSocket at:", WS_CHAT_URL)

  const socket = new SockJS(WS_CHAT_URL)
  stompClient = Stomp.over(socket)

  // Disable debug logging in production
  stompClient.debug = (str) => {
    console.log("STOMP:", str)
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  stompClient.connect(
    headers,
    (frame) => {
      console.log("Connected to chat WebSocket: " + frame)
      if (onConnected) onConnected()

      // Subscribe to private messages
      stompClient.subscribe("/user/queue/messages", (message) => {
        const receivedMessage = JSON.parse(message.body)
        console.log("Received WebSocket message:", receivedMessage)
        if (onMessageReceived) onMessageReceived(receivedMessage)
      })

      // Subscribe to chat room messages
      stompClient.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body)
        console.log("Received room message:", receivedMessage)
        if (onMessageReceived) onMessageReceived(receivedMessage)
      })
    },
    (error) => {
      console.error("Chat WebSocket connection error: ", error)
      if (onError) onError(error)
    },
  )
}

export const disconnectFromChat = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect()
    console.log("Disconnected from chat WebSocket")
  }
}

// Send message via WebSocket (if connected) or HTTP API (fallback)
export const sendMessage = async (receiverUsername, content, type = "TEXT") => {
  try {
    console.log("Sending message to:", receiverUsername, "Content:", content)

    // Try WebSocket first if connected
    if (stompClient && stompClient.connected) {
      console.log("Sending via WebSocket...")
      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({
          receiverUsername,
          content,
          type,
        }),
      )
      return { success: true, method: "websocket" }
    } else {
      // Fallback to HTTP API
      console.log("Sending via HTTP API...")
      const response = await chatApi.post("/send", {
        receiverUsername,
        content,
        type,
      })
      return response.data
    }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Create or get existing chat room with a user
export const createChatRoom = async (receiverUsername) => {
  try {
    console.log("Creating chat room with:", receiverUsername)
    const response = await chatApi.post("/rooms/create", {
      receiverUsername: receiverUsername,
    })
    console.log("Chat room created:", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating chat room:", error)
    throw error
  }
}

export const getUserChatRooms = async () => {
  try {
    console.log("Getting chat rooms from:", CHAT_API_URL + "/rooms")
    const response = await chatApi.get("/rooms")
    return response.data
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    throw error
  }
}

// Alias for backward compatibility
export const getChatRooms = getUserChatRooms

export const getChatMessages = async (chatRoomId, page = 0, size = 50) => {
  try {
    const response = await chatApi.get(`/rooms/${chatRoomId}/messages?page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw error
  }
}

export const markMessagesAsRead = async (chatRoomId) => {
  try {
    await chatApi.post(`/rooms/${chatRoomId}/read`)
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

export const getUnreadMessageCount = async (chatRoomId) => {
  try {
    const response = await chatApi.get(`/rooms/${chatRoomId}/unread-count`)
    return response.data
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0 // Return 0 as fallback
  }
}

// Get users from chat system (fallback)
export const getAvailableUsers = async () => {
  try {
    const response = await chatApi.get("/users")
    console.log("Available users from chat system:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching available users from chat system:", error)
    throw error
  }
}

// Get users from main system (primary method)
export const getAvailableUsersFromMain = async () => {
  try {
    console.log("Fetching users from main system...")
    const response = await mainApi.get("/users/for-chat")
    console.log("Available users from main system:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching users from main system:", error)
    // Fallback to chat system
    console.log("Falling back to chat system users...")
    return await getAvailableUsers()
  }
}

// Sync users from main to chat system
export const syncUsersToChat = async () => {
  try {
    const response = await chatApi.post("/sync-users")
    console.log("Users synced to chat system")
    return response.data
  } catch (error) {
    console.error("Error syncing users to chat system:", error)
    throw error
  }
}

export const checkChatHealth = async () => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/health`)
    return response.data
  } catch (error) {
    console.error("Chat service health check failed:", error)
    throw error
  }
}

// Cleanup duplicate users
export const cleanupDuplicateUsers = async () => {
  try {
    const response = await chatApi.post("/cleanup-duplicates")
    console.log("Duplicate users cleaned up")
    return response.data
  } catch (error) {
    console.error("Error cleaning up duplicate users:", error)
    // Don't throw error for cleanup failures
    return { message: "Cleanup attempted" }
  }
}

// Get WebSocket URL for debugging
export const getWebSocketUrl = () => {
  const token = getAuthToken()
  return `${WS_CHAT_URL}?token=${token}`
}

// Export all functions for compatibility
export default {
  connectToChat,
  disconnectFromChat,
  sendMessage,
  createChatRoom,
  getUserChatRooms,
  getChatRooms,
  getChatMessages,
  markMessagesAsRead,
  getUnreadMessageCount,
  getAvailableUsers,
  getAvailableUsersFromMain,
  syncUsersToChat,
  checkChatHealth,
  cleanupDuplicateUsers,
  getWebSocketUrl,
}

