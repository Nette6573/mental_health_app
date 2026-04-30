'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import { db } from '@/lib/firebase/firebaseClient'
import {
  doc, getDoc, collection, query, where,
  getDocs, orderBy, limit, onSnapshot
} from 'firebase/firestore'
import {
  CalendarCheck, MessageSquare, BookOpen,
  TrendingUp, Clock, ChevronRight, Users,
  Activity, Heart, ShieldCheck, AlertCircle,
  XCircle, Clock3, CheckCircle,
} from 'lucide-react'

// ── Verification badge (same as therapist directory) ──────────────────────────
function VerificationBadge({ status }) {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <ShieldCheck className="h-3 w-3" />Verified
        </span>
      )
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />Do Not Book
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          <Clock3 className="h-3 w-3" />Pending Review
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          <AlertCircle className="h-3 w-3" />Unverified
        </span>
      )
  }
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.pending}`}>
      {status || 'pending'}
    </span>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [profileData, setProfileData] = useState(null)
  const [bookings, setBookings] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [moodEntries, setMoodEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const uid = user?.uid ?? user?.id

  // ── Auth guard ──
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

        // 2. Bookings — search across all providers
        const provSnap = await getDocs(collection(db, 'providers'))
        let allBookings = []
        for (const provDoc of provSnap.docs) {
          const bookSnap = await getDocs(
            query(
              collection(db, 'providers', provDoc.id, 'bookings'),
              where('userId', '==', uid),
              orderBy('createdAt', 'desc'),
              limit(10)
            )
          )
          const provBookings = bookSnap.docs.map(d => ({
            id: d.id,
            providerName: `${provDoc.data().first_name || ''} ${provDoc.data().last_name || ''}`.trim(),
            providerTitle: provDoc.data().professional_title || '',
            providerPhoto: provDoc.data().profile_photo_url || '',
            ...d.data(),
          }))
          allBookings = [...allBookings, ...provBookings]
        }
        allBookings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setBookings(allBookings.slice(0, 5))

        // 3. Mood entries
        const moodSnap = await getDocs(
          query(collection(db, 'users', uid, 'mood_entries'), orderBy('date', 'desc'), limit(7))
        )
        setMoodEntries(moodSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [uid])

  // ── Messages — real-time ──
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

  const firstName = profileData?.firstName || user?.firstName || 'there'
  const totalBookings = bookings.length
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const latestMood = moodEntries[0]

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
              {upcomingBookings.length > 0
                ? `You have ${upcomingBookings.length} upcoming appointment${upcomingBookings.length !== 1 ? 's' : ''}.`
                : "You're all caught up. Ready to book a session?"}
            </p>
            {upcomingBookings.length === 0 && (
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
          <StatCard
            icon={CalendarCheck}
            label="Total Bookings"
            value={loading ? '—' : totalBookings}
            color="bg-primary-100 text-primary-600 dark:bg-primary-900/30"
            sub={upcomingBookings.length > 0 ? `${upcomingBookings.length} upcoming` : undefined}
          />
          <StatCard
            icon={MessageSquare}
            label="Conversations"
            value={loading ? '—' : recentMessages.length}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
            sub={unreadCount > 0 ? `${unreadCount} active` : undefined}
          />
          <StatCard
            icon={Activity}
            label="Mood Logs"
            value={loading ? '—' : moodEntries.length}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/30"
            sub={latestMood ? `Last: ${latestMood.mood || latestMood.rating || '—'}` : undefined}
          />
          <StatCard
            icon={Users}
            label="Providers"
            value={loading ? '—' : [...new Set(bookings.map(b => b.providerId))].length}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
            sub="Connected with"
          />
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Bookings + Messages */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upcoming Appointments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Appointments</h3>
                <Link href="/dashboard/therapists" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  Book New <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No appointments yet</p>
                  <Link href="/dashboard/therapists">
                    <button className="mt-3 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                      Find a Therapist
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {bookings.map(b => (
                    <div key={b.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      {/* Provider avatar */}
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
                          {b.date && <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" />{b.date.split(',').slice(0, 2).join(',')}</span>}
                          {b.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>}
                        </div>
                        {b.notes && <p className="text-xs text-gray-400 mt-1 truncate">{b.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
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
                  <p className="text-gray-400 text-xs mt-1">Send a message to a therapist to start</p>
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
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{chat.lastMessage}</p>
                          )}
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

          {/* RIGHT — Quick Actions + Mood + Resources */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/therapists', icon: Users, label: 'Find a Therapist', color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                  { href: '/dashboard/mood', icon: Heart, label: 'Log Your Mood', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                  { href: '/dashboard/resources', icon: BookOpen, label: 'Browse Resources', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
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
                </div>
              ) : (
                <div className="space-y-2">
                  {moodEntries.slice(0, 5).map((entry, i) => {
                    const mood = entry.mood || entry.rating || entry.score
                    const moodNum = typeof mood === 'number' ? mood : null
                    return (
                      <div key={entry.id || i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {entry.date ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Entry ${i + 1}`}
                        </span>
                        <div className="flex items-center gap-2">
                          {moodNum !== null ? (
                            <>
                              <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary-500"
                                  style={{ width: `${Math.min((moodNum / 10) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-6 text-right">{moodNum}</span>
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
    </DashboardLayout>
  )
}
