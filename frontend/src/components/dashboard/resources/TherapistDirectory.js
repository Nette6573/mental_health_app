'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import {
  collection, getDocs, doc, getDoc, addDoc, serverTimestamp, query, where
} from 'firebase/firestore'
import {
  MapPin, Clock, DollarSign, Globe,
  Briefcase, X, ChevronLeft, ChevronRight,
  ShieldCheck, AlertCircle, XCircle, Clock3,
} from 'lucide-react'

function VerificationBadge({ status }) {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" />Verified
        </span>
      )
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="h-3 w-3" />Do Not Book
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock3 className="h-3 w-3" />Pending Review
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          <AlertCircle className="h-3 w-3" />Unverified
        </span>
      )
  }
}

export default function TherapistDirectory() {
  const { user } = useAuth() as any
  const [providers, setProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [bookingProvider, setBookingProvider] = useState(null)

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [providerAvailability, setProviderAvailability] = useState(null)
  const [blockedDates, setBlockedDates] = useState([])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true)
        const snapshot = await getDocs(collection(db, 'providers'))
        const list = []
        snapshot.forEach((providerDoc) => {
          const data = providerDoc.data()
          list.push({
            id: providerDoc.id,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            professional_title: data.professional_title || '',
            professional_email: data.professional_email || '',
            phone_number: data.phone_number || '',
            website: data.website || '',
            organization: data.organization || '',
            parish: data.parish || '',
            biography: data.biography || '',
            experience: data.experience || '',
            practice_areas: Array.isArray(data.practice_areas) ? data.practice_areas : [],
            session_types: data.session_types || '',
            session_cost: data.session_cost || '',
            payment_options: data.payment_options || '',
            languages: Array.isArray(data.languages) ? data.languages : [],
            profile_photo_url: data.profile_photo_url || '',
            cover_photo_url: data.cover_photo_url || '',           // ← cover photo
            is_accepting_clients: data.is_accepting_clients ?? true,
            application_status: data.application_status || '',     // ← verification status
          })
        })
        setProviders(list)
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const openBooking = async (provider) => {
    setBookingProvider(provider)
    setSelectedDate(null)
    setSelectedTime('')
    setBookingNotes('')
    setBookingSuccess(false)
    setCalendarDate(new Date())
    try {
      const availSnap = await getDoc(doc(db, 'provider_availability', provider.id))
      if (availSnap.exists()) {
        const data = availSnap.data()
        setProviderAvailability(data)
        setBlockedDates(data.blocked_dates ? JSON.parse(data.blocked_dates) : [])
      } else {
        setProviderAvailability(null)
        setBlockedDates([])
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      setProviderAvailability(null)
    }
  }

  const parseBlockedDate = (dateStr) => {
    if (!dateStr) return []
    const str = dateStr.trim()
    const rangeMatch = str.match(/^(\w+)\s+(\d+)-(\d+),\s*(\d{4})$/)
    if (rangeMatch) {
      const [, month, startDay, endDay, year] = rangeMatch
      const dates = []
      for (let d = parseInt(startDay); d <= parseInt(endDay); d++) {
        const parsed = new Date(`${month} ${d}, ${year}`)
        if (!isNaN(parsed.getTime())) dates.push(parsed)
      }
      return dates
    }
    const parsed = new Date(str)
    return isNaN(parsed.getTime()) ? [] : [parsed]
  }

  const isDayAvailable = (date) => {
    if (!providerAvailability) return true
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const encoded = providerAvailability[dayNames[date.getDay()]]
    if (!encoded) return false
    const [avail] = encoded.split('|')
    if (avail !== '1') return false
    const dateKey = date.toDateString()
    return !blockedDates.some((b) => parseBlockedDate(b.date).some(pd => pd.toDateString() === dateKey))
  }

  const generateSlots = (start, end) => {
    const slots = []
    const [startH, startM] = start.split(':').map(Number)
    const [endH, endM] = end.split(':').map(Number)
    let current = startH * 60 + startM
    const endMin = endH * 60 + endM
    while (current + 60 <= endMin) {
      const h = Math.floor(current / 60)
      const m = current % 60
      slots.push(`${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`)
      current += 60
    }
    return slots
  }

  const getTimeSlots = (date) => {
    if (!providerAvailability || !date) return generateSlots('09:00', '17:00')
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    const encoded = providerAvailability[dayNames[date.getDay()]]
    if (!encoded) return generateSlots('09:00', '17:00')
    const [, start, end] = encoded.split('|')
    return generateSlots(start || '09:00', end || '17:00')
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    return days
  }

  const isPast = (date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return date < today
  }

  const submitBooking = async () => {
    if (!selectedDate || !selectedTime) { alert('Please select a date and time.'); return }
    if (!user) { alert('You must be logged in to book.'); return }
    const uid = user.uid ?? user.id
    if (!uid) { alert('Unable to identify user. Please log in again.'); return }
    setIsSubmitting(true)
    try {
      let userName = user.email || 'User'
      try {
        const userSnap = await getDoc(doc(db, 'users', uid))
        if (userSnap.exists()) {
          const userData = userSnap.data()
          const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          if (fullName) userName = fullName
        }
      } catch (e) {}

      await addDoc(collection(db, 'providers', bookingProvider.id, 'bookings'), {
        providerId: bookingProvider.id,
        providerName: `${bookingProvider.first_name} ${bookingProvider.last_name}`,
        providerTitle: bookingProvider.professional_title || '',
        userId: uid,
        userName,
        userEmail: user.email || '',
        date: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: selectedTime,
        notes: bookingNotes || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setBookingSuccess(true)
    } catch (error) {
      console.error('Booking error:', error.code, error.message)
      alert(`Failed to submit booking: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProviders = providers.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const name = `${p.first_name} ${p.last_name}`.toLowerCase()
    return name.includes(q) || (p.biography || '').toLowerCase().includes(q) ||
      (p.professional_title || '').toLowerCase().includes(q) ||
      (p.parish || '').toLowerCase().includes(q)
  })

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Search */}
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, title, or parish..."
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:text-white"
      />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filteredProviders.length} {filteredProviders.length === 1 ? 'therapist' : 'therapists'} found
      </p>

      {filteredProviders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center text-gray-500">
          <p className="text-lg font-medium">No therapists found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">

              {/* Cover photo */}
              {provider.cover_photo_url ? (
                <div className="h-24 w-full overflow-hidden">
                  <img src={provider.cover_photo_url} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-12 w-full bg-gradient-to-r from-primary-500 to-primary-600" />
              )}

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar overlapping cover */}
                  <div className="-mt-10 shrink-0">
                    {provider.profile_photo_url ? (
                      <img src={provider.profile_photo_url} alt=""
                        className="h-16 w-16 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white dark:border-gray-800 bg-primary-500 text-lg font-bold text-white shadow-md">
                        {(provider.first_name?.[0] || '').toUpperCase()}{(provider.last_name?.[0] || '').toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{provider.first_name} {provider.last_name}</h3>
                        {provider.professional_title && <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{provider.professional_title}</p>}
                        {provider.organization && <p className="text-xs text-gray-500 dark:text-gray-400">{provider.organization}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${provider.is_accepting_clients ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {provider.is_accepting_clients ? 'Accepting Clients' : 'Not Accepting'}
                        </span>
                        <VerificationBadge status={provider.application_status} />
                      </div>
                    </div>
                    {provider.biography && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{provider.biography}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-500 dark:text-gray-400">
                      {provider.parish && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.parish}</span>}
                      {provider.experience && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{provider.experience}</span>}
                      {provider.session_cost && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />JMD {provider.session_cost}</span>}
                      {provider.languages.length > 0 && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{provider.languages.join(', ')}</span>}
                      {provider.session_types && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{provider.session_types}</span>}
                    </div>
                    {provider.practice_areas.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {provider.practice_areas.slice(0, 4).map((spec) => (
                          <span key={spec} className="rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-400">{spec}</span>
                        ))}
                        {provider.practice_areas.length > 4 && (
                          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs text-gray-500">+{provider.practice_areas.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <button onClick={() => setSelectedProvider(provider)} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">View Profile</button>
                  <button onClick={() => openBooking(provider)} disabled={!provider.is_accepting_clients} className="rounded-lg bg-primary-500 hover:bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Book Session</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Notice */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🚨</span>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Need Immediate Help?</h3>
            <p className="text-red-700 dark:text-red-400 mb-3">If you&apos;re experiencing a mental health crisis, don&apos;t wait for an appointment.</p>
            <a href="tel:+18765554321" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block">Call Crisis Line: +1 (876) 555-HELP</a>
          </div>
        </div>
      </div>

      {/* PROFILE POPUP */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedProvider(null)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProvider(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-gray-700/80 p-2 text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>

            {/* Cover photo in modal */}
            {selectedProvider.cover_photo_url ? (
              <div className="h-36 w-full overflow-hidden rounded-t-2xl">
                <img src={selectedProvider.cover_photo_url} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-28 w-full rounded-t-2xl bg-gradient-to-r from-primary-500 to-primary-600" />
            )}

            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4 flex items-end justify-between">
                {selectedProvider.profile_photo_url ? (
                  <img src={selectedProvider.profile_photo_url} alt="" className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white dark:border-gray-800 bg-primary-500 text-2xl font-bold text-white shadow-lg">
                    {(selectedProvider.first_name?.[0] || '').toUpperCase()}{(selectedProvider.last_name?.[0] || '').toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedProvider.is_accepting_clients ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedProvider.is_accepting_clients ? 'Accepting Clients' : 'Not Accepting'}
                  </span>
                  <VerificationBadge status={selectedProvider.application_status} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProvider.first_name} {selectedProvider.last_name}</h2>
              {selectedProvider.professional_title && <p className="text-primary-600 dark:text-primary-400 font-medium">{selectedProvider.professional_title}</p>}
              {selectedProvider.organization && <p className="text-sm text-gray-500 dark:text-gray-400">{selectedProvider.organization}</p>}
              {selectedProvider.biography && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{selectedProvider.biography}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {selectedProvider.parish && <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3"><p className="text-xs text-gray-500">Location</p><p className="text-sm font-medium text-gray-800 dark:text-white">{selectedProvider.parish}</p></div>}
                {selectedProvider.experience && <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3"><p className="text-xs text-gray-500">Experience</p><p className="text-sm font-medium text-gray-800 dark:text-white">{selectedProvider.experience}</p></div>}
                {selectedProvider.session_cost && <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3"><p className="text-xs text-gray-500">Session Rate</p><p className="text-sm font-medium text-gray-800 dark:text-white">JMD {selectedProvider.session_cost}</p></div>}
                {selectedProvider.session_types && <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3"><p className="text-xs text-gray-500">Session Types</p><p className="text-sm font-medium text-gray-800 dark:text-white">{selectedProvider.session_types}</p></div>}
              </div>
              {selectedProvider.practice_areas.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Areas of Practice</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.practice_areas.map((spec) => (
                      <span key={spec} className="rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-400">{spec}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setSelectedProvider(null); openBooking(selectedProvider) }} disabled={!selectedProvider.is_accepting_clients} className="flex-1 rounded-lg bg-primary-500 hover:bg-primary-600 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50">Book Session</button>
                <button onClick={() => setSelectedProvider(null)} className="rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING POPUP */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
            <button onClick={() => setBookingProvider(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-gray-700/80 p-2 text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><span className="text-3xl">✅</span></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Submitted!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Your appointment request with <strong>{bookingProvider.first_name} {bookingProvider.last_name}</strong> has been sent.</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2"><strong>{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime}</strong></p>
                  <p className="text-xs text-gray-400 mb-6">The provider will confirm your appointment shortly.</p>
                  <button onClick={() => setBookingProvider(null)} className="rounded-lg bg-primary-500 px-6 py-2 text-sm font-medium text-white hover:bg-primary-600">Done</button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    {bookingProvider.profile_photo_url ? (
                      <img src={bookingProvider.profile_photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                        {(bookingProvider.first_name?.[0] || '').toUpperCase()}{(bookingProvider.last_name?.[0] || '').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Book a Session</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bookingProvider.first_name} {bookingProvider.last_name} · {bookingProvider.professional_title}</p>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Select Date</h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCalendarDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d })} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                        <button onClick={() => setCalendarDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d })} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayLabels.map(d => <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(calendarDate).map((date, i) => {
                        if (!date) return <div key={i} />
                        const past = isPast(date)
                        const unavailable = !isDayAvailable(date)
                        const isSelected = selectedDate?.toDateString() === date.toDateString()
                        const isToday = date.toDateString() === new Date().toDateString()
                        const disabled = past || unavailable
                        return (
                          <button key={i} onClick={() => { if (!disabled) { setSelectedDate(date); setSelectedTime('') } }} disabled={disabled}
                            className={`aspect-square rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-primary-500 text-white' : isToday && !disabled ? 'border-2 border-primary-500 text-primary-600 dark:text-primary-400' : disabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300'}`}>
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Select Time</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {getTimeSlots(selectedDate).map((slot) => (
                          <button key={slot} onClick={() => setSelectedTime(slot)}
                            className={`rounded-lg border py-2 text-xs font-medium transition-all ${selectedTime === slot ? 'border-primary-500 bg-primary-500 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Notes (optional)</h4>
                    <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Describe what you'd like to discuss..." rows={3} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none" />
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="mb-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 p-3 text-sm">
                      <p className="font-medium text-primary-700 dark:text-primary-300">Booking Summary</p>
                      <p className="text-primary-600 dark:text-primary-400 mt-1">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTime}</p>
                      {bookingProvider.session_cost && <p className="text-primary-600 dark:text-primary-400">Rate: JMD {bookingProvider.session_cost}</p>}
                    </div>
                  )}

                  <button onClick={submitBooking} disabled={!selectedDate || !selectedTime || isSubmitting}
                    className="w-full rounded-lg bg-primary-500 hover:bg-primary-600 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
