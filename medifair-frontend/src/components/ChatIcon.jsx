import { Link } from "react-router-dom"
import { useChat } from "../context/ChatContext"

const ChatIcon = () => {
  const { getTotalUnreadCount, connected } = useChat()
  const unreadCount = getTotalUnreadCount()

  return (
    <Link to="/chat" className="navbar-item chat-icon-link">
      <div className="chat-icon-container">
        <span className="nav-icon">💬</span>
        <span>Chat</span>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        {!connected && <span className="connection-indicator offline">●</span>}
        {connected && <span className="connection-indicator online">●</span>}
      </div>
    </Link>
  )
}

export default ChatIcon
