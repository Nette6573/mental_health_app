'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth } from '@/lib/firebase/firebaseClient'
import { Loader2, Camera } from 'lucide-react'

export default function ProfileSettings({ user }) {
  const { updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    avatar: ''
  })

  const uid = user?.uid ?? user?.id

  // ── Load from Firestore on mount ──
  useEffect(() => {
    if (!uid) return
    const fetchUser = async () => {
      try {
        setIsFetching(true)
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          const data = snap.data()
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || user?.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            location: data.location || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            avatar: data.avatar || '',
          })
          if (data.avatar) setAvatarPreview(data.avatar)
        } else {
          // Pre-fill from auth context if no Firestore doc yet
          setFormData(prev => ({
            ...prev,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            avatar: user?.avatar || '',
          }))
          if (user?.avatar) setAvatarPreview(user.avatar)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setIsFetching(false)
      }
    }
    fetchUser()
  }, [uid])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ── Upload photo to Cloudinary → save URL to Firestore ──
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)

    try {
      setIsUploadingPhoto(true)
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('photoType', 'profile')
      uploadData.append('folder', 'users')

      const res = await fetch('/api/profile/upload-photo', { method: 'POST', body: uploadData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      // Save Cloudinary URL to Firestore immediately
      await setDoc(doc(db, 'users', uid), { avatar: data.url }, { merge: true })

      setAvatarPreview(data.url)
      setFormData(prev => ({ ...prev, avatar: data.url }))
      URL.revokeObjectURL(localUrl)
    } catch (err) {
      console.error('Photo upload error:', err)
      alert('Failed to upload photo: ' + err.message)
      setAvatarPreview(formData.avatar || '')
    } finally {
      setIsUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Write to Firestore users collection
      await setDoc(doc(db, 'users', uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        avatar: formData.avatar,
      }, { merge: true })

      // Also update AuthContext profile
      if (updateProfile) await updateProfile(formData)

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const initials = (formData.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {isUploadingPhoto ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-md disabled:opacity-60"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Profile Photo</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stored securely in Cloudinary. Max 5MB.</p>
            {isUploadingPhoto && <p className="text-xs text-primary-500 mt-1">Uploading...</p>}
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors">
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} placeholder="Tell us a little about yourself..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none transition-colors" />
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" disabled={isLoading || isUploadingPhoto}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors shadow-sm disabled:cursor-not-allowed flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
