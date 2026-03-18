import { ChatUser, Conversation, QuickReply } from '@/types/chat'

export const MOCK_CHAT_USERS = {
  currentAdmin: {
    id: 'admin1',
    name: 'Admin User',
    role: 'admin' as const,
    online: true,
  },
  therapists: [
    {
      id: 'th1',
      name: 'Dr. Sarah Johnson',
      role: 'therapist' as const,
      online: true,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'th2',
      name: 'Dr. Michael Brown',
      role: 'therapist' as const,
      online: false,
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  users: [
    {
      id: 'user1',
      name: 'John Doe',
      role: 'user' as const,
      online: true,
    },
    {
      id: 'user2',
      name: 'Jane Smith',
      role: 'user' as const,
      online: false,
      lastSeen: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    participants: [MOCK_CHAT_USERS.currentAdmin, MOCK_CHAT_USERS.therapists[0]],
    type: 'direct',
    lastMessage: {
      id: 'msg1',
      conversationId: 'conv1',
      senderId: 'th1',
      content: "Hi Admin, I have a question about the new client intake form",
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
    priority: 'medium',
  },
]

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr1',
    title: 'Welcome',
    content: "Welcome to HopePath! How can I assist you today?",
    shortcut: '/welcome',
    category: 'greeting',
  },
  {
    id: 'qr2',
    title: 'Technical Support',
    content: "I understand you're having technical issues. Let me help you troubleshoot.",
    shortcut: '/tech',
    category: 'support',
  },
]

export const CHAT_SETTINGS = {
  typingTimeout: 3000,
  messageMaxLength: 5000,
  fileMaxSize: 10 * 1024 * 1024,
  allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
  typingIndicatorDelay: 500,
}