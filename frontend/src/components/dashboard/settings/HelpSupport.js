'use client'

import { useState, useEffect, useRef } from 'react'
import { db, auth } from '@/lib/firebase/firebaseClient'
import {
  collection, addDoc, query, where, getDocs,
  onSnapshot, orderBy, serverTimestamp, setDoc, doc, getDoc
} from 'firebase/firestore'
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function HelpSupport({ user }) {
  const router = useRouter()
  const [supportChatOpen, setSupportChatOpen] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [memberSince, setMemberSince] = useState('—')
  const messagesEndRef = useRef(null)

  // Password reset
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const uid = user?.uid ?? user?.id
  const email = user?.email || auth.currentUser?.email

  // ── Load member since from Firestore ──
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          const data = snap.data()
          if (data.joinDate) {
            setMemberSince(new Date(data.joinDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
          } else if (data.createdAt) {
            const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
            setMemberSince(d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
          }
        }
      } catch (err) { console.error(err) }
    }
    load()
  }, [uid])

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Open support chat — find or create on first message ──
  const openSupportChat = async () => {
    setSupportChatOpen(true)
    if (!uid) return

    try {
      const q = query(collection(db, 'chats'), where('participants', 'array-contains', uid), where('isSupport', '==', true))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setChatId(snap.docs[0].id)
      }
      // If no existing support chat, chatId stays null until first message
    } catch (err) { console.error(err) }
  }

  // ── Subscribe to messages ──
  useEffect(() => {
    if (!chatId) return
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [chatId])

  const sendMessage = async () => {
    const trimmed = messageInput.trim()
    if (!trimmed || !uid) return
    setSendingMessage(true)

    try {
      let activeChatId = chatId
      if (!activeChatId) {
        // Create support chat on first message
        const chatRef = await addDoc(collection(db, 'chats'), {
          participants: [uid],
          participantNames: { [uid]: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || email || 'User' },
          isSupport: true,
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        })
        activeChatId = chatRef.id
        setChatId(activeChatId)
      }

      await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
        text: trimmed,
        senderId: uid,
        senderName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || email || 'User',
        createdAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'chats', activeChatId), { lastMessage: trimmed, lastMessageAt: serverTimestamp() }, { merge: true })
      setMessageInput('')
    } catch (err) {
      console.error('Send error:', err)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) return
    setResetLoading(true)
    setResetError('')
    setResetSent(false)
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
    } catch (err) {
      setResetError('Failed to send reset email. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== 'delete') { setDeleteError('Please type "delete" to confirm.'); return }
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const { deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'users', uid))
      const currentUser = auth.currentUser
      if (currentUser) await deleteUser(currentUser)
      router.replace('/')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setDeleteError('For security, please log out, log back in, then try again.')
      } else {
        setDeleteError(err.message || 'Failed to delete account.')
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const FAQ = [
    {
      q: 'How do I reset my password?',
      a: 'Go to Account Security in Settings and click "Send Reset Link". A password reset email will be sent to your registered email address. You can also click the button below.',
    },
    {
      q: 'How do I delete my account?',
      a: 'Go to Privacy Settings and click "Delete Account", or use the button below. You will need to type "delete" to confirm. This action is permanent and cannot be undone.',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get help with your account
          {email && <span className="text-gray-500"> — support responses sent to {email}</span>}
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">

        {/* Account Status */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Member since</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{memberSince}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plan</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Free</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">Active</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <details key={i} className="group border border-gray-100 dark:border-gray-700 rounded-lg">
                <summary className="flex justify-between items-center font-medium text-gray-900 dark:text-white cursor-pointer list-none p-4">
                  <span className="text-sm">{faq.q}</span>
                  <svg className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="text-sm text-gray-600 dark:text-gray-400 px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
          <div className="space-y-3">

            {/* Reset Password */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Reset Password</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Send a reset link to {email}</p>
                {resetSent && <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Reset email sent! Check your inbox.</p>}
                {resetError && <p className="text-xs text-red-500 mt-1">{resetError}</p>}
              </div>
              <button onClick={handleResetPassword} disabled={resetLoading || resetSent}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white text-sm rounded-lg font-medium transition-colors disabled:cursor-not-allowed whitespace-nowrap ml-4">
                {resetLoading ? 'Sending...' : resetSent ? 'Sent ✓' : 'Send Link'}
              </button>
            </div>

            {/* Contact Support */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Contact Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Chat with the HopePath support team</p>
              </div>
              <button onClick={openSupportChat}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap ml-4">
                Open Chat
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div>
                <p className="font-medium text-red-700 dark:text-red-400 text-sm">Delete Account</p>
                <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <button onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap ml-4">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUPPORT CHAT DRAWER ── */}
      {supportChatOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSupportChatOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl flex flex-col" style={{ animation: 'slideIn 0.25s ease' }}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">HopePath Support</p>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Online
                </p>
              </div>
              <button onClick={() => setSupportChatOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Send a message to reach our support team</p>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.senderId === uid
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'}`}>
                      {!isMe && <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">HopePath Support</p>}
                      {msg.text}
                      <div className={`text-xs mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-400"
                />
                <button onClick={sendMessage} disabled={!messageInput.trim() || sendingMessage}
                  className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              This will permanently delete your account and all your data. This cannot be undone. Type <strong>"delete"</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={e => { setConfirmText(e.target.value); setDeleteError('') }}
              placeholder='Type "delete" to confirm'
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white mb-4 text-sm"
            />
            {deleteError && <p className="text-sm text-red-500 mb-4">{deleteError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setConfirmText(''); setDeleteError('') }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || confirmText.toLowerCase() !== 'delete'}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed text-sm">
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
