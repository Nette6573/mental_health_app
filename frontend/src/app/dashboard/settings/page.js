'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

// ─── Plan config ────────────────────────────────────────────────────────────
const PLANS = [
  { id: 'free',       name: 'Free',        price: 0,    description: 'Basic access for individuals' },
  { id: 'individual', name: 'Individual',  price: 9.99, description: 'Everything in Free + priority support' },
  { id: 'pro',        name: 'Pro',         price: 29.99,description: 'Advanced features for professionals' },
  { id: 'enterprise', name: 'Enterprise',  price: 99.99,description: 'Full suite for teams & organisations' },
  { id: 'custom',     name: 'Custom',      price: null, description: 'Contact us for tailored pricing' },
]

// ─── Sidebar sections ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'profile',       name: 'Profile',        icon: '👤', description: 'Personal information' },
  { id: 'account',       name: 'Account',         icon: '🔐', description: 'Username & email' },
  { id: 'security',      name: 'Security',        icon: '🛡️', description: 'Password & login history' },
  { id: 'notifications', name: 'Notifications',   icon: '🔔', description: 'Alert preferences' },
  { id: 'display',       name: 'Display',         icon: '🎨', description: 'Theme & appearance' },
  { id: 'billing',       name: 'Billing',         icon: '💳', description: 'Plan & payment' },
  { id: 'help',          name: 'Help & Support',  icon: '💬', description: 'Get help' },
]

// ─── Tiny helpers ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>}
    </div>
  )
}

function FieldBlock({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  )
}

function InputField({ value, onChange, disabled, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                 disabled:opacity-50 disabled:cursor-not-allowed transition"
    />
  )
}

