export interface ChatUser {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'therapist' | 'user'
  online?: boolean
  lastSeen?: string
  email?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file' | 'emoji' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  edited?: boolean
  editedAt?: string
  deleted?: boolean
  replyTo?: {
    id: string
    content: string
    senderId: string
  }
  attachments?: Attachment[]
  reactions?: Reaction[]
  metadata?: Record<string, any>
}

export interface Attachment {
  id: string
  type: 'image' | 'document' | 'audio' | 'video'
  url: string
  name: string
  size: number
  mimeType: string
  thumbnailUrl?: string
  duration?: number
}

export interface Reaction {
  userId: string
  emoji: string
  timestamp: string
}

export interface Conversation {
  id: string
  participants: ChatUser[]
  type: 'direct' | 'group' | 'support'
  name?: string
  avatar?: string
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  pinned?: boolean
  muted?: boolean
  archived?: boolean
  labels?: string[]
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  tags?: string[]
  metadata?: {
    caseId?: string
    appointmentId?: string
    sessionId?: string
  }
}