'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function AdminLoginPage() {
  const { state, login, clearError } = useAdminAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accessId: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!state.isLoading && state.admin) {
      router.replace('/admin/dashboard')
    }
  }, [state.isLoading, state.admin, router])

  // Restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem('hopepath_admin_email')
    if (saved) {
      setFormData(prev => ({ ...prev, email: saved, rememberMe: true }))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (state.error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginAttempts >= 5) return

    // Validate Access ID format
    if (!formData.accessId.startsWith('ADMIN-')) {
      return
    }

    setIsSubmitting(true)

    if (formData.rememberMe) {
      localStorage.setItem('hopepath_admin_email', formData.email)
    } else {
      localStorage.removeItem('hopepath_admin_email')
    }

    const result = await login(formData.email, formData.password, formData.accessId)

    if (result.success) {
      if (result.isFirstLogin) {
        router.replace('/admin/reset-password')
      } else {
        router.replace('/admin/dashboard')
      }
    } else {
      setLoginAttempts(prev => prev + 1)
    }

    setIsSubmitting(false)
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        :root {
          --admin-dark: #0f172a;
          --admin-mid: #1e293b;
          --admin-border: #334155;
          --admin-accent: #2596be;
        }
        body { background-color: var(--admin-dark); margin: 0; }

        .admin-bg {
          background:
            radial-gradient(ellipse 80% 60% at 20% 0%, rgba(37,150,190,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 100%, rgba(30,127,163,0.10) 0%, transparent 55%),
            #0f172a;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(37,150,190,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,150,190,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .card-glass {
          background: rgba(30,41,59,0.85);
          border: 1px solid rgba(51,65,85,0.8);
          backdrop-filter: blur(24px);
        }
        .input-dark {
          background: rgba(15,23,42,0.6);
          border: 1px solid #334155;
          color: #e2e8f0;
          transition: all 0.2s ease;
          width: 100%;
          padding: 12px 12px 12px 40px;
          border-radius: 12px;
          font-size: 0.875rem;
          outline: none;
        }
        .input-dark::placeholder { color: #475569; }
        .input-dark:focus {
          background: rgba(15,23,42,0.9);
          border-color: #2596be;
          box-shadow: 0 0 0 3px rgba(37,150,190,0.15);
        }
        .btn-admin {
          background: linear-gradient(135deg, #2596be 0%, #1e7fa3 100%);
          box-shadow: 0 4px 24px rgba(37,150,190,0.35);
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .btn-admin:hover {
          box-shadow: 0 8px 32px rgba(37,150,190,0.5);
          transform: translateY(-1px);
        }
        .btn-admin:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .badge-admin {
          background: linear-gradient(135deg, rgba(37,150,190,0.2), rgba(30,127,163,0.15));
          border: 1px solid rgba(37,150,190,0.3);
        }
        .glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(37,150,190,0.5), transparent);
        }
        .pulse-dot { animation: pulseDot 2s infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-slide { animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .modal-overlay {
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="admin-bg min-h-screen flex items-center justify-center p-4 relative overflow-x-hidden">
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

        {/* Corner decorations */}
        <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-0">
          <svg width="256" height="256" viewBox="0 0 256 256" fill="none">
            <path d="M0 0 L256 0 L0 256 Z" fill="rgba(37,150,190,0.03)"/>
            <path d="M0 0 L128 0 L0 128 Z" stroke="rgba(37,150,190,0.08)" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none z-0">
          <svg width="256" height="256" viewBox="0 0 256 256" fill="none">
            <path d="M256 256 L0 256 L256 0 Z" fill="rgba(37,150,190,0.03)"/>
          </svg>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-5xl card-glass rounded-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 anim-slide">

          {/* Left Panel */}
          <div className="lg:w-5/12 p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden"
               style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)', borderRight: '1px solid #334155' }}>

            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-5"
                 style={{ background: 'radial-gradient(circle, #2596be, transparent)' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-5"
                 style={{ background: 'radial-gradient(circle, #2596be, transparent)' }} />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-10 anim-slide delay-1">
                <div className="relative">
                  <img src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
                       alt="HopePath"
                       className="w-14 h-14 rounded-xl object-cover shadow-lg" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                       style={{ background: '#0f172a', border: '1px solid #2596be' }}>
                    <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#2596be' }} />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">HopePath</h1>
                  <div className="badge-admin rounded-full px-2 py-0.5 inline-flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#2596be' }}>Admin Portal</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="mb-8 anim-slide delay-2">
                <h2 className="text-4xl font-bold text-white leading-tight mb-3">
                  Secure<br />
                  <span style={{ color: '#2596be' }}>Admin</span><br />
                  Access
                </h2>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#94a3b8' }}>
                  Restricted to authorized HopePath administrators only. All sessions are monitored and logged.
                </p>
              </div>

              <div className="glow-line mb-8" />

              {/* Features */}
              <div className="space-y-3 anim-slide delay-3">
                {[
                  'Manage providers and users',
                  'Platform analytics and reporting',
                  'System configuration and settings',
                  'Provider application reviews',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(37,150,190,0.12)', border: '1px solid rgba(37,150,190,0.2)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="#2596be" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: '#cbd5e1' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security note */}
            <div className="relative z-10 mt-8 rounded-xl p-3 flex items-start gap-3 anim-slide delay-4"
                 style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(37,150,190,0.25)' }}>
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#f59e0b' }}>
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
                <span className="font-semibold" style={{ color: '#f59e0b' }}>Restricted access.</span> Unauthorized login attempts are logged and reported to support.
              </p>
            </div>
          </div>

          {/* Right Panel — Login Form */}
          <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center" style={{ background: 'rgba(15,23,42,0.5)' }}>
            <div className="max-w-md w-full mx-auto">

              {/* Header */}
              <div className="mb-8 anim-slide delay-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#2596be' }} />
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#2596be' }}>Secure Session</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1.5">Administrator Sign In</h2>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Enter your admin credentials to access the control panel</p>
              </div>

              {/* Error */}
              {state.error && (
                <div className="mb-4 p-3 rounded-xl flex items-center gap-3 text-sm anim-slide"
                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#f87171' }}>{state.error}</span>
                </div>
              )}

              {/* Lockout warning */}
              {loginAttempts >= 3 && loginAttempts < 5 && (
                <div className="mb-4 p-3 rounded-xl anim-slide"
                     style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <p className="text-xs" style={{ color: '#fbbf24' }}>
                    Warning: {5 - loginAttempts} attempt(s) remaining before lockout.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Access ID */}
                <div className="anim-slide delay-2">
                  <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: '#94a3b8' }}>
                    Access ID
                  </label>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="#475569" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                    </svg>
                    <input
                      type="text"
                      name="accessId"
                      value={formData.accessId}
                      onChange={handleChange}
                      required
                      placeholder="ADMIN-XXXXX"
                      disabled={loginAttempts >= 5}
                      className="input-dark font-mono"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {formData.accessId && !formData.accessId.startsWith('ADMIN-') && (
                    <p className="mt-1 text-xs" style={{ color: '#f87171' }}>Format must be ADMIN-XXXXX</p>
                  )}
                </div>

                {/* Email */}
                <div className="anim-slide delay-2">
                  <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: '#94a3b8' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="#475569" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="admin@hopepath.online"
                      disabled={loginAttempts >= 5}
                      className="input-dark"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="anim-slide delay-3">
                  <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: '#94a3b8' }}>
                    Password
                  </label>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="#475569" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••••••"
                      disabled={loginAttempts >= 5}
                      className="input-dark"
                      style={{ paddingLeft: '40px', paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between anim-slide delay-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#2596be' }}
                    />
                    <span className="text-sm" style={{ color: '#64748b' }}>Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#2596be', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || loginAttempts >= 5}
                  className="btn-admin w-full py-3.5 text-white rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 anim-slide delay-4"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </>
                  ) : loginAttempts >= 5 ? (
                    'Account Locked'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Access Admin Panel
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid #1e293b' }}>
                <div className="flex items-center justify-center gap-6">
                  <a href="/provider-dashboard/login" className="text-xs flex items-center gap-1.5 transition-colors" style={{ color: '#64748b' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Provider Login
                  </a>
                  <span style={{ color: '#1e293b' }}>|</span>
                  <a href="mailto:support@hopepath.online" className="text-xs transition-colors" style={{ color: '#64748b' }}>Support</a>
                  <span style={{ color: '#1e293b' }}>|</span>
                  <a href="/privacy" className="text-xs transition-colors" style={{ color: '#64748b' }}>Privacy Policy</a>
                </div>
                <p className="text-center text-xs mt-4" style={{ color: '#334155' }}>
                  HopePath Admin &bull; &copy; 2026 HopePath. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
               onClick={() => setShowForgotModal(false)}>
            <div className="card-glass rounded-2xl max-w-md w-full p-6 shadow-2xl"
                 style={{ border: '1px solid #334155' }}
                 onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                     style={{ background: 'rgba(37,150,190,0.12)', border: '1px solid rgba(37,150,190,0.25)' }}>
                  <svg className="w-7 h-7" fill="none" stroke="#2596be" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Reset Admin Password</h3>
                <p className="text-sm" style={{ color: '#94a3b8' }}>Enter your admin email and we'll send a secure reset link</p>
              </div>

              {forgotSent ? (
                <div className="text-center py-4">
                  <p className="text-sm" style={{ color: '#34d399' }}>Reset link sent! Check your email.</p>
                  <button onClick={() => { setShowForgotModal(false); setForgotSent(false) }}
                          className="mt-4 text-sm" style={{ color: '#2596be', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 tracking-wider uppercase" style={{ color: '#94a3b8' }}>
                      Admin Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="input-dark"
                      style={{ paddingLeft: '12px' }}
                      placeholder="admin@hopepath.online"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                      style={{ border: '1px solid #334155', background: 'rgba(15,23,42,0.5)', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setForgotSent(true)}
                      className="btn-admin flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
