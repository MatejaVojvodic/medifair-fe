// import { createContext, useContext, useState, useEffect, useCallback } from "react"
// import SockJS from "sockjs-client"
// import { Stomp } from "@stomp/stompjs"
// import { useAuth } from "./AuthContext"
// import {
//   getUserChatRooms,
//   getUnreadMessageCount,
//   createChatRoom as apiCreateChatRoom,
//   sendMessage as apiSendMessage,
// } from "../api/chatService"

// const ChatContext = createContext()

// export const useChat = () => {
//   const context = useContext(ChatContext)
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider")
//   }
//   return context
// }

// export const ChatProvider = ({ children }) => {
//   const { isLoggedIn, getToken, username } = useAuth()
//   const [stompClient, setStompClient] = useState(null)
//   const [connected, setConnected] = useState(false)
//   const [chatRooms, setChatRooms] = useState([])
//   const [activeRoom, setActiveRoom] = useState(null)
//   const [messages, setMessages] = useState({})
//   const [unreadCounts, setUnreadCounts] = useState({})
//   const [loading, setLoading] = useState(false)

//   // Connect to WebSocket
//   useEffect(() => {
//     if (!isLoggedIn || !username) return

//     const token = getToken()
//     if (!token) return

//     const socket = new SockJS("http://localhost:8081/ws/chat")
//     const client = Stomp.over(() => socket) // Fix: Provide factory function

//     // Disable debug logging
//     client.debug = () => {}

//     const headers = {
//       Authorization: `Bearer ${token}`,
//     }

//     client.connect(
//       headers,
//       () => {
//         console.log("Connected to chat WebSocket")
//         setConnected(true)
//         setStompClient(client)

//         // Subscribe to personal queue for direct messages
//         client.subscribe(`/user/${username}/queue/messages`, (message) => {
//           const receivedMessage = JSON.parse(message.body)
//           console.log("Received WebSocket message:", receivedMessage)
//           handleNewMessage(receivedMessage)
//         })

//         // Subscribe to user status changes
//         client.subscribe("/topic/status", (message) => {
//           const statusUpdate = JSON.parse(message.body)
//           console.log("User status update:", statusUpdate)
//         })

//         // Notify server that user is online
//         client.send(
//           "/app/chat.addUser",
//           {},
//           JSON.stringify({
//             username: username,
//             status: "ONLINE",
//           }),
//         )
//       },
//       (error) => {
//         console.error("WebSocket connection error:", error)
//         setConnected(false)
//       },
//     )

//     return () => {
//       if (client && client.connected) {
//         // Notify server that user is going offline
//         client.send(
//           "/app/chat.removeUser",
//           {},
//           JSON.stringify({
//             username: username,
//             status: "OFFLINE",
//           }),
//         )
//         client.disconnect()
//         setConnected(false)
//         setStompClient(null)
//       }
//     }
//   }, [isLoggedIn, username, getToken])

//   // Load chat rooms
//   useEffect(() => {
//     if (!isLoggedIn) return

//     const loadChatRooms = async () => {
//       try {
//         setLoading(true)
//         const rooms = await getUserChatRooms()
//         console.log("Loaded chat rooms:", rooms)
//         setChatRooms(rooms)

//         // Get unread counts for each room
//         const counts = {}
//         for (const room of rooms) {
//           try {
//             const count = await getUnreadMessageCount(room.id)
//             counts[room.id] = count
//           } catch (error) {
//             console.error(`Error getting unread count for room ${room.id}:`, error)
//           }
//         }
//         setUnreadCounts(counts)
//       } catch (error) {
//         console.error("Error loading chat rooms:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadChatRooms()
//   }, [isLoggedIn])

//   // Handle new messages
//   const handleNewMessage = useCallback(
//     (message) => {
//       console.log("Handling new message:", message)
//       setMessages((prevMessages) => {
//         const roomMessages = prevMessages[message.chatRoomId] || []
//         // Check if message already exists to avoid duplicates
//         const messageExists = roomMessages.some((msg) => msg.id === message.id)
//         if (messageExists) {
//           return prevMessages
//         }
//         return {
//           ...prevMessages,
//           [message.chatRoomId]: [...roomMessages, message],
//         }
//       })

