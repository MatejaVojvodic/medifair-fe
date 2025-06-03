import axios from "axios"
import SockJS from "sockjs-client"
import { Stomp } from "@stomp/stompjs"
import { getAuthToken } from "./authService"

const API_URL = "http://localhost:8081/api/chat" // Fixed: Changed from 8080 to 8081
const WS_URL = "http://localhost:8081/ws/chat"

let stompClient = null

// Create axios instance with auth header
const chatApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add auth token to every request
chatApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const connectToChat = (token, onMessageReceived, onConnected, onError) => {
  const socket = new SockJS(WS_URL)
  stompClient = Stomp.over(socket)

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  stompClient.connect(
    headers,
    (frame) => {
      console.log("Connected to chat: " + frame)
      if (onConnected) onConnected()

      // Subscribe to private messages
      stompClient.subscribe("/user/queue/messages", (message) => {
        const receivedMessage = JSON.parse(message.body)
        if (onMessageReceived) onMessageReceived(receivedMessage)
      })
    },
    (error) => {
      console.error("Chat connection error: ", error)
      if (onError) onError(error)
    },
  )
}

export const disconnectFromChat = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect()
    console.log("Disconnected from chat")
  }
}

export const sendMessage = async (receiverUsername, content, type = "TEXT") => {
  try {
    const response = await chatApi.post("/send", {
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

export const createChatRoom = async (receiverUsername) => {
  try {
    const response = await chatApi.post("/rooms", { receiverUsername })
    return response.data
  } catch (error) {
    console.error("Error creating chat room:", error)
    throw error
  }
}

export const getUserChatRooms = async () => {
  try {
    const response = await chatApi.get("/rooms")
    return response.data
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    throw error
  }
}

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
    throw error
  }
}

export const getAvailableUsers = async () => {
  try {
    const response = await chatApi.get("/users")
    return response.data
  } catch (error) {
    console.error("Error fetching available users:", error)
    throw error
  }
}

export const checkChatHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`)
    return response.data
  } catch (error) {
    console.error("Chat service health check failed:", error)
    throw error
  }
}