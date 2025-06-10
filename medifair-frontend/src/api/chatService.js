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
import { Client } from "@stomp/stompjs"
import { WS_BASE_URL, CHAT_API_BASE_URL } from "./config"
import { API_BASE_URL } from "./config.js"

const chatAPI = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Create axios instance for cart
const userAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth interceptor to chatAPI
chatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const tokenHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

export async function getUserChatRooms() {
  const response = await chatAPI.get("/api/chat/rooms")
  return response.data
}

export async function getUnreadMessageCount(roomId) {
  const response = await chatAPI.get(`/api/chat/rooms/${roomId}/unread-count`)
  return response.data
}

export async function createChatRoom(receiverUsername) {
  const response = await chatAPI.post("/api/chat/rooms/create", { receiverUsername })
  return response.data
}

export async function markMessagesAsRead(roomId) {
  const response = await chatAPI.post(`/api/chat/rooms/${roomId}/read`, {})
  return response.data
}

export async function getChatMessages(roomId) {
  const response = await chatAPI.get(`/api/chat/rooms/${roomId}/messages`)
  return response.data
}

export async function sendMessage(roomId, content, type = "TEXT") {
  const response = await chatAPI.post(`/api/chat/rooms/${roomId}/messages`, { content, type })
  return response.data
}

export async function cleanupDuplicateUsers() {
  const response = await chatAPI.post("/api/chat/cleanup-duplicates", {})
  return response.data
}

export const getAvailableUsersFromMain = async () => {
  try {
    console.log("Getting available users from:", `${CHAT_API_BASE_URL}/api/user/for-chat`)
    const response = await userAPI.get("/user/for-chat")
    return response.data
  } catch (error) {
    console.error("Error fetching available users:", error)
    throw error
  }
}

export function connectToChat(onMessageReceived) {
  const token = localStorage.getItem("token")

  if (!token) {
    console.error("No token found for WebSocket connection")
    return null
  }

  const socket = new SockJS(WS_BASE_URL)
  const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => console.log("STOMP Debug:", str),
    onStompError: (frame) => {
      console.error("STOMP error:", frame)
    },
  })

  stompClient.onConnect = () => {
    console.log("STOMP connected successfully")

    // Subscribe to personal message queue
    stompClient.subscribe("/user/queue/messages", (message) => {
      try {
        const body = JSON.parse(message.body)
        console.log("Received message via STOMP:", body)
        onMessageReceived(body)
      } catch (error) {
        console.error("Error parsing STOMP message:", error)
      }
    })

    // Subscribe to status updates
    stompClient.subscribe("/topic/status", (message) => {
      try {
        const body = JSON.parse(message.body)
        console.log("Received status update:", body)
      } catch (error) {
        console.error("Error parsing status message:", error)
      }
    })
  }

  stompClient.onWebSocketError = (error) => {
    console.error("WebSocket connection error:", error)
  }

  stompClient.onDisconnect = () => {
    console.log("STOMP disconnected")
  }

  stompClient.activate()

  return stompClient
}




// import axios from "axios";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import { API_BASE_URL, WS_BASE_URL, CHAT_API_BASE_URL } from "./config";

// const chatAPI = axios.create({
//   baseURL: CHAT_API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// const tokenHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
// });

// export async function getUserChatRooms() {
//   const response = await axios.get(`${API_BASE_URL}/rooms`, tokenHeader());
//   return response.data;
// }

// export async function getUnreadMessageCount(roomId) {
//   const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}/messages/unread/count`, tokenHeader());
//   return response.data;
// }

// export async function createChatRoom(receiverUsername) {
//   const response = await axios.post(
//     `${API_BASE_URL}/rooms`,
//     { receiverUsername },
//     tokenHeader()
//   );
//   return response.data;
// }

// export async function markMessagesAsRead(roomId) {
//   const response = await axios.post(`${API_BASE_URL}/rooms/${roomId}/messages/read`, {}, tokenHeader());
//   return response.data;
// }

// export async function getChatMessages(roomId) {
//   const response = await axios.get(`${API_BASE_URL}/rooms/${roomId}/messages`, tokenHeader());
//   return response.data;
// }

// export async function sendMessage(roomId, content, type = "TEXT") {
//   const response = await axios.post(
//     `${API_BASE_URL}/rooms/${roomId}/messages`,
//     { content, type },
//     tokenHeader()
//   );
//   return response.data;
// }

// export async function cleanupDuplicateUsers() {
//   const response = await axios.post(`${API_BASE_URL}/cleanup-duplicates`, {}, tokenHeader());
//   return response.data;
// }

// // export const getAvailableUsersFromMain = async () => {
// //   const response = await axios.get(`${API_BASE_URL}/users`, tokenHeader());
// //   return response.data;
// // };

// export const getAvailableUsersFromMain = async () => {
//   try {
//     console.log("Getting available users from:", `${CHAT_API_BASE_URL}/api/chat/users`)
//     const response = await chatAPI.get("/api/chat/users")
//     return response.data
//   } catch (error) {
//     console.error("Error fetching available users:", error)
//     throw error
//   }
// }

// export const getWebSocketUrl = () => {
//   const protocol = window.location.protocol === "http:" ? "wss" : "ws";
//   const host = window.location.host; // host includes port if needed
//   return `${protocol}://${host}/ws/chat`; // fallback (usually used by WebSocket directly)
// };

// export function connectToChat(onMessageReceived) {
//   const token = localStorage.getItem("token");

//   const socket = new SockJS(WS_BASE_URL);
//   const stompClient = new Client({
//     webSocketFactory: () => socket,
//     connectHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//     debug: (str) => console.log(str),
//     onStompError: (frame) => console.error("WebSocket error", frame),
//   });

//   stompClient.onWebSocketError = (error) => {
//     console.error("WebSocket connection error:", error);
//   };

//   stompClient.onConnect = () => {
//     console.log("WebSocket connected");
//     stompClient.subscribe("/user/queue/messages", (message) => {
//       const body = JSON.parse(message.body);
//       onMessageReceived(body);
//     });
//   };

//   stompClient.activate();

//   return stompClient;
// }


