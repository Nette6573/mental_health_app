// src/app/admin/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import AdminLoginForm from '@/components/auth/AdminLoginForm'
import TwoFactorAuth from '@/components/auth/TwoFactorAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin/dashboard'
  const { state } = useAdminAuth()

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push(redirect)
    }
  }, [state.isAuthenticated, router, redirect])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        :root {
          --blue-200: #BFDBFE;
          --blue-300: #93C5FD;
          --blue-400: #60A5FA;
          --blue-500: #3B82F6;
          --blue-600: #2563EB;
          --blue-700: #1D4ED8;
          --blue-950: #0F1F3D;
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-wrap {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(ellipse 80% 60% at 60% -10%, rgba(59,130,246,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 80%, rgba(30,64,175,0.3) 0%, transparent 55%),
            var(--blue-950);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
        }

        .login-wrap::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .login-inner {
          position: relative; z-index: 1;
          width: 100%; max-width: 448px;
          animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s both;
        }

        /* Header */
        .login-header { text-align: center; margin-bottom: 32px; }

        .login-logo-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          margin-bottom: 20px;
        }

        .login-logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(37,99,235,0.5);
        }

        .login-logo-icon span {
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem; font-weight: 800;
          color: #fff; letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 0.9rem; color: var(--blue-300); font-weight: 400;
        }

        /* Card */
        .login-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          overflow: hidden;
          backdrop-filter: blur(12px);
        }

        .login-tab-bar {
          display: flex;
          border-bottom: 1px solid rgba(59,130,246,0.15);
          background: rgba(255,255,255,0.02);
        }

        .login-tab {
          flex: 1; padding: 14px 24px;
          font-size: 0.85rem; font-weight: 600;
          color: var(--blue-300);
          border-bottom: 2px solid var(--blue-500);
          text-align: center;
          letter-spacing: 0.01em;
        }

        .login-form-area { padding: 32px; }

        /* Footer note */
        .login-footer {
          margin-top: 24px; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        .login-footer p {
          font-size: 0.75rem; color: var(--blue-400); font-weight: 400;
        }

        /* Override form component styles to match theme */
        .login-form-area :global(label) {
          color: var(--blue-200) !important;
          font-size: 0.82rem !important;
          font-weight: 600 !important;
          font-family: 'DM Sans', sans-serif !important;
        }

        .login-form-area :global(input[type="email"]),
        .login-form-area :global(input[type="password"]),
        .login-form-area :global(input[type="text"]) {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(59,130,246,0.22) !important;
          border-radius: 8px !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.95rem !important;
        }

        .login-form-area :global(input::placeholder) {
          color: rgba(147,197,253,0.4) !important;
        }

        .login-form-area :global(input:focus) {
          border-color: var(--blue-500) !important;
          background: rgba(59,130,246,0.08) !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
        }

        .login-form-area :global(button[type="submit"]),
        .login-form-area :global(button[type="submit"]:is(*)) {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #ffffff !important;
          font-family: 'DM Sans', sans-serif !important;
          font-weight: 700 !important;
          font-size: 1rem !important;
          width: 100% !important;
          padding: 14px !important;
          cursor: pointer !important;
          box-shadow: 0 6px 24px rgba(37,99,235,0.5), 0 0 0 1px rgba(59,130,246,0.3) !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease !important;
          position: relative !important;
          z-index: 1 !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        .login-form-area :global(button[type="submit"]:hover) {
          transform: translateY(-2px) !important;
          box-shadow: 0 14px 40px rgba(37,99,235,0.65), 0 0 0 1px rgba(59,130,246,0.5) !important;
          filter: brightness(1.1) !important;
        }

        .login-form-area :global(button[type="submit"]:active) {
          transform: translateY(0px) !important;
          box-shadow: 0 4px 16px rgba(37,99,235,0.4) !important;
        }

        .login-form-area :global(a) {
          color: var(--blue-400) !important;
          transition: color 0.2s !important;
        }

        .login-form-area :global(a:hover) {
          color: var(--blue-300) !important;
        }

        .login-form-area :global(p),
        .login-form-area :global(span) {
          color: var(--blue-300);
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-inner">

          {/* Header */}
          <div className="login-header">
            <div className="login-logo-wrap">
              <div className="login-logo-icon">
                <span>HP</span>
              </div>
            </div>
            <h1 className="login-title">Admin Dashboard</h1>
            <p className="login-subtitle">Sign in to manage HopePath platform</p>
          </div>

          {/* Card */}
          <div className="login-card">
            <div className="login-tab-bar">
              <div className="login-tab">Admin Login</div>
            </div>

            <div className="login-form-area">
              <style>{`
                .login-form-area button[type="submit"] {
                  background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
                  color: #ffffff !important;
                  -webkit-text-fill-color: #ffffff !important;
                  border: none !important;
                  border-radius: 8px !important;
                  font-weight: 700 !important;
                  font-size: 1rem !important;
                  width: 100% !important;
                  padding: 14px !important;
                  cursor: pointer !important;
                  box-shadow: 0 6px 24px rgba(37,99,235,0.5) !important;
                  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                  display: block !important;
                }
                .login-form-area button[type="submit"]:hover {
                  transform: translateY(-2px) !important;
                  box-shadow: 0 14px 40px rgba(37,99,235,0.65) !important;
                  filter: brightness(1.1) !important;
                }
                .login-form-area button[type="submit"]:active {
                  transform: translateY(0) !important;
                }
              `}</style>
              {state.requiresTwoFactor ? (
                <TwoFactorAuth />
              ) : (
                <AdminLoginForm />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p>Secure admin access only. All actions are logged and monitored.</p>
          </div>

        </div>
      </div>
    </>
  )
}