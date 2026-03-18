'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useChat } from '@/contexts/ChatContext'
import ChatInterface from '@/components/chat/ChatInterface'

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { state, loadMoreMessages, dispatch } = useChat()

  useEffect(() => {
    const conversation = state.conversations.find(c => c.id === params.conversationId)
    
    if (conversation) {
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation })
      loadMoreMessages(conversation.id)
    } else {
      router.push('/admin/chat')
    }
  }, [params.conversationId, state.conversations, dispatch, loadMoreMessages, router])

  return (
    <div className="h-full">
      <ChatInterface onToggleSidebar={() => router.push('/admin/chat')} />
    </div>
  )
}