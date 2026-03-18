'use client'

import Link from 'next/link'

export default function AdminLandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-50:  #EFF6FF;
          --blue-100: #DBEAFE;
          --blue-200: #BFDBFE;
          --blue-300: #93C5FD;
          --blue-400: #60A5FA;
          --blue-500: #3B82F6;
          --blue-600: #2563EB;
          --blue-700: #1D4ED8;
          --blue-800: #1E40AF;
          --blue-900: #1E3A5F;
          --blue-950: #0F1F3D;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .a1 { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .a2 { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .a3 { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .a4 { animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .a5 { animation: fadeIn 1.2s ease 0.2s both; }

        .page-wrap {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 60% at 60% -10%, rgba(59,130,246,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 80%, rgba(30,64,175,0.3) 0%, transparent 55%),
            var(--blue-950);
        }

        .page-wrap::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .content { position: relative; z-index: 1; }

        /* -- Nav -- */
        .nav {
          border-bottom: 1px solid rgba(59,130,246,0.15);
          backdrop-filter: blur(16px);
          background: rgba(15,31,61,0.7);
          position: sticky; top: 0; z-index: 50;
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          height: 68px;
        }
        .logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(59,130,246,0.4);
        }
        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem; font-weight: 800;
          color: #fff; letter-spacing: -0.01em;
        }
        .logo-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          background: rgba(59,130,246,0.2);
          color: var(--blue-300);
          border: 1px solid rgba(59,130,246,0.3);
          padding: 2px 8px; border-radius: 20px;
        }
        .nav-status {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.8rem; font-weight: 500;
          color: var(--blue-300);
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34d399; position: relative;
        }
        .status-dot::after {
          content: '';
          position: absolute; inset: -2px; border-radius: 50%;
          background: #34d399;
          animation: pulse-ring 1.8s ease-out infinite;
        }

        /* -- Hero -- */
        .hero {
          max-width: 1200px; margin: 0 auto;
          padding: 96px 40px 80px;
          display: grid; grid-template-columns: 1fr 380px;
          gap: 72px; align-items: center;
        }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--blue-300);
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.25);
          padding: 6px 16px; border-radius: 20px;
          margin-bottom: 28px;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue-400); }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.08;
          color: #fff; letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .hero-title span {
          background: linear-gradient(90deg, var(--blue-300), var(--blue-500));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 1.1rem; line-height: 1.75;
          color: var(--blue-200); font-weight: 400;
          max-width: 500px; margin-bottom: 48px;
        }

        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }

        .btn-primary {
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 600;
          padding: 14px 32px; border: none;
          border-radius: 8px; cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 28px rgba(37,99,235,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(37,99,235,0.6);
        }

        .btn-outline {
          background: transparent; color: var(--blue-300);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 600;
          padding: 13px 28px;
          border: 1.5px solid rgba(59,130,246,0.35);
          border-radius: 8px; cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .btn-outline:hover {
          background: rgba(59,130,246,0.1);
          border-color: var(--blue-400); color: #fff;
        }

        /* -- CTA Card -- */
        .cta-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 16px;
          padding: 48px 40px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 28px;
        }

        .cta-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          display: flex; align-items: center; justify-content: center;
          border-radius: 16px;
          box-shadow: 0 8px 28px rgba(37,99,235,0.5);
        }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem; font-weight: 800;
          color: #fff; margin-bottom: 6px;
        }
        .cta-sub {
          font-size: 0.88rem; color: var(--blue-300);
          font-weight: 400; line-height: 1.65;
        }

        .cta-features {
          list-style: none; width: 100%;
          text-align: left; display: flex;
          flex-direction: column; gap: 11px;
        }
        .cta-feature {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.85rem; color: var(--blue-200); font-weight: 400;
        }
        .cta-check {
          width: 20px; height: 20px; flex-shrink: 0; border-radius: 6px;
          background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.25);
          display: flex; align-items: center; justify-content: center;
        }

        .btn-signin {
          width: 100%;
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 1rem; font-weight: 700;
          padding: 15px 24px; border: none; border-radius: 8px;
          cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 6px 24px rgba(37,99,235,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .btn-signin:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(37,99,235,0.55);
        }

        .cta-secure {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; color: var(--blue-400); font-weight: 500;
        }

        /* -- Stats -- */
        .stats-row { display: flex; gap: 32px; margin-top: 48px; }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem; font-weight: 800; line-height: 1;
          background: linear-gradient(90deg, #fff, var(--blue-300));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 0.78rem; color: var(--blue-400); font-weight: 500; margin-top: 4px; }
        .stat-divider { width: 1px; background: rgba(59,130,246,0.2); align-self: stretch; }

        /* -- Features -- */
        .features {
          border-top: 1px solid rgba(59,130,246,0.12);
          background: rgba(255,255,255,0.015);
        }
        .features-inner { max-width: 1200px; margin: 0 auto; padding: 88px 40px; }
        .section-header { margin-bottom: 56px; }
        .section-eyebrow {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--blue-400); margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 800; color: #fff;
          letter-spacing: -0.02em; line-height: 1.2;
        }
        .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 12px; padding: 36px 32px;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .feature-card:hover {
          background: rgba(59,130,246,0.07);
          border-color: rgba(59,130,246,0.35);
          transform: translateY(-3px);
        }
        .feature-icon {
          width: 48px; height: 48px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .feature-num {
          font-size: 0.66rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--blue-500); margin-bottom: 10px;
        }
        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem; font-weight: 800;
          color: #fff; margin-bottom: 12px; letter-spacing: -0.01em;
        }
        .feature-desc { font-size: 0.9rem; line-height: 1.75; color: var(--blue-300); font-weight: 400; }

        /* -- Footer -- */
        .footer { border-top: 1px solid rgba(59,130,246,0.12); }
        .footer-inner {
          max-width: 1200px; margin: 0 auto; padding: 36px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { font-size: 0.82rem; color: var(--blue-400); font-weight: 400; }
        .footer-links { display: flex; gap: 28px; }
        .footer-link {
          font-size: 0.78rem; color: var(--blue-400); text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--blue-200); }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="content">

          {/* -- Nav -- */}
          <nav className="nav">
            <div className="nav-inner">
              <a href="/" className="logo">
                <div className="logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-6 8-13A8 8 0 004 9c0 7 8 13 8 13z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" stroke="#fff" strokeWidth="1.8"/>
                  </svg>
                </div>
                <span className="logo-text">HopePath</span>
                <span className="logo-badge">Admin Portal</span>
              </a>
              <div className="nav-status">
                <div className="status-dot" />
                System Operational
              </div>
            </div>
          </nav>

          {/* -- Hero -- */}
          <section className="hero">

            {/* Left col */}
            <div>
              <div className="eyebrow a1">
                <span className="eyebrow-dot" />
                Administration Console
              </div>
              <h1 className="hero-title a2">
                Manage HopePath<br />
                <span>With Full Control</span>
              </h1>
              <p className="hero-desc a3">
                The HopePath admin portal gives you complete oversight of counselors, users, resources, and platform analytics — all from a single, secure dashboard.
              </p>
              <div className="hero-actions a4">
                <Link href="/login" className="btn-primary">
                  Access Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <a href="#capabilities" className="btn-outline">
                  View Capabilities
                </a>
              </div>

              {/* Stats */}
              <div className="stats-row a4">
                {[
                  { num: '500+',  label: 'Users Managed' },
                  { num: '48',    label: 'Active Counselors' },
                  { num: '99.9%', label: 'Uptime' },
                ].map((s, i) => (
                  <>
                    {i > 0 && <div key={`d${i}`} className="stat-divider" />}
                    <div key={s.label} className="stat">
                      <div className="stat-num">{s.num}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* CTA Card — no form, just a portal entry point */}
            <div className="cta-card a3">
              <div className="cta-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" strokeWidth="1.8"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#fff" strokeWidth="1.8"/>
                </svg>
              </div>

              <div>
                <h2 className="cta-title">Admin Portal</h2>
                <p className="cta-sub">
                  Restricted to authorised personnel only.<br />
                  All sessions are encrypted and monitored.
                </p>
              </div>

              <ul className="cta-features">
                {[
                  'Full user & counselor management',
                  'Real-time analytics & reporting',
                  'Content library controls',
                  'Community moderation tools',
                ].map(f => (
                  <li key={f} className="cta-feature">
                    <span className="cta-check">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="var(--blue-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/login" className="btn-signin">
                Sign In to Dashboard
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              <div className="cta-secure">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                256-bit TLS · Session monitored · MFA ready
              </div>
            </div>

          </section>

          {/* -- Capabilities -- */}
          <section className="features" id="capabilities">
            <div className="features-inner">
              <div className="section-header">
                <p className="section-eyebrow">Admin Capabilities</p>
                <h2 className="section-title">Everything You Need<br />to Run the Platform</h2>
              </div>

              <div className="feature-grid">
                {[
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
                    num: '01', title: 'User Management',
                    desc: 'View, approve, suspend, and manage all user accounts. Monitor activity and access patterns across the platform.',
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                    num: '02', title: 'Session Scheduling',
                    desc: 'Oversee all counseling bookings, resolve conflicts, and manage availability calendars for every therapist.',
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
                    num: '03', title: 'Content Library',
                    desc: 'Publish, edit, and archive articles, devotionals, and guides. Control visibility and categorisation of all resources.',
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                    num: '04', title: 'Analytics & Reports',
                    desc: 'Track engagement, session volumes, and platform health with real-time dashboards and exportable reports.',
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                    num: '05', title: 'Community Moderation',
                    desc: 'Review flagged posts, manage community groups, and maintain a safe environment for all platform members.',
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-400)" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
                    num: '06', title: 'System Settings',
                    desc: 'Configure platform features, manage integrations, set notification rules, and control access permissions.',
                  },
                ].map((f) => (
                  <div key={f.num} className="feature-card">
                    <div className="feature-icon">{f.icon}</div>
                    <p className="feature-num">{f.num}</p>
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* -- Footer -- */}
          <footer className="footer">
            <div className="footer-inner">
              <span className="footer-copy">&copy; 2025 HopePath by Healing Bridges Inc. Admin use only.</span>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Use</a>
                <a href="#" className="footer-link">Support</a>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}