//       // Update unread counts if the message is not from the current user
//       if (username && message.senderUsername !== username) {
//         setUnreadCounts((prev) => ({
//           ...prev,
//           [message.chatRoomId]: (prev[message.chatRoomId] || 0) + 1,
//         }))
//       }

//       // Update chat room last message
//       setChatRooms((prevRooms) => {
//         return prevRooms.map((room) => {
//           if (room.id === message.chatRoomId) {
//             return {
//               ...room,
//               lastMessage: message.content,
//               lastMessageTime: message.timestamp,
//             }
//           }
//           return room
//         })
//       })
//     },
//     [username],
//   )

//   // Create a new chat room
//   const createChatRoom = useCallback(async (receiverUsername) => {
//     try {
//       setLoading(true)
//       console.log("Creating chat room with:", receiverUsername)
//       const newRoom = await apiCreateChatRoom(receiverUsername)
//       console.log("Chat room created successfully:", newRoom)

//       // Add the new room to the list if it's not already there
//       setChatRooms((prevRooms) => {
//         const exists = prevRooms.find((room) => room.id === newRoom.id)
//         if (exists) {
//           return prevRooms
//         }
//         return [...prevRooms, newRoom]
//       })

//       return newRoom
//     } catch (error) {
//       console.error("Error creating chat room:", error)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Send message via WebSocket
//   const sendMessage = useCallback(
//     (roomId, receiverUsername, content, type = "TEXT") => {
//       console.log("=== Sending Message ===")
//       console.log("Room ID:", roomId)
//       console.log("Receiver:", receiverUsername)
//       console.log("Content:", content)
//       console.log("Connected:", connected)
//       console.log("StompClient:", !!stompClient)

//       if (!stompClient || !connected) {
//         console.error("WebSocket not connected, trying HTTP fallback")
//         // Fallback to HTTP API
//         apiSendMessage(receiverUsername, content, type)
//           .then((savedMessage) => {
//             console.log("Message sent via HTTP:", savedMessage)
//             handleNewMessage(savedMessage)
//           })
//           .catch((error) => {
//             console.error("Error sending message via HTTP:", error)
//           })
//         return
//       }

//       const message = {
//         chatRoomId: roomId,
//         receiverUsername,
//         content,
//         type,
//       }

//       console.log("Sending message via WebSocket:", message)
//       stompClient.send("/app/chat.send", {}, JSON.stringify(message))
//     },
//     [stompClient, connected, handleNewMessage],
//   )

//   // Refresh chat rooms
//   const refreshChatRooms = useCallback(async () => {
//     if (!isLoggedIn) return

//     try {
//       setLoading(true)
//       const rooms = await getUserChatRooms()
//       console.log("Refreshed chat rooms:", rooms)
//       setChatRooms(rooms)

//       // Get unread counts for each room
//       const counts = {}
//       for (const room of rooms) {
//         try {
//           const count = await getUnreadMessageCount(room.id)
//           counts[room.id] = count
//         } catch (error) {
//           console.error(`Error getting unread count for room ${room.id}:`, error)
//         }
//       }
//       setUnreadCounts(counts)
//     } catch (error) {
//       console.error("Error refreshing chat rooms:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [isLoggedIn])

//   // Get total unread message count
//   const getTotalUnreadCount = useCallback(() => {
//     return Object.values(unreadCounts).reduce((total, count) => total + count, 0)
//   }, [unreadCounts])

//   const value = {
//     connected,
//     chatRooms,
//     activeRoom,
//     setActiveRoom,
//     messages,
//     setMessages,
//     unreadCounts,
//     setUnreadCounts,
//     loading,
//     sendMessage,
//     refreshChatRooms,
//     getTotalUnreadCount,
//     createChatRoom,
//   }

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
// }

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useAuth } from "./AuthContext"
import {
  getUserChatRooms,
  getUnreadMessageCount,
  createChatRoom as apiCreateChatRoom,
  sendMessage as apiSendMessage,
} from "../api/chatService.js"
import { getWebSocketUrl } from "../api/chatService.js"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { isLoggedIn, getToken, username } = useAuth()
  const [connected, setConnected] = useState(false)
  const [chatRooms, setChatRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})
  const [loading, setLoading] = useState(false)

  const handleNewMessage = useCallback(
    (message) => {
      console.log("Handling new message:", message)
      setMessages((prevMessages) => {
        const roomMessages = prevMessages[message.chatRoomId] || []
        // Check if message already exists to avoid duplicates
        const messageExists = roomMessages.some((msg) => msg.id === message.id)
        if (messageExists) {
          return prevMessages
        }
        return {
          ...prevMessages,
          [message.chatRoomId]: [...roomMessages, message],
        }
      })

      // Update unread counts if the message is not from the current user
      if (username && message.senderUsername !== username) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.chatRoomId]: (prev[message.chatRoomId] || 0) + 1,
        }))
      }

      // Update chat room last message
      setChatRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === message.chatRoomId) {
            return {
              ...room,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
            }
          }
          return room
        })
      })
    },
    [username],
  )
  useEffect(() => {
  if (!isLoggedIn) return

  const socket = new WebSocket(getWebSocketUrl())

  socket.onopen = () => {
    console.log("WebSocket connected")
    setConnected(true)
  }

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      console.log("Received message via WS:", message)
      handleNewMessage(message)
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
  }

  socket.onclose = () => {
    console.log("WebSocket disconnected")
    setConnected(false)
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  return () => {
    socket.close()
  }
}, [isLoggedIn, handleNewMessage])
  

  // Create a new chat room
  const createChatRoom = useCallback(async (receiverUsername) => {
    try {
      setLoading(true)
      console.log("Creating chat room with:", receiverUsername)
      const newRoom = await apiCreateChatRoom(receiverUsername)
      console.log("Chat room created successfully:", newRoom)

      // Add the new room to the list if it's not already there
      setChatRooms((prevRooms) => {
        const exists = prevRooms.find((room) => room.id === newRoom.id)
        if (exists) {
          return prevRooms
        }
        return [...prevRooms, newRoom]
      })

      return newRoom
    } catch (error) {
      console.error("Error creating chat room:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Send message via HTTP API
  const sendMessage = useCallback(
    (roomId, receiverUsername, content, type = "TEXT") => {
      console.log("=== Sending Message ===")
      console.log("Room ID:", roomId)
      console.log("Receiver:", receiverUsername)
      console.log("Content:", content)

      // Use HTTP API
      apiSendMessage(receiverUsername, content, type)
        .then((savedMessage) => {
          console.log("Message sent via HTTP:", savedMessage)
          handleNewMessage(savedMessage)
        })
        .catch((error) => {
          console.error("Error sending message via HTTP:", error)
        })
    },
    [handleNewMessage],
  )

  // Refresh chat rooms
  const refreshChatRooms = useCallback(async () => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      const rooms = await getUserChatRooms()
      console.log("Refreshed chat rooms:", rooms)
      setChatRooms(rooms)

      // Get unread counts for each room
      const counts = {}
      for (const room of rooms) {
        try {
          const count = await getUnreadMessageCount(room.id)
          counts[room.id] = count
        } catch (error) {
          console.error(`Error getting unread count for room ${room.id}:`, error)
        }
      }
      setUnreadCounts(counts)
    } catch (error) {
      console.error("Error refreshing chat rooms:", error)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  // Get total unread message count
  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0)
  }, [unreadCounts])

  const value = {
    connected,
    chatRooms,
    activeRoom,
    setActiveRoom,
    messages,
    setMessages,
    unreadCounts,
    setUnreadCounts,
    loading,
    sendMessage,
    refreshChatRooms,
    getTotalUnreadCount,
    createChatRoom,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}