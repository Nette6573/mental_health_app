'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth as firebaseAuth } from '@/lib/firebase/firebaseClient'
import Image from 'next/image'

// ── Types ──────────────────────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number }

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 18 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  providers: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  clients: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',
  applications: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  faith: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  reports: 'M9 17v-2m3 2v-4m3 4v-6M3 3h18v18H3z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  menu: 'M3 12h18M3 6h18M3 18h18',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  trending: 'M23 6l-9.5 9.5-5-5L1 18',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, change }: {
  label: string; value: string | number; icon: string
  accent: string; change?: string
}) {
  return (
    <div className="stat-card" style={{ '--accent': accent } as any}>
      <div className="stat-icon">
        <Icon path={icon} size={16} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && <div className="stat-change">{change}</div>}
      <style>{`
        .stat-card {
          background: rgba(22,27,34,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          border-radius: 16px 16px 0 0;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.1);
        }
        .stat-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          margin-bottom: 14px;
        }
        .stat-value {
          font-size: 28px; font-weight: 800;
          color: #e6edf3;
          font-family: 'Syne', sans-serif;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px; color: #8b949e; font-weight: 500;
        }
        .stat-change {
          font-size: 11px; color: #10b981; font-weight: 600;
          margin-top: 8px;
        }
      `}</style>
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ children, type = 'blue' }: { children: React.ReactNode; type?: string }) {
  const colors: Record<string, string> = {
    green: 'rgba(16,185,129,0.12) #34d399 rgba(16,185,129,0.25)',
    yellow: 'rgba(245,158,11,0.12) #fbbf24 rgba(245,158,11,0.25)',
    red: 'rgba(239,68,68,0.12) #f87171 rgba(239,68,68,0.25)',
    blue: 'rgba(37,150,190,0.12) #38bdf8 rgba(37,150,190,0.25)',
    purple: 'rgba(139,92,246,0.12) #a78bfa rgba(139,92,246,0.25)',
  }
  const [bg, color, border] = colors[type]?.split(' ') || colors.blue.split(' ')
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 20,
      fontSize: 11.5, fontWeight: 600,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {children}
    </span>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { state, logout } = useAdminAuth()
  const router = useRouter()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [providers, setProviders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')

  // ── Auth guard ──
  useEffect(() => {
    if (!state.isLoading && !state.admin) {
      router.replace('/admin')
    }
  }, [state.isLoading, state.admin, router])

  // ── Fetch real Firestore data ──
  useEffect(() => {
    if (!state.admin) return
    const fetchData = async () => {
      try {
        const [provSnap, userSnap, bookSnap] = await Promise.all([
          getDocs(collection(db, 'providers')),
          getDocs(collection(db, 'users')),
          getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(10))),
        ])
        setProviders(provSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setUsers(userSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setBookings(bookSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error('Dashboard fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [state.admin])

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icon path={icons.dashboard} size={16} /> },
    { id: 'providers', label: 'Providers', icon: <Icon path={icons.providers} size={16} />, badge: providers.filter((p: any) => !p.verified).length || undefined },
    { id: 'clients', label: 'Clients', icon: <Icon path={icons.clients} size={16} /> },
    { id: 'applications', label: 'Applications', icon: <Icon path={icons.applications} size={16} />, badge: bookings.filter((b: any) => b.status === 'pending').length || undefined },
    { id: 'faith', label: 'Faith Resources', icon: <Icon path={icons.faith} size={16} /> },
    { id: 'reports', label: 'Reports', icon: <Icon path={icons.reports} size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Icon path={icons.settings} size={16} /> },
  ]

  const admin = state.admin
  const initials = `${admin?.firstName?.[0] || ''}${admin?.lastName?.[0] || ''}`.toUpperCase() || 'SA'

  const handleResetPassword = async () => {
    if (!admin?.email) return
    setResetLoading(true)
    setResetError('')
    try {
      await sendPasswordResetEmail(firebaseAuth, admin.email)
      setResetSent(true)
    } catch (error: any) {
      setResetError('Failed to send reset email. Please try again.')
      console.error('Reset error:', error)
    } finally {
      setResetLoading(false)
    }
  }

  if (state.isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #2596be', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!admin) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0d1117; color: #c9d1d9; overflow-x: hidden; }
        h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #161b22; }
        ::-webkit-scrollbar-thumb { background: #2a3441; border-radius: 4px; }

        html, body { width: 100%; margin: 0; padding: 0; }
        .layout { display: flex; min-height: 100vh; width: 100%; }

        /* Sidebar */
        .sidebar {
          width: 240px; min-height: 100vh;
          background: #0d1117;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: fixed; top: 0; left: 0; z-index: 50;
          display: flex; flex-direction: column;
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }
        .sidebar-logo {
          padding: 20px 18px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 10px;
        }
        .logo-img-wrap {
          width: 36px; height: 36px; border-radius: 10px; overflow: hidden;
          background: rgba(37,150,190,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: #e6edf3; }
        .logo-sub { font-size: 10px; color: #2596be; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

        .nav-section-label {
          padding: 16px 18px 6px;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(139,148,158,0.5);
        }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; margin: 1px 8px;
          border-radius: 10px; cursor: pointer;
          font-size: 13px; font-weight: 500; color: #8b949e;
          text-decoration: none;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: #c9d1d9; }
        .nav-item.active {
          background: rgba(37,150,190,0.08);
          color: #2596be;
          border-color: rgba(37,150,190,0.15);
        }
        .nav-badge {
          margin-left: auto;
          background: #ef4444; color: white;
          font-size: 10px; font-weight: 700;
          padding: 1px 6px; border-radius: 20px;
          font-family: 'Syne', sans-serif;
          min-width: 18px; text-align: center;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 12px 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .admin-profile {
          display: flex; align-items: center; gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .admin-avatar {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(37,150,190,0.15);
          border: 1px solid rgba(37,150,190,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #2596be;
          font-family: 'Syne', sans-serif; flex-shrink: 0;
        }
        .admin-name { font-size: 13px; font-weight: 600; color: #e6edf3; line-height: 1.2; }
        .admin-role { font-size: 10.5px; color: #8b949e; margin-top: 1px; }
        .logout-btn {
          margin-left: auto; padding: 5px;
          border-radius: 7px; background: none; border: none;
          color: #8b949e; cursor: pointer;
          display: flex; align-items: center;
          transition: color 0.15s, background 0.15s;
        }
        .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }

        /* Main */
        .main {
          margin-left: 240px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: calc(100% - 240px);
          min-width: 0;
          overflow-x: hidden;
        }

        /* Topbar */
        .topbar {
          height: 56px;
          background: rgba(13,17,23,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0 24px;
          display: flex; align-items: center; gap: 14px;
          position: sticky; top: 0; z-index: 40;
        }
        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; color: #e6edf3;
          flex: 1;
        }
        .search-wrap {
          position: relative;
          display: flex; align-items: center;
        }
        .search-icon { position: absolute; left: 10px; color: #8b949e; pointer-events: none; }
        .search-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          padding: 7px 14px 7px 32px;
          font-size: 13px; color: #c9d1d9;
          outline: none; width: 200px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, width 0.2s;
        }
        .search-input::placeholder { color: #8b949e; }
        .search-input:focus { border-color: rgba(37,150,190,0.4); width: 240px; }
        .topbar-btn {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: #8b949e; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s, background 0.15s;
        }
        .topbar-btn:hover { color: #c9d1d9; background: rgba(255,255,255,0.07); }
        .live-indicator {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #10b981; font-weight: 600;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Page content */
        .page { padding: 24px; flex: 1; width: 100%; box-sizing: border-box; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 20px; font-weight: 800; color: #e6edf3; margin-bottom: 3px; }
        .page-sub { font-size: 13px; color: #8b949e; }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 22px;
          width: 100%;
        }

        /* Panel */
        .panel {
          background: rgba(22,27,34,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .panel-title { font-size: 13px; font-weight: 700; color: #e6edf3; }
        .panel-sub { font-size: 11.5px; color: #8b949e; margin-top: 2px; }

        /* Table */
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          text-align: left; padding: 11px 16px;
          font-size: 10.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #8b949e;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .data-table td {
          padding: 12px 16px; font-size: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: #c9d1d9;
          transition: background 0.1s;
        }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }

        /* Avatar */
        .avatar {
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700;
          font-family: 'Syne', sans-serif; flex-shrink: 0;
        }

        /* Bar */
        .bar-track { background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

        /* Grid layout for panels */
        .panels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
          width: 100%;
        }
        .panels-grid-3 {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
          width: 100%;
        }

        /* Activity item */
        .activity-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-icon {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .activity-text { font-size: 12.5px; color: #c9d1d9; font-weight: 500; }
        .activity-sub { font-size: 11.5px; color: #8b949e; margin-top: 2px; }
        .activity-time { font-size: 10.5px; color: #8b949e; margin-left: auto; flex-shrink: 0; padding-top: 2px; }

        /* Health bars */
        .health-item { margin-bottom: 14px; }
        .health-label { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12.5px; color: #c9d1d9; }
        .health-val { font-weight: 700; font-family: 'Syne', sans-serif; }

        /* Placeholder page */
        .placeholder-page {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          height: 60vh; gap: 12px; color: #8b949e;
        }
        .placeholder-icon { color: rgba(255,255,255,0.08); margin-bottom: 4px; }
        .placeholder-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #e6edf3; }
        .placeholder-text { font-size: 13px; }

        /* Action button */
        .action-btn {
          padding: 5px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: all 0.15s;
        }
        .action-btn-blue {
          background: rgba(37,150,190,0.1);
          border: 1px solid rgba(37,150,190,0.25);
          color: #2596be;
        }
        .action-btn-blue:hover { background: rgba(37,150,190,0.18); }
        .action-btn-red {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }
        .action-btn-red:hover { background: rgba(239,68,68,0.14); }

        /* Fade in */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.4s ease both; }
        .fade-in-1 { animation-delay: 0.05s; }
        .fade-in-2 { animation-delay: 0.1s; }
        .fade-in-3 { animation-delay: 0.15s; }
        .fade-in-4 { animation-delay: 0.2s; }

        @media (max-width: 1024px) {
          .sidebar { transform: translateX(-240px); }
          .sidebar.open { transform: translateX(0); }
          .main { margin-left: 0; width: 100%; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .panels-grid, .panels-grid-3 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .page { padding: 16px; }
        }

        /* Settings Modal */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: #1c2330;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%; max-width: 440px;
          padding: 28px;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #e6edf3; margin-bottom: 6px;
        }
        .modal-sub { font-size: 13px; color: #8b949e; margin-bottom: 24px; }
        .settings-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 12px;
        }
        .settings-row-label { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .settings-row-sub { font-size: 12px; color: #8b949e; margin-top: 2px; }
        .btn-reset {
          padding: 8px 16px; border-radius: 9px;
          font-size: 13px; font-weight: 600;
          background: rgba(37,150,190,0.1);
          border: 1px solid rgba(37,150,190,0.3);
          color: #2596be; cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-reset:hover { background: rgba(37,150,190,0.2); }
        .btn-reset:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-close {
          width: 100%; padding: 11px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #8b949e;
          font-size: 14px; font-weight: 500;
          cursor: pointer; margin-top: 16px;
          transition: all 0.15s;
        }
        .btn-close:hover { border-color: rgba(255,255,255,0.15); color: #c9d1d9; }
        .success-box {
          padding: 12px 16px; border-radius: 10px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          display: flex; align-items: center; gap: 10px;
          margin-top: 12px;
        }
        .error-box {
          padding: 12px 16px; border-radius: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          font-size: 13px; color: #f87171;
          margin-top: 12px;
        }
      `}</style>

      <div className="layout">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }}
          />
        )}

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-logo">
            <div className="logo-img-wrap">
              <img
                src="/provider-dashboard/images/hopepath.png"
                alt="HopePath"
                width={28} height={28}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            </div>
            <div>
              <div className="logo-text">HopePath</div>
              <div className="logo-sub">Admin Console</div>
            </div>
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            <div className="nav-section-label">Overview</div>
            {navItems.slice(0, 1).map(item => (
              <button key={item.id}
                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: activePage === item.id ? '1px solid rgba(37,150,190,0.15)' : '1px solid transparent' }}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              >
                {item.icon}{item.label}
              </button>
            ))}

            <div className="nav-section-label">Management</div>
            {navItems.slice(1, 4).map(item => (
              <button key={item.id}
                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: activePage === item.id ? '1px solid rgba(37,150,190,0.15)' : '1px solid transparent' }}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              >
                {item.icon}{item.label}
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            ))}

            <div className="nav-section-label">Platform</div>
            {navItems.slice(4).map(item => (
              <button key={item.id}
                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: activePage === item.id ? '1px solid rgba(37,150,190,0.15)' : '1px solid transparent' }}
                onClick={() => {
                  if (item.id === 'settings') {
                    setShowSettingsModal(true)
                    setSidebarOpen(false)
                  } else {
                    setActivePage(item.id)
                    setSidebarOpen(false)
                  }
                }}
              >
                {item.icon}{item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="admin-profile">
              <div className="admin-avatar">{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="admin-name">{admin.firstName} {admin.lastName}</div>
                <div className="admin-role">{admin.role || 'Admin'}</div>
              </div>
              <button className="logout-btn" onClick={logout} title="Sign out">
                <Icon path={icons.logout} size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────── */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <button className="topbar-btn" onClick={() => setSidebarOpen(p => !p)} style={{ display: 'none' }}
              // show on mobile via inline override
            >
              <Icon path={icons.menu} size={16} />
            </button>
            <div className="topbar-title">
              {navItems.find(n => n.id === activePage)?.label || 'Dashboard'}
            </div>
            <div className="search-wrap">
              <span className="search-icon"><Icon path={icons.search} size={14} /></span>
              <input
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="live-indicator">
              <div className="live-dot" />
              Live
            </div>
          </header>

          {/* ── DASHBOARD PAGE ───────────────────────────────────── */}
          {activePage === 'dashboard' && (
            <div className="page fade-in">
              <div className="page-header">
                <div className="page-title">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {admin.firstName}</div>
                <div className="page-sub">Here's what's happening on HopePath today.</div>
              </div>

              {/* Stats */}
              <div className="stats-grid fade-in fade-in-1">
                <StatCard label="Active Providers" value={loading ? '—' : providers.length} icon={icons.providers} accent="#2596be" change="+12% this month" />
                <StatCard label="Registered Clients" value={loading ? '—' : users.length} icon={icons.clients} accent="#10b981" change="+8% this month" />
                <StatCard label="Pending Bookings" value={loading ? '—' : bookings.filter((b: any) => b.status === 'pending').length} icon={icons.applications} accent="#f59e0b" />
                <StatCard label="Flagged Items" value="0" icon={icons.flag} accent="#ef4444" />
              </div>

              {/* Row 2 */}
              <div className="panels-grid-3 fade-in fade-in-2">

                {/* Recent Bookings */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="panel-title">Recent Bookings</div>
                      <div className="panel-sub">Latest appointment requests</div>
                    </div>
                    <Badge type="yellow">{bookings.filter((b: any) => b.status === 'pending').length} pending</Badge>
                  </div>
                  {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>Loading...</div>
                  ) : bookings.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>No bookings yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Provider</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 6).map((b: any) => (
                            <tr key={b.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div className="avatar" style={{ background: 'rgba(37,150,190,0.1)', color: '#2596be', border: '1px solid rgba(37,150,190,0.2)' }}>
                                    {b.userName?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                  <span style={{ fontWeight: 500, color: '#e6edf3' }}>{b.userName || 'User'}</span>
                                </div>
                              </td>
                              <td style={{ color: '#8b949e' }}>{b.providerName}</td>
                              <td style={{ color: '#8b949e', fontSize: 12 }}>{b.date?.split(',')[0]}</td>
                              <td style={{ color: '#8b949e' }}>{b.time}</td>
                              <td>
                                <Badge type={b.status === 'pending' ? 'yellow' : b.status === 'confirmed' ? 'green' : 'red'}>
                                  {b.status || 'pending'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* System Health */}
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">System Health</div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    {[
                      { label: 'Server Uptime', value: '99.9%', color: '#10b981', pct: 99.9 },
                      { label: 'Database Load', value: '42%', color: '#2596be', pct: 42 },
                      { label: 'API Response', value: '68%', color: '#f59e0b', pct: 68 },
                      { label: 'Storage', value: '31%', color: '#8b5cf6', pct: 31 },
                    ].map(h => (
                      <div key={h.label} className="health-item">
                        <div className="health-label">
                          <span>{h.label}</span>
                          <span className="health-val" style={{ color: h.color }}>{h.value}</span>
                        </div>
                        <div className="bar-track" style={{ height: 5 }}>
                          <div className="bar-fill" style={{ height: 5, width: `${h.pct}%`, background: h.color }} />
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon path={icons.shield} size={16} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>All Systems Operational</div>
                        <div style={{ fontSize: 11, color: '#8b949e', marginTop: 1 }}>Last checked: just now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="panels-grid fade-in fade-in-3">

                {/* Providers List */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="panel-title">Providers</div>
                      <div className="panel-sub">{providers.length} registered on platform</div>
                    </div>
                  </div>
                  {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>Loading...</div>
                  ) : providers.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>No providers yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr><th>Provider</th><th>Title</th><th>Parish</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {providers.filter(p => {
                            if (!searchQuery) return true
                            const q = searchQuery.toLowerCase()
                            return (`${p.first_name} ${p.last_name}`).toLowerCase().includes(q) || (p.parish || '').toLowerCase().includes(q)
                          }).slice(0, 6).map((p: any) => (
                            <tr key={p.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {p.profile_photo_url ? (
                                    <img src={p.profile_photo_url} alt="" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} />
                                  ) : (
                                    <div className="avatar" style={{ background: 'rgba(37,150,190,0.1)', color: '#2596be', border: '1px solid rgba(37,150,190,0.2)' }}>
                                      {p.first_name?.[0]?.toUpperCase()}{p.last_name?.[0]?.toUpperCase()}
                                    </div>
                                  )}
                                  <span style={{ fontWeight: 500, color: '#e6edf3' }}>{p.first_name} {p.last_name}</span>
                                </div>
                              </td>
                              <td style={{ color: '#8b949e', fontSize: 12 }}>{p.professional_title || '—'}</td>
                              <td style={{ color: '#8b949e' }}>{p.parish || '—'}</td>
                              <td><Badge type={p.is_accepting_clients ? 'green' : 'red'}>{p.is_accepting_clients ? 'Active' : 'Inactive'}</Badge></td>
                              <td>
                                <div style={{ display: 'flex', gap: 5 }}>
                                  <button className="action-btn action-btn-blue">View</button>
                                  <button className="action-btn action-btn-red">Suspend</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Clients List */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="panel-title">Recent Clients</div>
                      <div className="panel-sub">{users.length} total registered</div>
                    </div>
                  </div>
                  {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>Loading...</div>
                  ) : users.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#8b949e', fontSize: 13 }}>No clients yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr><th>Client</th><th>Email</th><th>Joined</th></tr>
                        </thead>
                        <tbody>
                          {users.slice(0, 6).map((u: any) => (
                            <tr key={u.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div className="avatar" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    {u.firstName?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                  <span style={{ fontWeight: 500, color: '#e6edf3' }}>{u.firstName} {u.lastName}</span>
                                </div>
                              </td>
                              <td style={{ color: '#8b949e', fontSize: 12 }}>{u.email}</td>
                              <td style={{ color: '#8b949e', fontSize: 11.5 }}>{u.joinDate ? new Date(u.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PLACEHOLDER PAGES ────────────────────────────────── */}
          {activePage !== 'dashboard' && (
            <div className="page fade-in">
              <div className="placeholder-page">
                <div className="placeholder-icon">
                  <Icon path={navItems.find(n => n.id === activePage)?.icon as any || icons.dashboard} size={52} />
                </div>
                <div className="placeholder-title">{navItems.find(n => n.id === activePage)?.label}</div>
                <div className="placeholder-text">This section is coming soon.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SETTINGS MODAL ── */}
      {showSettingsModal && (
        <div className="modal-backdrop" onClick={() => { setShowSettingsModal(false); setResetSent(false); setResetError('') }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="modal-title">Settings</div>
              <button
                onClick={() => { setShowSettingsModal(false); setResetSent(false); setResetError('') }}
                style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4, borderRadius: 6 }}
              >
                <Icon path={icons.x} size={16} />
              </button>
            </div>
            <div className="modal-sub">Manage your admin account settings</div>

            {/* Admin Info */}
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,150,190,0.15)', border: '1px solid rgba(37,150,190,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#2596be', fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{admin.firstName} {admin.lastName}</div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{admin.email}</div>
              </div>
            </div>

            {/* Reset Password Row */}
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Reset Password</div>
                <div className="settings-row-sub">Send a password reset link to {admin.email}</div>
              </div>
              <button
                className="btn-reset"
                onClick={handleResetPassword}
                disabled={resetLoading || resetSent}
              >
                {resetLoading ? 'Sending...' : resetSent ? 'Sent ✓' : 'Send Link'}
              </button>
            </div>

            {/* Success message */}
            {resetSent && (
              <div className="success-box">
                <Icon path={icons.mail} size={16} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>Reset link sent!</div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>Check {admin.email} for the password reset link.</div>
                </div>
              </div>
            )}

            {/* Error message */}
            {resetError && <div className="error-box">{resetError}</div>}

            {/* Access ID display */}
            <div className="settings-row" style={{ marginTop: 12 }}>
              <div>
                <div className="settings-row-label">Access ID</div>
                <div className="settings-row-sub">{admin.accessId}</div>
              </div>
              <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: 'rgba(37,150,190,0.1)', color: '#2596be', border: '1px solid rgba(37,150,190,0.2)', fontWeight: 600 }}>Active</span>
            </div>

            <button className="btn-close" onClick={() => { setShowSettingsModal(false); setResetSent(false); setResetError('') }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
