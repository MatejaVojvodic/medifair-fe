import { useState, useEffect, useRef } from "react"
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import { getChatMessages, markMessagesAsRead } from "../api/chatService"

const ChatWindow = ({ chatRoom }) => {
  const { username } = useAuth()
  const { messages, setMessages, sendMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messageContainerRef = useRef(null)

  // Load messages when chat room changes
  useEffect(() => {
    if (!chatRoom) return

    const loadMessages = async () => {
      try {
        setLoading(true)
        const response = await getChatMessages(chatRoom.id)
        setMessages((prev) => ({
          ...prev,
          [chatRoom.id]: response.content.reverse(),
        }))

        // Mark messages as read
        await markMessagesAsRead(chatRoom.id)
      } catch (error) {
        console.error("Error loading messages:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [chatRoom, setMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, chatRoom])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatRoom) return

    // Find the receiver username (the other participant)
    const receiverUsername = chatRoom.participantUsernames.find((name) => name !== username)

    if (!receiverUsername) {
      console.error("Could not find receiver username")
      return
    }

    sendMessage(chatRoom.id, receiverUsername, newMessage)
    setNewMessage("")
  }

  if (!chatRoom) {
    return (
      <div className="chat-window-container">
        <div className="no-chat-selected">
          <div className="no-chat-content">
            <h3>Welcome to Chat!</h3>
            <p>Select a conversation from the sidebar or start a new chat to begin messaging.</p>
          </div>
        </div>
      </div>
    )
  }

  const roomMessages = messages[chatRoom.id] || []

  return (
    <div className="chat-window-container">
      <div className="chat-header">
        <h3>{chatRoom.roomName}</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>
          {chatRoom.participantUsernames.length} participants
        </p>
      </div>

      <div className="chat-messages" ref={messageContainerRef}>
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : roomMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          roomMessages.map((msg) => (
            <div key={msg.id} className={`message ${msg.senderUsername === username ? "sent" : "received"}`}>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={loading}
        />
        <button type="submit" className="send-button" disabled={!newMessage.trim() || loading}>
          ➤
        </button>
      </form>
    </div>
  )
}

export default ChatWindow