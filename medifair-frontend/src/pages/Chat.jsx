import { useState, useEffect } from "react"
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import { getAvailableUsers } from "../api/chatService"
import ChatWindow from "../components/ChatWindow"
import "../assets/styles/chat.css"

const Chat = () => {
  const { isLoggedIn, username } = useAuth()
  const { chatRooms, activeRoom, setActiveRoom, unreadCounts, refreshChatRooms, loading, createChatRoom } = useChat()

  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [creatingChat, setCreatingChat] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Set the first chat room as active if none is selected
    if (chatRooms.length > 0 && !activeRoom) {
      setActiveRoom(chatRooms[0])
    }
  }, [chatRooms, activeRoom, setActiveRoom])

  const handleNewChat = async () => {
    setShowNewChatModal(true)
    setLoadingUsers(true)
    setError("")

    try {
      console.log("Loading available users...")
      const users = await getAvailableUsers()
      console.log("Loaded users:", users)

      // Filter out current user
      const filteredUsers = users.filter((u) => u.username !== username)
      console.log("Filtered users:", filteredUsers)

      setAvailableUsers(filteredUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSelectUser = async (selectedUser) => {
    setCreatingChat(true)
    setError("")

    try {
      console.log("Selecting user:", selectedUser)

      // Check if a chat room already exists with this user
      const existingRoom = chatRooms.find((room) => room.participantUsernames.includes(selectedUser.username))

      if (existingRoom) {
        console.log("Found existing room:", existingRoom)
        setActiveRoom(existingRoom)
      } else {
        console.log("Creating new chat room with:", selectedUser.username)
        // Create a new chat room
        const newRoom = await createChatRoom(selectedUser.username)
        console.log("New room created:", newRoom)

        if (newRoom) {
          setActiveRoom(newRoom)
          // Refresh chat rooms to get the updated list
          await refreshChatRooms()
        }
      }

      setShowNewChatModal(false)
      setSearchTerm("")
    } catch (error) {
      console.error("Error creating/selecting chat:", error)
      setError("Failed to create chat. Please try again.")
    } finally {
      setCreatingChat(false)
    }
  }

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatLastMessage = (message) => {
    if (!message) return "No messages yet"
    return message.length > 30 ? message.substring(0, 30) + "..." : message
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="error-message">Please log in to access chat.</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Chat</h1>
        <p className="page-subtitle">Connect with other users</p>
      </div>

      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Conversations</h2>
            <button className="new-chat-button" onClick={handleNewChat}>
              + New Chat
            </button>
          </div>

          <div className="chat-rooms-list">
            {loading ? (
              <div className="loading">Loading chats...</div>
            ) : chatRooms.length === 0 ? (
              <div className="no-messages">
                <p>No conversations yet</p>
                <button className="btn btn-primary mt-3" onClick={handleNewChat}>
                  Start your first chat
                </button>
              </div>
            ) : (
              chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`chat-room-item ${activeRoom && activeRoom.id === room.id ? "active" : ""}`}
                  onClick={() => setActiveRoom(room)}
                >
                  <div className="chat-room-avatar">{room.roomName.charAt(0).toUpperCase()}</div>
                  <div className="chat-room-info">
                    <div className="chat-room-name">{room.roomName}</div>
                    <div className="chat-room-last-message">{formatLastMessage(room.lastMessage)}</div>
                  </div>
                  <div className="chat-room-time">{formatTime(room.lastMessageTime)}</div>
                  {unreadCounts[room.id] > 0 && <span className="unread-count">{unreadCounts[room.id]}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main">
          <ChatWindow chatRoom={activeRoom} />
        </div>
      </div>

      {showNewChatModal && (
        <div className="new-chat-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Start New Conversation</h3>
              <button className="close-button" onClick={() => setShowNewChatModal(false)}>
                ×
              </button>
            </div>

            {error && (
              <div className="error-message" style={{ margin: "1rem" }}>
                {error}
              </div>
            )}

            <input
              type="text"
              className="user-search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="users-list">
              {loadingUsers ? (
                <div className="loading">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="no-messages">
                  {availableUsers.length === 0 ? "No other users found" : "No users match your search"}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="user-item"
                    onClick={() => !creatingChat && handleSelectUser(user)}
                    style={{
                      opacity: creatingChat ? 0.6 : 1,
                      cursor: creatingChat ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-role">{user.roles && user.roles.includes("ADMIN") ? "Admin" : "User"}</div>
                    </div>
                    {creatingChat && <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Creating...</div>}
                  </div>
                ))
              )}
            </div>

            {creatingChat && (
              <div className="loading" style={{ padding: "1rem" }}>
                Creating chat room...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat