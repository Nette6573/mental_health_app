'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import AdminLoginForm from '@/components/auth/AdminLoginForm'
import TwoFactorAuth from '@/components/auth/TwoFactorAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  const { state } = useAdminAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (state.isAuthenticated) {
      router.push(redirect)
    }
  }, [state.isAuthenticated, router, redirect])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --b50:  #EFF6FF;
          --b100: #DBEAFE;
          --b200: #BFDBFE;
          --b300: #93C5FD;
          --b400: #60A5FA;
          --b500: #3B82F6;
          --b600: #2563EB;
          --b700: #1D4ED8;
          --b800: #1E40AF;
          --b900: #1E3A5F;
          --b950: #0B1628;
        }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.7);opacity:0} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes beam     { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.08)} }
        @keyframes slideRight { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes cardIn   { from{opacity:0;transform:translateX(60px) scale(.96)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes gridDrift{ from{background-position:0 0} to{background-position:48px 48px} }

        .hp-wrap {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: var(--b950);
          overflow-x: hidden;
          position: relative;
        }

        /* Animated mesh background */
        .hp-wrap::before {
          content:'';
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(ellipse 90% 70% at 70% -5%,  rgba(59,130,246,.28) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at -10% 85%, rgba(30,64,175,.35) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 100% 60%, rgba(29,78,216,.2)  0%, transparent 50%);
        }
        .hp-wrap::after {
          content:'';
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(59,130,246,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,.05) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridDrift 8s linear infinite;
        }

        /* Floating orbs */
        .orb {
          position:fixed; border-radius:50%; pointer-events:none; z-index:0;
          filter: blur(80px);
        }
        .orb-1 {
          width:500px; height:500px; top:-100px; right:-100px;
          background: radial-gradient(circle, rgba(59,130,246,.15), transparent 70%);
          animation: float 9s ease-in-out infinite;
        }
        .orb-2 {
          width:400px; height:400px; bottom:-80px; left:-80px;
          background: radial-gradient(circle, rgba(30,64,175,.2), transparent 70%);
          animation: float 12s ease-in-out infinite reverse;
        }

        .hp-content { position:relative; z-index:1; }

        /* ── NAV ── */
        .nav {
          position:sticky; top:0; z-index:100;
          border-bottom: 1px solid rgba(59,130,246,.15);
          backdrop-filter: blur(20px) saturate(1.6);
          background: rgba(11,22,40,.65);
        }
        .nav-inner {
          max-width:1280px; margin:0 auto; padding:0 48px;
          height:70px; display:flex; align-items:center; justify-content:space-between;
        }
        .logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
        .logo-mark {
          width:40px; height:40px; border-radius:10px;
          background: linear-gradient(135deg, var(--b500), var(--b700));
          box-shadow: 0 4px 20px rgba(59,130,246,.45);
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
        }
        .logo-mark::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
        }
        .logo-name {
          font-family:'Syne',sans-serif; font-size:1.25rem; font-weight:800;
          color:#fff; letter-spacing:-.02em;
        }
        .logo-tag {
          font-size:.62rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
          color:var(--b300); background:rgba(59,130,246,.12);
          border:1px solid rgba(59,130,246,.25); padding:3px 9px; border-radius:20px;
        }
        .nav-right { display:flex; align-items:center; gap:20px; }
        .nav-status { display:flex; align-items:center; gap:8px; font-size:.8rem; color:var(--b300); font-weight:500; }
        .dot-live { width:7px; height:7px; border-radius:50%; background:#34d399; position:relative; }
        .dot-live::after {
          content:''; position:absolute; inset:-3px; border-radius:50%;
          background:#34d399; animation:pulse-ring 2s ease-out infinite;
        }
        .nav-cta {
          font-size:.82rem; font-weight:600; padding:9px 22px;
          border-radius:8px; border:1.5px solid rgba(59,130,246,.35);
          color:var(--b300); background:transparent; cursor:pointer;
          transition:all .2s; font-family:'DM Sans',sans-serif;
        }
        .nav-cta:hover { background:rgba(59,130,246,.12); border-color:var(--b400); color:#fff; }

        /* ── HERO ── */
        .hero {
          max-width:1280px; margin:0 auto;
          padding:100px 48px 88px;
          display:grid; grid-template-columns:1fr 460px; gap:80px; align-items:center;
        }

        .eyebrow {
          display:inline-flex; align-items:center; gap:8px; margin-bottom:28px;
          font-size:.72rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
          color:var(--b300); background:rgba(59,130,246,.1);
          border:1px solid rgba(59,130,246,.22); padding:6px 14px; border-radius:20px;
        }
        .eyebrow-pip { width:5px; height:5px; border-radius:50%; background:var(--b400); }

        .hero-h1 {
          font-family:'Syne',sans-serif;
          font-size:clamp(3rem,5.5vw,4.4rem);
          font-weight:800; line-height:1.07; letter-spacing:-.03em;
          color:#fff; margin-bottom:24px;
        }
        .hero-h1 em {
          font-style:normal;
          background: linear-gradient(100deg, #93c5fd, #3b82f6, #1d4ed8);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .hero-p {
          font-size:1.08rem; line-height:1.78; color:var(--b200);
          max-width:480px; margin-bottom:48px; font-weight:300;
        }

        .hero-btns { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:60px; }

        .btn-main {
          display:inline-flex; align-items:center; gap:10px;
          padding:15px 34px; border-radius:10px; border:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:700;
          color:#fff; text-decoration:none;
          background: linear-gradient(135deg, var(--b500), var(--b700));
          box-shadow: 0 8px 32px rgba(37,99,235,.5);
          transition:transform .2s, box-shadow .2s;
        }
        .btn-main:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(37,99,235,.65); }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 28px; border-radius:10px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:600;
          color:var(--b300); background:transparent; text-decoration:none;
          border:1.5px solid rgba(59,130,246,.3);
          transition:all .2s;
        }
        .btn-ghost:hover { background:rgba(59,130,246,.1); border-color:var(--b400); color:#fff; }

        /* Stats */
        .stats { display:flex; gap:0; }
        .stat { padding:0 32px 0 0; }
        .stat:first-child { padding-left:0; }
        .stat + .stat { border-left:1px solid rgba(59,130,246,.2); padding-left:32px; }
        .stat-n {
          font-family:'Syne',sans-serif; font-size:2rem; font-weight:800;
          background:linear-gradient(90deg, #fff 30%, var(--b300));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; line-height:1;
        }
        .stat-l { font-size:.75rem; color:var(--b400); font-weight:500; margin-top:5px; }

        /* ── LOGIN PANEL ── */
        .panel-wrap {
          position:relative;
          animation: ${mounted ? 'fadeIn .5s ease both' : 'none'};
        }

        /* Decorative ring */
        .panel-ring {
          position:absolute; inset:-24px; border-radius:28px; z-index:0;
          border:1px solid rgba(59,130,246,.12);
          background: conic-gradient(from 180deg at 50% 50%,
            rgba(59,130,246,.08) 0deg,
            rgba(29,78,216,.15) 120deg,
            rgba(59,130,246,.05) 240deg,
            rgba(59,130,246,.08) 360deg);
          animation: spin-slow 20s linear infinite;
        }

        .login-panel {
          position:relative; z-index:1;
          background: rgba(255,255,255,.04);
          border:1px solid rgba(59,130,246,.22);
          border-radius:20px;
          backdrop-filter:blur(24px);
          box-shadow:
            0 32px 80px rgba(0,0,0,.5),
            inset 0 1px 0 rgba(255,255,255,.07),
            0 0 0 1px rgba(59,130,246,.05);
          overflow:hidden;
        }

        /* Gloss line at top */
        .panel-gloss {
          height:2px;
          background: linear-gradient(90deg, transparent, var(--b500), var(--b300), var(--b500), transparent);
          animation: beam 3s ease-in-out infinite;
        }

        .panel-body { padding:44px 40px 40px; }

        /* Landing state */
        .panel-landing { }
        .panel-avatar {
          width:56px; height:56px; border-radius:14px;
          background:linear-gradient(135deg, var(--b500), var(--b700));
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(37,99,235,.5);
          margin-bottom:24px;
        }
        .panel-h2 {
          font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800;
          color:#fff; letter-spacing:-.02em; margin-bottom:8px;
        }
        .panel-sub { font-size:.88rem; color:var(--b300); margin-bottom:32px; line-height:1.6; }

        .panel-features { list-style:none; margin-bottom:36px; display:flex; flex-direction:column; gap:12px; }
        .panel-feature {
          display:flex; align-items:center; gap:12px;
          font-size:.875rem; color:var(--b200); font-weight:400;
        }
        .pf-check {
          width:22px; height:22px; border-radius:6px; flex-shrink:0;
          background:rgba(59,130,246,.15); border:1px solid rgba(59,130,246,.25);
          display:flex; align-items:center; justify-content:center;
        }

        .btn-access {
          width:100%; padding:15px; border:none; border-radius:10px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:1rem; font-weight:700;
          color:#fff; letter-spacing:.01em;
          background:linear-gradient(135deg, var(--b500), var(--b700));
          box-shadow:0 8px 28px rgba(37,99,235,.45);
          transition:transform .2s, box-shadow .2s;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .btn-access:hover { transform:translateY(-1px); box-shadow:0 12px 36px rgba(37,99,235,.6); }

        .panel-secure {
          display:flex; align-items:center; justify-content:center; gap:8px;
          margin-top:20px; font-size:.75rem; color:var(--b400); font-weight:500;
        }

        /* Login form state */
        .panel-login { animation: cardIn .4s cubic-bezier(.22,1,.36,1) both; }
        .back-btn {
          display:inline-flex; align-items:center; gap:6px;
          font-size:.8rem; color:var(--b400); font-weight:600;
          cursor:pointer; background:none; border:none;
          font-family:'DM Sans',sans-serif; margin-bottom:24px;
          transition:color .2s; padding:0;
        }
        .back-btn:hover { color:var(--b200); }

        .login-label { font-size:.68rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--b500); margin-bottom:6px; }
        .login-h2 {
          font-family:'Syne',sans-serif; font-size:1.55rem; font-weight:800;
          color:#fff; margin-bottom:4px;
        }
        .login-sub { font-size:.85rem; color:var(--b300); margin-bottom:32px; }

        /* Override form styles that come from AdminLoginForm */
        .panel-login :global(input) {
          background: rgba(255,255,255,.06) !important;
          border: 1px solid rgba(59,130,246,.22) !important;
          border-radius: 8px !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .panel-login :global(input:focus) {
          border-color: var(--b500) !important;
          background: rgba(59,130,246,.08) !important;
          outline: none !important;
        }
        .panel-login :global(button[type="submit"]) {
          background: linear-gradient(135deg, var(--b500), var(--b700)) !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          box-shadow: 0 6px 24px rgba(37,99,235,.4) !important;
        }
        .panel-login :global(label) { color: var(--b200) !important; }

        .divider { display:flex; align-items:center; gap:12px; margin:24px 0; }
        .div-line { flex:1; height:1px; background:rgba(59,130,246,.15); }
        .div-txt { font-size:.72rem; color:var(--b400); font-weight:500; }

        /* ── FEATURES ── */
        .feat-section {
          border-top:1px solid rgba(59,130,246,.1);
          background:rgba(255,255,255,.012);
        }
        .feat-inner {
          max-width:1280px; margin:0 auto; padding:96px 48px;
        }
        .feat-eyebrow { font-size:.68rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--b500); margin-bottom:12px; }
        .feat-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(1.9rem,3.2vw,2.6rem);
          font-weight:800; color:#fff; letter-spacing:-.02em; line-height:1.18;
          margin-bottom:60px;
        }
        .feat-h2 em { font-style:normal; color:var(--b300); }

        .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }

        .feat-card {
          background:rgba(255,255,255,.025);
          border:1px solid rgba(59,130,246,.14);
          border-radius:14px; padding:36px 28px;
          transition:all .25s; position:relative; overflow:hidden;
        }
        .feat-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg, transparent, rgba(59,130,246,.3), transparent);
          opacity:0; transition:opacity .25s;
        }
        .feat-card:hover { background:rgba(59,130,246,.06); border-color:rgba(59,130,246,.3); transform:translateY(-4px); }
        .feat-card:hover::before { opacity:1; }

        .feat-icon {
          width:46px; height:46px; border-radius:10px; margin-bottom:22px;
          background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.2);
          display:flex; align-items:center; justify-content:center;
        }
        .feat-n { font-size:.62rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--b500); margin-bottom:10px; }
        .feat-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800; color:#fff; letter-spacing:-.01em; margin-bottom:10px; }
        .feat-desc { font-size:.875rem; line-height:1.75; color:var(--b300); font-weight:300; }

        /* ── FOOTER ── */
        .footer { border-top:1px solid rgba(59,130,246,.1); }
        .footer-inner {
          max-width:1280px; margin:0 auto; padding:32px 48px;
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;
        }
        .footer-copy { font-size:.8rem; color:var(--b400); }
        .footer-links { display:flex; gap:24px; }
        .footer-lnk { font-size:.78rem; color:var(--b400); text-decoration:none; font-weight:500; transition:color .2s; }
        .footer-lnk:hover { color:var(--b200); }

        /* Animations */
        .a1 { animation:fadeUp .8s cubic-bezier(.22,1,.36,1) .1s both; }
        .a2 { animation:fadeUp .8s cubic-bezier(.22,1,.36,1) .25s both; }
        .a3 { animation:fadeUp .8s cubic-bezier(.22,1,.36,1) .4s both; }
        .a4 { animation:fadeUp .8s cubic-bezier(.22,1,.36,1) .55s both; }
        .a5 { animation:fadeIn 1s ease .3s both; }

        @media (max-width:960px) {
          .hero { grid-template-columns:1fr; padding:64px 24px; }
          .feat-grid { grid-template-columns:1fr; }
          .nav-inner { padding:0 24px; }
          .feat-inner { padding:64px 24px; }
          .footer-inner { padding:28px 24px; }
        }
      `}</style>

      <div className="hp-wrap">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="hp-content">

          {/* NAV */}
          <nav className="nav">
            <div className="nav-inner">
              <a href="/" className="logo">
                <div className="logo-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-6 8-13A8 8 0 004 9c0 7 8 13 8 13z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" stroke="#fff" strokeWidth="1.8"/>
                  </svg>
                </div>
                <span className="logo-name">HopePath</span>
                <span className="logo-tag">Admin</span>
              </a>
              <div className="nav-right">
                <div className="nav-status">
                  <div className="dot-live" />
                  All systems operational
                </div>
                <button className="nav-cta" onClick={() => setShowLogin(true)}>
                  Sign In
                </button>
              </div>
            </div>
          </nav>

          {/* HERO */}
          <section className="hero">
            {/* Left col */}
            <div>
              <div className="eyebrow a1">
                <span className="eyebrow-pip" />
                Administration Console
              </div>

              <h1 className="hero-h1 a2">
                Manage HopePath<br />
                <em>With Full Control</em>
              </h1>

              <p className="hero-p a3">
                The HopePath admin portal gives you complete oversight of counselors,
                users, resources, and platform analytics — all from a single, secure dashboard.
              </p>

              <div className="hero-btns a4">
                <button className="btn-main" onClick={() => setShowLogin(true)}>
                  Access Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <a href="#capabilities" className="btn-ghost">
                  View Capabilities
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </a>
              </div>

              <div className="stats a4">
                {[
                  { n: '500+',  l: 'Users Managed' },
                  { n: '48',    l: 'Active Counselors' },
                  { n: '99.9%', l: 'Uptime SLA' },
                ].map((s, i) => (
                  <div key={s.l} className="stat">
                    <div className="stat-n">{s.n}</div>
                    <div className="stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col — panel */}
            <div className="panel-wrap a5">
              <div className="panel-ring" />
              <div className="login-panel">
                <div className="panel-gloss" />
                <div className="panel-body">

                  {!showLogin ? (
                    /* ── Landing state ── */
                    <div className="panel-landing">
                      <div className="panel-avatar">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" strokeWidth="1.8"/>
                          <path d="M7 11V7a5 5 0 0110 0v4" stroke="#fff" strokeWidth="1.8"/>
                        </svg>
                      </div>
                      <h2 className="panel-h2">Secure Admin Portal</h2>
                      <p className="panel-sub">
                        Restricted access for authorised HopePath administrators only.
                        All sessions are encrypted and monitored.
                      </p>

                      <ul className="panel-features">
                        {[
                          'Full user & counselor management',
                          'Real-time analytics & reporting',
                          'Content library controls',
                          'Community moderation tools',
                        ].map(f => (
                          <li key={f} className="panel-feature">
                            <span className="pf-check">
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="var(--b400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button className="btn-access" onClick={() => setShowLogin(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                        </svg>
                        Sign In to Dashboard
                      </button>

                      <div className="panel-secure">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        256-bit TLS · Session monitored · MFA ready
                      </div>
                    </div>
                  ) : (
                    /* ── Login form state ── */
                    <div className="panel-login">
                      <button className="back-btn" onClick={() => setShowLogin(false)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 12H5M12 5l-7 7 7 7"/>
                        </svg>
                        Back
                      </button>

                      <p className="login-label">Secure Access</p>
                      <h2 className="login-h2">Admin Sign In</h2>
                      <p className="login-sub">Restricted to authorised personnel only</p>

                      {state.requiresTwoFactor ? (
                        <TwoFactorAuth />
                      ) : (
                        <AdminLoginForm />
                      )}

                      <div className="divider">
                        <div className="div-line" />
                        <span className="div-txt">Secured with TLS 1.3</span>
                        <div className="div-line" />
                      </div>

                      <div className="panel-secure">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                        256-bit encrypted · Session monitored
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </section>

          {/* CAPABILITIES */}
          <section className="feat-section" id="capabilities">
            <div className="feat-inner">
              <p className="feat-eyebrow">Admin Capabilities</p>
              <h2 className="feat-h2">Everything You Need to<br /><em>Run the Platform</em></h2>

              <div className="feat-grid">
                {[
                  {
                    n:'01', title:'User Management',
                    desc:'View, approve, suspend, and manage all user accounts. Monitor activity and access patterns across the platform.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
                  },
                  {
                    n:'02', title:'Session Scheduling',
                    desc:'Oversee all counseling bookings, resolve conflicts, and manage availability calendars for every therapist.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                  },
                  {
                    n:'03', title:'Content Library',
                    desc:'Publish, edit, and archive articles, devotionals, and guides. Control visibility and categorisation of all resources.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
                  },
                  {
                    n:'04', title:'Analytics & Reports',
                    desc:'Track engagement, session volumes, and platform health with real-time dashboards and exportable reports.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                  },
                  {
                    n:'05', title:'Community Moderation',
                    desc:'Review flagged posts, manage community groups, and maintain a safe environment for all platform members.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                  },
                  {
                    n:'06', title:'System Settings',
                    desc:'Configure platform features, manage integrations, set notification rules, and control access permissions.',
                    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--b400)" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
                  },
                ].map(f => (
                  <div key={f.n} className="feat-card">
                    <div className="feat-icon">{f.icon}</div>
                    <p className="feat-n">{f.n}</p>
                    <h3 className="feat-title">{f.title}</h3>
                    <p className="feat-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer">
            <div className="footer-inner">
              <span className="footer-copy">&copy; 2025 HopePath by Healing Bridges Inc. Admin use only.</span>
              <div className="footer-links">
                <a href="#" className="footer-lnk">Privacy Policy</a>
                <a href="#" className="footer-lnk">Terms of Use</a>
                <a href="#" className="footer-lnk">Support</a>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}