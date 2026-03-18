'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Users,
  Church,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Key,
  UserPlus,
  X,
} from 'lucide-react'

export default function ProviderLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showRegModal, setShowRegModal] = useState(false)

  const [forgotEmail, setForgotEmail] = useState('')

  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regCredential, setRegCredential] = useState('')
  const [regSpecialization, setRegSpecialization] = useState('')

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('hopepath_email')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForgotModal(false)
        setShowRegModal(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (rememberMe) {
      localStorage.setItem('hopepath_email', email)
    } else {
      localStorage.removeItem('hopepath_email')
    }

    setTimeout(() => {
      setIsLoading(false)
      router.push('/provider-dashboard')
    }, 1500)
  }

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert('Password reset link sent to your email!')
    setShowForgotModal(false)
    setForgotEmail('')
  }

  const handleRegSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert(
      'Application submitted! We will review your credentials and contact you within 2-3 business days.'
    )
    setShowRegModal(false)
    setRegFirstName('')
    setRegLastName('')
    setRegEmail('')
    setRegCredential('')
    setRegSpecialization('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-br from-sky-50 via-cyan-50 to-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-sky-600/10 animate-pulse" />
      <div className="absolute top-1/4 -right-40 w-80 h-80 rounded-full bg-cyan-700/10 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-amber-600/10 animate-pulse" />

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10">
        {/* Left Side */}
        <div className="lg:w-1/2 bg-gradient-to-br from-sky-600 to-cyan-700 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <img
                src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
                alt="HopePath Logo"
                className="w-16 h-16 rounded-xl object-cover shadow-lg bg-white/20 backdrop-blur-sm"
              />
              <div>
                <h1 className="text-3xl font-bold">HopePath</h1>
                <p className="text-sky-100 text-sm">Provider Portal</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Welcome back,
              <br />
              Provider
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-md">
              Continue your mission of bringing hope and healing to those in need.
              Your expertise changes lives.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm">Secure, encrypted platform</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm">Connect with clients seeking help</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Church className="w-5 h-5" />
                </div>
                <span className="text-sm">Faith-integrated mental health care</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-sm text-white/70">
              &quot;Helping others is helping ourselves.&quot;
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Sign in to your account
              </h2>
              <p className="text-slate-500 text-sm">
                Enter your credentials to access your provider dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    placeholder="dr.anderson@hopepath.jm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none transition-all bg-slate-50/50 hover:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-sky-600 hover:text-cyan-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                New provider?{' '}
                <Link
                  href="/provider-dashboard/signup"
                  className="text-sky-600 hover:text-cyan-700 font-semibold transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Help */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <button
                  type="button"
                  className="hover:text-sky-600 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </button>
                <button
                  type="button"
                  className="hover:text-sky-600 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Reset Password</h3>
              <p className="text-sm text-slate-500">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowRegModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowRegModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Join HopePath</h3>
              <p className="text-sm text-slate-500">
                Apply to become a verified provider
              </p>
            </div>

            <form onSubmit={handleRegSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Professional Email
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none"
                  placeholder="dr.name@practice.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  License/Credentials
                </label>
                <input
                  type="text"
                  required
                  value={regCredential}
                  onChange={(e) => setRegCredential(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none"
                  placeholder="e.g., Licensed Clinical Psychologist"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Specialization
                </label>
                <select
                  required
                  value={regSpecialization}
                  onChange={(e) => setRegSpecialization(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none bg-white"
                >
                  <option value="">Select specialization...</option>
                  <option>Clinical Psychology</option>
                  <option>Counseling</option>
                  <option>Pastoral Care</option>
                  <option>Marriage & Family Therapy</option>
                  <option>Addiction Counseling</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Submit Application
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                By applying, you agree to our verification process and terms of service.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
