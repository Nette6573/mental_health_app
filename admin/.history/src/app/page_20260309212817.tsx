'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Georgia', serif" }} className="min-h-screen bg-[#FAF7F2] text-[#1C1A17]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FAF7F2; }

        .fd { font-family: 'Cormorant Garamond', Georgia, serif; }
        .fs { font-family: 'Jost', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .a1 { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .a2 { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .a3 { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .a4 { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .aline { animation: lineGrow 1.2s cubic-bezier(.22,1,.36,1) 0.5s both; transform-origin: left; }

        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.09); }
        .card { transition: transform 0.3s ease, box-shadow 0.3s ease; }

        .btn-p {
          background: #2C5F4A; color: #FAF7F2;
          font-family: 'Jost', sans-serif; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.78rem;
          padding: 14px 32px; border: none; cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .btn-p:hover { background: #1e4434; transform: translateX(2px); }

        .btn-g {
          background: transparent; color: #2C5F4A;
          font-family: 'Jost', sans-serif; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.78rem;
          padding: 13px 32px; border: 1.5px solid #2C5F4A; cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .btn-g:hover { background: #2C5F4A; color: #FAF7F2; }

        .nav-a {
          font-family: 'Jost', sans-serif; font-size: 0.78rem;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #7A7168; text-decoration: none; transition: color 0.2s;
        }
        .nav-a:hover { color: #1C1A17; }

        .label {
          font-family: 'Jost', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.18em; text-transform: uppercase; color: #9C8B78;
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .card-grid  { grid-template-columns: 1fr !important; }
          .cta-row    { flex-direction: column !important; }
          .hero-visual { display: none !important; }
          .footer-row { flex-direction: column !important; gap: 16px !important; text-align: center; }
        }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #E5DDD2', background: '#FAF7F2', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, background: '#2C5F4A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-6 8-13A8 8 0 004 9c0 7 8 13 8 13z" stroke="#FAF7F2" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="#FAF7F2" strokeWidth="1.6"/>
              </svg>
            </div>
            <span className="fd" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1C1A17' }}>HopePath</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <a href="#services" className="nav-a">Services</a>
            <a href="#about" className="nav-a">About</a>
            <Link href="/admin/login" className="nav-a">Admin</Link>
            <Link href="/auth/login" className="btn-p" style={{ padding: '10px 22px', fontSize: '0.72rem' }}>Sign In</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '100px 32px 80px' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          <div>
            <p className="label a1" style={{ marginBottom: 24 }}>Faith-Centered Mental Health</p>
            <h1 className="fd a2" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 300, lineHeight: 1.12, color: '#1C1A17', marginBottom: 28 }}>
              Where Healing<br />
              <em style={{ color: '#2C5F4A', fontStyle: 'italic' }}>Meets Hope</em>
            </h1>
            <div className="aline" style={{ height: 1.5, background: '#C4A882', width: 64, marginBottom: 28 }} />
            <p className="fs a3" style={{ fontSize: '1rem', lineHeight: 1.85, color: '#5a5650', fontWeight: 300, maxWidth: 420, marginBottom: 44 }}>
              A sanctuary where professional counseling and faith-based support converge — providing resources, community, and licensed therapists who truly understand your journey.
            </p>
            <div className="a4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/auth/login" className="btn-p">
                Begin Your Journey
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/admin/login" className="btn-g">Admin Dashboard</Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hero-visual" style={{ position: 'relative' }}>
            <div style={{ background: '#2C5F4A', padding: '52px 48px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
              <p className="fs" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>Our Promise</p>
              <blockquote className="fd" style={{ fontSize: '1.55rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.55, color: '#FAF7F2', marginBottom: 32 }}>
                "He heals the brokenhearted and binds up their wounds."
              </blockquote>
              <p className="fs" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>— Psalm 147:3</p>
            </div>
            <div style={{ position: 'absolute', bottom: -28, left: -28, background: '#FAF7F2', border: '1px solid #E5DDD2', padding: '20px 28px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', minWidth: 200 }}>
              <p className="fd" style={{ fontSize: '2.4rem', fontWeight: 600, color: '#2C5F4A', lineHeight: 1 }}>500+</p>
              <p className="fs" style={{ color: '#9C8B78', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Lives Supported</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #E5DDD2' }} />
      </div>

      {/* ── Services ─────────────────────────────────────────── */}
      <section id="services" style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="label" style={{ marginBottom: 16 }}>What We Offer</p>
          <h2 className="fd" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 300, color: '#1C1A17', lineHeight: 1.2 }}>
            Comprehensive Care for<br /><em style={{ color: '#2C5F4A' }}>Mind, Soul & Spirit</em>
          </h2>
        </div>

        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C5F4A" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
              num: '01', title: 'Licensed Counselors',
              desc: 'Certified therapists who integrate spiritual and clinical approaches to healing, tailored to your beliefs and background.',
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C5F4A" strokeWidth="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
              num: '02', title: 'Resource Library',
              desc: 'Curated articles, devotionals, and evidence-based guides supporting your mental health journey through a lens of faith.',
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C5F4A" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
              num: '03', title: 'Support Community',
              desc: 'A safe, moderated space to share experiences, find encouragement, and grow alongside others on a similar path.',
            },
          ].map((item, i) => (
            <div key={i} className="card" style={{ background: '#FFFFFF', padding: '48px 40px', border: '1px solid #E5DDD2', borderLeft: i > 0 ? 'none' : '1px solid #E5DDD2' }}>
              <div style={{ marginBottom: 28 }}>{item.icon}</div>
              <p className="fs" style={{ fontSize: '0.66rem', letterSpacing: '0.18em', color: '#C4A882', textTransform: 'uppercase', marginBottom: 12 }}>{item.num}</p>
              <h3 className="fd" style={{ fontSize: '1.4rem', fontWeight: 500, color: '#1C1A17', marginBottom: 14 }}>{item.title}</h3>
              <p className="fs" style={{ fontSize: '0.9rem', lineHeight: 1.85, color: '#7A7168', fontWeight: 300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ background: '#F2EDE5', borderTop: '1px solid #E5DDD2', borderBottom: '1px solid #E5DDD2' }}>
        <div className="cta-row" style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <p className="label" style={{ marginBottom: 12 }}>Ready to Start?</p>
            <h2 className="fd" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, color: '#1C1A17', lineHeight: 1.2 }}>
              Take the First Step<br />Toward Healing Today
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/auth/login" className="btn-p">
              Create Account
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/admin/login" className="btn-g">Admin Login</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ background: '#1C1A17' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 32px' }}>
          <div className="footer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, background: '#2C5F4A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-6 8-13A8 8 0 004 9c0 7 8 13 8 13z" stroke="#FAF7F2" strokeWidth="1.6" strokeLinejoin="round"/>
                  <circle cx="12" cy="9" r="2.5" stroke="#FAF7F2" strokeWidth="1.6"/>
                </svg>
              </div>
              <span className="fd" style={{ color: '#FAF7F2', fontSize: '1.1rem', fontWeight: 500 }}>HopePath</span>
            </div>
            <p className="fs" style={{ color: '#4a4845', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
              © 2025 HopePath by Healing Bridges Inc. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 28 }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" className="fs" style={{ color: '#4a4845', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}