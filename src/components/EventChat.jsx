import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { chatService } from '../services/chatService'

/**
 * EventChat Component
 * Real-time chat for events with has_chat enabled
 */
export default function EventChat({ eventId, isOpen, onClose }) {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Fetch initial messages and subscribe to new ones
  useEffect(() => {
    if (!isOpen || !eventId) return

    let subscription = null

    const initChat = async () => {
      try {
        setLoading(true)
        const initialMessages = await chatService.getMessages(eventId)
        setMessages(initialMessages)
        
        // Subscribe to new messages
        subscription = chatService.subscribeToMessages(eventId, (newMsg) => {
          // Only add if not already in the list (avoid duplicates from own messages)
          setMessages(prev => {
            const exists = prev.some(m => m.id === newMsg.id)
            if (exists) return prev
            return [...prev, newMsg]
          })
        })
      } catch (err) {
        setError('Failed to load chat')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initChat()

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        chatService.unsubscribe(subscription)
      }
    }
  }, [isOpen, eventId])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !profile) return

    const messageText = newMessage.trim()
    setNewMessage('') // Clear input immediately for better UX
    setSending(true)
    setError('')

    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      event_id: eventId,
      user_id: user.id,
      user_name: profile.full_name,
      message: messageText,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticMessage])

    try {
      const sentMessage = await chatService.sendMessage({
        event_id: eventId,
        user_id: user.id,
        user_name: profile.full_name,
        message: messageText,
      })
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === optimisticMessage.id ? sentMessage : msg)
      )
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
      setNewMessage(messageText) // Restore the message
      setError('Failed to send message')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '500px',
          height: '80vh',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-gray-700)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 className="h3" style={{ margin: 0 }}>Event Chat 💬</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-400)',
              cursor: 'pointer',
              padding: '8px',
              fontSize: '20px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="spinner"></div>
              <p className="text-secondary" style={{ marginTop: '12px' }}>Loading chat...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 0',
              color: 'var(--color-gray-400)',
            }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>💬</p>
              <p>No messages yet</p>
              <p className="text-sm">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.user_id === user?.id
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  {/* Sender name (only for others' messages) */}
                  {!isOwnMessage && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--color-gray-400)',
                      marginBottom: '4px',
                      marginLeft: '12px',
                    }}>
                      {msg.user_name}
                    </span>
                  )}
                  
                  {/* Message bubble */}
                  <div style={{
                    background: isOwnMessage 
                      ? 'var(--color-crimson-primary)' 
                      : 'var(--color-bg-elevated)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: isOwnMessage 
                      ? '18px 18px 4px 18px' 
                      : '18px 18px 18px 4px',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                  }}>
                    {msg.message}
                  </div>
                  
                  {/* Timestamp */}
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--color-gray-500)',
                    marginTop: '4px',
                    marginLeft: isOwnMessage ? '0' : '12px',
                    marginRight: isOwnMessage ? '12px' : '0',
                  }}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(232, 74, 95, 0.1)',
            color: 'var(--color-error)',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Input Area */}
        <form 
          onSubmit={handleSendMessage}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-gray-700)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input"
            style={{ flex: 1 }}
            maxLength={500}
            disabled={sending || !user}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newMessage.trim() || sending || !user}
            style={{ padding: '0 20px' }}
          >
            {sending ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}
