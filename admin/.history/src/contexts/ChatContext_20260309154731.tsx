'use client'

import { createContext, useContext, useReducer, useCallback } from 'react'
import { Conversation, Message, ChatState } from '@/types/chat'
import { MOCK_CONVERSATIONS } from '@/constants/chat'

type ChatAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: Conversation | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ONLINE_USERS'; payload: string[] }
  | { type: 'SET_TYPING_USERS'; payload: Record<string, string[]> }
  | { type: 'MARK_CONVERSATION_READ'; payload: string }

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  onlineUsers: [],
  typingUsers: {},
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  sendMessage: (content: string, type?: Message['type'], attachments?: any[]) => Promise<void>
  markAsRead: (conversationId: string) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
  loadMoreMessages: (conversationId: string) => Promise<void>
} | null>(null)

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload }
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload, messages: [] }
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload }
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload }
    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload ? { ...conv, unreadCount: 0 } : conv
        ),
      }
    default:
      return state
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    conversations: MOCK_CONVERSATIONS,
    onlineUsers: ['th1', 'user1'],
  })

  const sendMessage = useCallback(async (
    content: string,
    type: Message['type'] = 'text',
    attachments: any[] = []
  ) => {
    if (!state.currentConversation) return

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: state.currentConversation.id,
      senderId: 'admin1',
      content,
      type,
      status: 'sent',
      timestamp: new Date().toISOString(),
      attachments,
    }

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage })

    dispatch({
      type: 'SET_CONVERSATIONS',
      payload: state.conversations.map(conv =>
        conv.id === state.currentConversation!.id
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv
      ),
    })
  }, [state.currentConversation, state.conversations])

  const markAsRead = useCallback((conversationId: string) => {
    dispatch({ type: 'MARK_CONVERSATION_READ', payload: conversationId })
  }, [])

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    // Implement typing indicator logic
  }, [])

  const loadMoreMessages = useCallback(async (conversationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    // Mock messages - replace with API call
    const mockMessages: Message[] = [
      {
        id: '1',
        conversationId,
        senderId: 'th1',
        content: 'Hello, how can I help?',
        type: 'text',
        status: 'read',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        conversationId,
        senderId: 'admin1',
        content: 'Hi, I need some assistance',
        type: 'text',
        status: 'read',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
    ]
    dispatch({ type: 'SET_MESSAGES', payload: mockMessages })
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  return (
    <ChatContext.Provider value={{
      state,
      dispatch,
      sendMessage,
      markAsRead,
      setTyping,
      loadMoreMessages,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}