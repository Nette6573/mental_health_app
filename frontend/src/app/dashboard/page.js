'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import { db } from '@/lib/firebase/firebaseClient'
import {
  doc, getDoc, collection, query, where,
  getDocs, orderBy, limit, onSnapshot,
  updateDoc, addDoc, setDoc, serverTimestamp
} from 'firebase/firestore'
import {
  CalendarCheck, MessageSquare, BookOpen,
  TrendingUp, Clock, ChevronRight, Users,
  Activity, Heart, ShieldCheck, AlertCircle,
  XCircle, Clock3, X, Send,
} from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.pending}`}>
      {status || 'pending'}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-primary-500 font-medium mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [profileData, setProfileData]     = useState(null)
  const [bookings, setBookings]           = useState([])       // from providers/{id}/bookings
  const [userBookings, setUserBookings]   = useState([])       // from users/{uid}/bookings (if exists)
  const [allBookings, setAllBookings]     = useState([])       // merged
  const [recentMessages, setRecentMessages] = useState([])
  const [moodEntries, setMoodEntries]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [unreadCount, setUnreadCount]     = useState(0)

  // Booking detail popup
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelLoading, setCancelLoading]     = useState(false)
  const [cancelDone, setCancelDone]           = useState(false)
  const [cancelError, setCancelError]         = useState('')

  const uid = user?.uid ?? user?.id

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login')
  }, [user, isLoading, router])

  // ── Fetch all Firestore data ──
  useEffect(() => {
    if (!uid) return

    const fetchAll = async () => {
      try {
        // 1. User profile
        const userSnap = await getDoc(doc(db, 'users', uid))
        if (userSnap.exists()) setProfileData(userSnap.data())

        // 2. Mood entries from users/{uid}/mood_entries
        try {
          const moodSnap = await getDocs(
            query(collection(db, 'users', uid, 'mood_entries'), orderBy('date', 'desc'), limit(7))
          )
          setMoodEntries(moodSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        } catch (e) {
          // Try without orderBy in case index doesn't exist
          try {
            const moodSnap2 = await getDocs(collection(db, 'users', uid, 'mood_entries'))
            const entries = moodSnap2.docs.map(d => ({ id: d.id, ...d.data() }))
            entries.sort((a, b) => {
              const aTime = a.date || a.createdAt?.seconds || 0
              const bTime = b.date || b.createdAt?.seconds || 0
              return bTime > aTime ? 1 : -1
            })
            setMoodEntries(entries.slice(0, 7))
          } catch (e2) {
            console.log('No mood entries found')
          }
        }

        // 3a. Bookings from providers/{id}/bookings subcollection (where userId == uid)
        let providerBookings = []
        try {
          const provSnap = await getDocs(collection(db, 'providers'))
          for (const provDoc of provSnap.docs) {
            try {
              const bookSnap = await getDocs(
                query(
                  collection(db, 'providers', provDoc.id, 'bookings'),
                  where('userId', '==', uid)
                )
              )
              const pData = provDoc.data()
              const mapped = bookSnap.docs.map(d => ({
                id: d.id,
                _source: 'provider',          // track where this came from
                _providerId: provDoc.id,       // needed for cancellation
                providerName: `${pData.first_name || ''} ${pData.last_name || ''}`.trim() || 'Provider',
                providerTitle: pData.professional_title || '',
                providerPhoto: pData.profile_photo_url || '',
                providerId: provDoc.id,
                ...d.data(),
              }))
              providerBookings = [...providerBookings, ...mapped]
            } catch (e) {
              // skip providers with permission issues
            }
          }
        } catch (e) {
          console.log('Provider bookings fetch error:', e)
        }

        // 3b. Bookings from users/{uid}/bookings subcollection (alternative location)
        let userSubBookings = []
        try {
          const userBookSnap = await getDocs(collection(db, 'users', uid, 'bookings'))
          userSubBookings = userBookSnap.docs.map(d => ({
            id: d.id,
            _source: 'user',
            ...d.data(),
          }))
        } catch (e) {
          // subcollection may not exist
        }

        // Merge and deduplicate by id, sort newest first
        const merged = [...providerBookings, ...userSubBookings]
        const seen = new Set()
        const deduped = merged.filter(b => {
          if (seen.has(b.id)) return false
          seen.add(b.id)
          return true
        })
        deduped.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setAllBookings(deduped)

      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [uid])

  // ── Messages real-time ──
  useEffect(() => {
    if (!uid) return
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', uid))
    const unsub = onSnapshot(q, (snap) => {
      const chats = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => !c.isSupport)
        .sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0))
      setRecentMessages(chats.slice(0, 3))
      setUnreadCount(chats.filter(c => c.lastMessage?.length > 0).length)
    })
    return () => unsub()
  }, [uid])

  // ── Cancel booking ──
  const handleCancelBooking = async () => {
    if (!selectedBooking || !uid) return
    setCancelLoading(true)
    setCancelError('')

    const userName = profileData
      ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || user?.email
      : user?.email || 'A user'

    try {
      // 1. Update the booking status to cancelled in Firestore
      const providerId = selectedBooking._providerId || selectedBooking.providerId
      if (providerId && selectedBooking._source === 'provider') {
        await updateDoc(
          doc(db, 'providers', providerId, 'bookings', selectedBooking.id),
          { status: 'cancelled' }
        )
      }
      // Also update in user subcollection if it exists there
      if (selectedBooking._source === 'user') {
        await updateDoc(
          doc(db, 'users', uid, 'bookings', selectedBooking.id),
          { status: 'cancelled' }
        )
      }

      // 2. Send a message to the provider via the chats collection
      if (providerId) {
        // Find or create chat between user and provider
        let chatId = null
        try {
          const existingQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', uid)
          )
          const existingSnap = await getDocs(existingQuery)
          existingSnap.forEach(chatDoc => {
            const data = chatDoc.data()
            if (data.participants?.includes(providerId)) {
              chatId = chatDoc.id
            }
          })
        } catch (e) {}

        if (!chatId) {
          const providerSnap = await getDoc(doc(db, 'providers', providerId))
          const pData = providerSnap.exists() ? providerSnap.data() : {}
          const chatRef = await addDoc(collection(db, 'chats'), {
            participants: [uid, providerId],
            participantNames: {
              [uid]: userName,
              [providerId]: `${pData.first_name || ''} ${pData.last_name || ''}`.trim() || 'Provider',
            },
            createdAt: serverTimestamp(),
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
          })
          chatId = chatRef.id
        }

        // Send cancellation message
        const cancelMsg = `Hi, this is ${userName}. I am writing to let you know that my appointment scheduled for ${selectedBooking.date || 'our scheduled date'}${selectedBooking.time ? ` at ${selectedBooking.time}` : ''} has been cancelled. I apologise for any inconvenience caused.`

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: cancelMsg,
          senderId: uid,
          senderName: userName,
          createdAt: serverTimestamp(),
        })
        await setDoc(doc(db, 'chats', chatId), {
          lastMessage: cancelMsg,
          lastMessageAt: serverTimestamp(),
        }, { merge: true })
      }

      // 3. Update local state immediately
      setAllBookings(prev =>
        prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b)
      )
      setSelectedBooking(prev => ({ ...prev, status: 'cancelled' }))
      setCancelDone(true)

    } catch (err) {
      console.error('Cancel error:', err)
      setCancelError('Failed to cancel booking. Please try again.')
    } finally {
      setCancelLoading(false)
    }
  }

  const closePopup = () => {
    setSelectedBooking(null)
    setCancelDone(false)
    setCancelError('')
  }

  const firstName = profileData?.firstName || user?.firstName || 'there'
  const upcomingCount = allBookings.filter(b => b.status !== 'cancelled').length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const getOtherName = (chat) => {
    if (!chat.participantNames || !uid) return 'User'
    const otherUid = chat.participants?.find(p => p !== uid)
    return chat.participantNames?.[otherUid] || 'User'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }
  if (!user) return null

  return (
    <DashboardLayout user={profileData || user}>
      <div className="space-y-6 pb-8">

        {/* ── WELCOME BANNER ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-cyan-500 p-6 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-12 -translate-x-8" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">{greeting},</p>
            <h1 className="text-2xl font-bold mt-0.5">{firstName} 👋</h1>
            <p className="text-white/70 text-sm mt-2">
              {upcomingCount > 0
                ? `You have ${upcomingCount} appointment${upcomingCount !== 1 ? 's' : ''}.`
                : "You're all caught up. Ready to book a session?"}
            </p>
            {upcomingCount === 0 && (
              <Link href="/dashboard/therapists">
                <button className="mt-4 px-5 py-2 bg-white text-primary-600 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">
                  Find a Therapist
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarCheck} label="Total Bookings"   value={loading ? '—' : allBookings.length}       color="bg-primary-100 text-primary-600 dark:bg-primary-900/30"  sub={upcomingCount > 0 ? `${upcomingCount} active` : undefined} />
          <StatCard icon={MessageSquare}  label="Conversations"    value={loading ? '—' : recentMessages.length}    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30"     sub={unreadCount > 0 ? `${unreadCount} active` : undefined} />
          <StatCard icon={Activity}       label="Mood Logs"        value={loading ? '—' : moodEntries.length}       color="bg-amber-100 text-amber-600 dark:bg-amber-900/30"        sub={moodEntries[0] ? `Latest: ${moodEntries[0].mood || moodEntries[0].rating || '—'}` : undefined} />
          <StatCard icon={Users}          label="Providers"        value={loading ? '—' : [...new Set(allBookings.filter(b => b.providerId).map(b => b.providerId))].length} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" sub="Booked with" />
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            {/* ── APPOINTMENTS ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">My Appointments</h3>
                <Link href="/dashboard/therapists" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Book New <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-2" />
                  Loading appointments...
                </div>
              ) : allBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No appointments yet</p>
                  <p className="text-gray-400 text-xs mt-1">Book a session with a therapist to get started</p>
                  <Link href="/dashboard/therapists">
                    <button className="mt-4 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                      Find a Therapist
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {allBookings.map(b => (
                    <div
                      key={b.id}
                      onClick={() => { setSelectedBooking(b); setCancelDone(false); setCancelError('') }}
                      className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    >
                      {b.providerPhoto ? (
                        <img src={b.providerPhoto} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                          {(b.providerName?.[0] || 'P').toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{b.providerName || 'Provider'}</p>
                            {b.providerTitle && <p className="text-xs text-primary-600 dark:text-primary-400">{b.providerTitle}</p>}
                          </div>
                          <StatusBadge status={b.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                          {b.date && <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" />{typeof b.date === 'string' ? b.date.split(',').slice(0, 2).join(',') : b.date}</span>}
                          {b.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>}
                        </div>
                        {b.notes && <p className="text-xs text-gray-400 mt-1 truncate italic">{b.notes}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── MESSAGES ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Recent Messages</h3>
                <Link href="/dashboard/messages" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {recentMessages.map(chat => {
                    const otherName = getOtherName(chat)
                    return (
                      <Link key={chat.id} href="/dashboard/messages"
                        className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors block">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                          {(otherName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{otherName}</p>
                          {chat.lastMessage && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{chat.lastMessage}</p>}
                        </div>
                        {chat.lastMessageAt && (
                          <span className="text-xs text-gray-400 shrink-0">
                            {chat.lastMessageAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/therapists', icon: Users,         label: 'Find a Therapist', color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                  { href: '/dashboard/mood',        icon: Heart,         label: 'Log Your Mood',    color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
                  { href: '/dashboard/resources',   icon: BookOpen,      label: 'Browse Resources', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  { href: '/dashboard/messages',    icon: MessageSquare, label: 'Messages',         color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl ${item.bg} hover:opacity-80 transition-opacity`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mood Snapshot */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Mood Snapshot</h3>
                <Link href="/dashboard/mood" className="text-xs text-primary-600 hover:underline">Log mood</Link>
              </div>
              {moodEntries.length === 0 ? (
                <div className="text-center py-4">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No mood entries yet</p>
                  <Link href="/dashboard/mood">
                    <button className="mt-2 text-xs text-primary-500 hover:underline">Log your first mood</button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {moodEntries.slice(0, 5).map((entry, i) => {
                    const mood = entry.mood || entry.rating || entry.score || entry.value
                    const moodNum = typeof mood === 'number' ? mood : null
                    const dateLabel = entry.date
                      ? (typeof entry.date === 'string'
                          ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : entry.date?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || `Entry ${i + 1}`)
                      : `Entry ${i + 1}`
                    return (
                      <div key={entry.id || i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 text-xs w-16 shrink-0">{dateLabel}</span>
                        <div className="flex items-center gap-2 flex-1 ml-2">
                          {moodNum !== null ? (
                            <>
                              <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.min((moodNum / 10) * 100, 100)}%` }} />
                              </div>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-5 text-right">{moodNum}</span>
                            </>
                          ) : (
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{String(mood)}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Emergency */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚨</span>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300 text-sm">Need Immediate Help?</p>
                  <p className="text-red-700 dark:text-red-400 text-xs mt-1 mb-3">If you're experiencing a mental health crisis, don't wait.</p>
                  <a href="tel:+18765554321" className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-medium transition-colors">
                    Call Crisis Line
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOOKING DETAIL POPUP ── */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePopup}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>

              {/* Close */}
              <button onClick={closePopup} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X className="w-4 h-4" />
              </button>

              {/* Provider info */}
              <div className="flex items-center gap-4 mb-6">
                {selectedBooking.providerPhoto ? (
                  <img src={selectedBooking.providerPhoto} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xl shrink-0">
                    {(selectedBooking.providerName?.[0] || 'P').toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedBooking.providerName || 'Provider'}</h3>
                  {selectedBooking.providerTitle && <p className="text-sm text-primary-600 dark:text-primary-400">{selectedBooking.providerTitle}</p>}
                  <StatusBadge status={selectedBooking.status} />
                </div>
              </div>

              {/* Booking details */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {selectedBooking.date && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{typeof selectedBooking.date === 'string' ? selectedBooking.date.split(',').slice(0,2).join(',') : selectedBooking.date}</p>
                  </div>
                )}
                {selectedBooking.time && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.time}</p>
                  </div>
                )}
                {selectedBooking.status && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedBooking.status}</p>
                  </div>
                )}
                {selectedBooking.providerTitle && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBooking.providerTitle}</p>
                  </div>
                )}
              </div>

              {selectedBooking.notes && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Success state */}
              {cancelDone && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">
                  ✓ Appointment cancelled and a message was sent to {selectedBooking.providerName}.
                </div>
              )}

              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm">
                  {cancelError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={closePopup}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Close
                </button>
                {selectedBooking.status !== 'cancelled' && !cancelDone && (
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelLoading}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {cancelLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