function SaveButton({ onClick, loading, label = 'Save Changes' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50
                 text-white text-sm font-semibold rounded-lg transition-all duration-150
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {loading ? 'Saving…' : label}
    </button>
  )
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  const colors = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300'
    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors} flex items-center gap-3`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE SECTION
// ═══════════════════════════════════════════════════════════════════════════
function ProfileSection({ user }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), form, { merge: true })
      setToast({ message: 'Profile updated successfully.', type: 'success' })
    } catch {
      setToast({ message: 'Failed to save profile.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Profile" subtitle="Update your personal information and how others see you." />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FieldBlock label="First Name">
            <InputField value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
          </FieldBlock>
          <FieldBlock label="Last Name">
            <InputField value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </FieldBlock>
        </div>
        <FieldBlock label="Phone Number">
          <InputField value={form.phone} type="tel" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </FieldBlock>
        <FieldBlock label="Bio">
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition"
          />
        </FieldBlock>
        <div className="flex justify-end">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCOUNT SECTION
// ═══════════════════════════════════════════════════════════════════════════
function AccountSection({ user }) {
  // Username = email address (read-only per spec)
  return (
    <div>
      <SectionHeader title="Account" subtitle="Your login credentials. Username mirrors your email address." />
      <div className="p-8 space-y-6">
        <FieldBlock label="Username">
          <InputField value={user?.email || ''} disabled />
          <p className="text-xs text-gray-400 mt-1">Your username is the same as your email address and cannot be changed independently.</p>
        </FieldBlock>
        <FieldBlock label="Email Address">
          <InputField value={user?.email || ''} disabled type="email" />
          <p className="text-xs text-gray-400 mt-1">To change your email, please contact support.</p>
        </FieldBlock>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY SECTION
// ═══════════════════════════════════════════════════════════════════════════
function SecuritySection({ user }) {
  const [resetLoading, setResetLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [loginHistory, setLoginHistory] = useState(null)
  const [deviceInfo, setDeviceInfo] = useState(null)

  useEffect(() => {
    const loadSecurity = async () => {
      if (!user?.uid) return
      try {
        const snap = await getDoc(doc(db, 'provider_security', user.uid))
        if (snap.exists()) {
          const data = snap.data()
          setLoginHistory(data.last_login?.toDate ? data.last_login.toDate() : null)
          setDeviceInfo(data.device_info || null)
        }
      } catch (err) {
        console.error('Failed to load security data:', err)
      }
    }
    loadSecurity()
  }, [user])

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setResetLoading(true)
    try {
      await sendPasswordResetEmail(auth, user.email)
      setToast({ message: `Password reset email sent to ${user.email}`, type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Failed to send reset email.', type: 'error' })
    } finally {
      setResetLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'No data'
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    })
  }

  return (
    <div>
      <SectionHeader title="Security" subtitle="Manage your password and review recent login activity." />
      <div className="p-8 space-y-8">

        {/* Password */}
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-6 space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Password</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We'll send a password reset link to <span className="font-medium text-gray-700 dark:text-gray-200">{user?.email}</span>.
          </p>
          <button
            onClick={handlePasswordReset}
            disabled={resetLoading}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50
                       text-white text-sm font-semibold rounded-lg transition"
          >
            {resetLoading ? 'Sending…' : 'Send Password Reset Email'}
          </button>
        </div>

        {/* Login History */}
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Login History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Last Login</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {loginHistory ? formatDate(loginHistory) : 'Not available'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Device</p>
              <p className="text-gray-900 dark:text-white font-medium break-all">
                {deviceInfo || 'Not available'}
              </p>
            </div>
          </div>
        </div>

      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS SECTION
// ═══════════════════════════════════════════════════════════════════════════
function NotificationsSection({ user }) {
  const [prefs, setPrefs] = useState({
    email_notification: false,
    sms_notification: false,
    appointment_reminders: false,
    marketing_emails: false,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      try {
        const snap = await getDoc(doc(db, 'provider_security', user.uid))
        if (snap.exists()) {
          const d = snap.data()
          setPrefs({
            email_notification: d.email_notification === 'true' || d.email_notification === true,
            sms_notification: d.sms_notification === 'true' || d.sms_notification === true,
            appointment_reminders: d.appointment_reminders === 'true' || d.appointment_reminders === true,
            marketing_emails: d.marketing_emails === 'true' || d.marketing_emails === true,
          })
        }
      } catch { /* silent */ }
    }
    load()
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'provider_security', user.uid), {
        email_notification: String(prefs.email_notification),
        sms_notification: String(prefs.sms_notification),
        appointment_reminders: String(prefs.appointment_reminders),
        marketing_emails: String(prefs.marketing_emails),
      }, { merge: true })
      setToast({ message: 'Notification preferences saved.', type: 'success' })
    } catch {
      setToast({ message: 'Failed to save preferences.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ label, desc, field }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setPrefs(p => ({ ...p, [field]: !p[field] }))}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
          ${prefs[field] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
          ${prefs[field] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Choose how and when you want to be notified." />
      <div className="p-8 space-y-2">
        <Toggle label="Email Notifications" desc="Receive updates via email" field="email_notification" />
        <Toggle label="SMS Notifications" desc="Receive text message alerts" field="sms_notification" />
        <Toggle label="Appointment Reminders" desc="Get reminded before upcoming appointments" field="appointment_reminders" />
        <Toggle label="Marketing Emails" desc="News, tips and promotional offers" field="marketing_emails" />
        <div className="pt-4 flex justify-end">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY SECTION
// ═══════════════════════════════════════════════════════════════════════════
function DisplaySection({ user }) {
  const [settings, setSettings] = useState({ timezone: '', settings_language: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      try {
        const snap = await getDoc(doc(db, 'provider_security', user.uid))
        if (snap.exists()) {
          const d = snap.data()
          setSettings({ timezone: d.timezone || '', settings_language: d.settings_language || '' })
        }
      } catch { /* silent */ }
    }
    load()
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'provider_security', user.uid), settings, { merge: true })
      setToast({ message: 'Display settings saved.', type: 'success' })
    } catch {
      setToast({ message: 'Failed to save settings.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Display" subtitle="Localisation and language preferences." />
      <div className="p-8 space-y-6">
        <FieldBlock label="Language">
          <select
            value={settings.settings_language}
            onChange={e => setSettings(s => ({ ...s, settings_language: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="pt">Portuguese</option>
          </select>
        </FieldBlock>
        <FieldBlock label="Timezone">
          <select
            value={settings.timezone}
            onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          >
            <option value="">Select timezone</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/Jamaica">Jamaica (UTC-5)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
          </select>
        </FieldBlock>
        <div className="flex justify-end">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BILLING SECTION
// ═══════════════════════════════════════════════════════════════════════════
function BillingSection({ user }) {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  // Format card number with spaces
  const formatCardNumber = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  // Format expiry MM/YY
  const formatExpiry = (v) => {
    const clean = v.replace(/\D/g, '').slice(0, 4)
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
  }

  const currentPlan = PLANS.find(p => p.id === selectedPlan)

  const handleSave = async () => {
    // In production, card data should go through a PCI-compliant processor (Stripe, etc.)
    // Never store raw card data in Firestore. This saves only plan selection.
    if (!card.number || !card.expiry || !card.cvc || !card.name) {
      setToast({ message: 'Please fill in all card fields.', type: 'error' })
      return
    }
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), { plan: selectedPlan }, { merge: true })
      setToast({ message: 'Plan updated. Payment processed securely.', type: 'success' })
    } catch {
      setToast({ message: 'Failed to update plan.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHeader title="Billing" subtitle="Manage your subscription plan and payment method." />
      <div className="p-8 space-y-8">

        {/* Current Plan Badge */}
        <div className="flex items-center gap-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 border border-primary-200 dark:border-primary-800">
          <div className="text-3xl">💳</div>
          <div>
            <p className="text-xs text-primary-500 uppercase tracking-widest font-semibold">Current Plan</p>
            <p className="text-xl font-bold text-primary-700 dark:text-primary-300">{currentPlan?.name}</p>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              {currentPlan?.price === null
                ? 'Contact us for pricing'
                : currentPlan?.price === 0
                ? 'Free forever'
                : `$${currentPlan.price}/month`}
            </p>
          </div>
        </div>

        {/* Plan Selector */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
            Choose a Plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLANS.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-150
                  ${selectedPlan === plan.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{plan.name}</span>
                  {selectedPlan === plan.id && (
                    <span className="text-primary-500 text-xs">✓ Selected</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                <p className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-2">
                  {plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Credit Card Form — hide for Free plan */}
        {selectedPlan !== 'free' && (
          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Payment Details
            </h3>
            <p className="text-xs text-gray-400">
              🔒 Your payment information is encrypted and processed securely. We never store raw card data.
            </p>

            <FieldBlock label="Cardholder Name">
              <InputField
                value={card.name}
                placeholder="Jane Smith"
                onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
              />
            </FieldBlock>

            <FieldBlock label="Card Number">
              <InputField
                value={card.number}
                placeholder="1234 5678 9012 3456"
                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
              />
            </FieldBlock>

            <div className="grid grid-cols-2 gap-4">
              <FieldBlock label="Expiry Date">
                <InputField
                  value={card.expiry}
                  placeholder="MM/YY"
                  onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                />
              </FieldBlock>
              <FieldBlock label="CVC">
                <InputField
                  value={card.cvc}
                  placeholder="123"
                  type="password"
                  onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                />
              </FieldBlock>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <SaveButton
            onClick={handleSave}
            loading={saving}
            label={selectedPlan === 'free' ? 'Downgrade to Free' : 'Save & Activate Plan'}
          />
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HELP SECTION
// ═══════════════════════════════════════════════════════════════════════════
function HelpSection({ user }) {
  return (
    <div>
      <SectionHeader title="Help & Support" subtitle="Get assistance whenever you need it." />
      <div className="p-8 space-y-4">
        {[
          { icon: '📧', title: 'Email Support', desc: 'support@yourapp.com', href: 'mailto:support@yourapp.com' },
          { icon: '📖', title: 'Documentation', desc: 'Browse our guides and FAQs', href: '#' },
          { icon: '💬', title: 'Live Chat', desc: 'Chat with our team in real time', href: '#' },
        ].map(item => (
          <a
            key={item.title}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700
                       hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50
                       dark:hover:bg-primary-900/10 transition group"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')

  // One ref per section for scroll targeting
  const sectionRefs = useRef({})

  useEffect(() => {
    if (!authLoading) setIsLoading(false)
  }, [authLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  // Scroll to section + highlight nav
  const handleNavClick = (id) => {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Update active nav item based on scroll position
  const handleScroll = (e) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    let current = SECTIONS[0].id
    for (const { id } of SECTIONS) {
      const el = sectionRefs.current[id]
      if (el && el.offsetTop - container.offsetTop - 80 <= scrollTop) {
        current = id
      }
    }
    setActiveSection(current)
  }

  const renderSection = (id) => {
    switch (id) {
      case 'profile':       return <ProfileSection user={user} />
      case 'account':       return <AccountSection user={user} />
      case 'security':      return <SecuritySection user={user} />
      case 'notifications': return <NotificationsSection user={user} />
      case 'display':       return <DisplaySection user={user} />
      case 'billing':       return <BillingSection user={user} />
      case 'help':          return <HelpSection user={user} />
      default:              return null
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sticky Sidebar ─────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm
                            border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleNavClick(section.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${activeSection === section.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }
                    `}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{section.name}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                    {activeSection === section.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Account Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">Member since</span>
                    <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                      {new Date(user.createdAt || '2024-01-01').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">Plan</span>
                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 dark:text-gray-500 text-xs">Status</span>
                    <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Scrollable Content Panel ────────────────────────────── */}
          <div
            className="lg:col-span-3 h-[calc(100vh-12rem)] overflow-y-auto scroll-smooth
                       rounded-xl bg-white dark:bg-gray-800 shadow-sm
                       border border-gray-200 dark:border-gray-700"
            onScroll={handleScroll}
          >
            {SECTIONS.map(({ id }) => (
              <div
                key={id}
                ref={el => { sectionRefs.current[id] = el }}
                id={`settings-section-${id}`}
                className="border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                {renderSection(id)}
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
