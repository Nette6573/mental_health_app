'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import {
  collection, getDocs, doc, getDoc,
  updateDoc, serverTimestamp, query, where
} from 'firebase/firestore'

const Icon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

const icons = {
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  x: 'M18 6L6 18M6 6l12 12',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  unlock: 'M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  back: 'M19 12H5M12 5l-7 7 7 7',
  check: 'M20 6L9 17l-5-5',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
}

function Badge({ children, type = 'blue' }: { children: React.ReactNode; type?: string }) {
  const styles: Record<string, any> = {
    green: { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' },
    red: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
    yellow: { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
    blue: { background: 'rgba(37,150,190,0.1)', color: '#38bdf8', border: '1px solid rgba(37,150,190,0.2)' },
    purple: { background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' },
  }
  return (
    <span style={{ ...styles[type], display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
      {children}
    </span>
  )
}

export default function AdminProvidersPage() {
  const { state } = useAdminAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [drawerData, setDrawerData] = useState<any>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!state.isLoading && !state.admin) router.replace('/admin')
  }, [state.isLoading, state.admin, router])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const snap = await getDocs(collection(db, 'providers'))
        setProviders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const openDrawer = async (provider: any) => {
    setSelectedProvider(provider)
    setDrawerData(null)
    setDrawerLoading(true)
    setActiveTab('overview')
    setActionMsg('')
    setConfirmDelete(false)

    console.log('=== OPENING DRAWER ===')
    console.log('Provider ID:', provider.id)
    console.log('Provider name:', provider.first_name, provider.last_name)

    try {
      // Fetch each one individually so we can log which ones fail
      let availData = null
      let servicesData: any[] = []
      let settingsData = null

      // 1. Availability
      try {
        const availSnap = await getDoc(doc(db, 'provider_availability', provider.id))
        console.log('provider_availability exists:', availSnap.exists())
        if (availSnap.exists()) {
          availData = availSnap.data()
          console.log('Availability data keys:', Object.keys(availData || {}))
          console.log('Availability data:', JSON.stringify(availData))
        }
      } catch (e) {
        console.error('Availability fetch error:', e)
      }

      // 2. Services
      try {
        const servicesQuery = query(
          collection(db, 'provider_services'),
          where('provider_id', '==', provider.id)
        )
        const servicesSnap = await getDocs(servicesQuery)
        console.log('provider_services count:', servicesSnap.size)
        servicesSnap.docs.forEach((d, i) => {
          console.log(`Service ${i}:`, JSON.stringify(d.data()))
        })
        servicesData = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (e) {
        console.error('Services fetch error:', e)
      }

      // 3. Settings
      try {
        const settingsSnap = await getDoc(doc(db, 'provider_settings', provider.id))
        console.log('provider_settings exists:', settingsSnap.exists())
        if (settingsSnap.exists()) {
          settingsData = settingsSnap.data()
          console.log('Settings data:', JSON.stringify(settingsData))
        }
      } catch (e) {
        console.error('Settings fetch error:', e)
      }

      console.log('=== DRAWER DATA SET ===')
      setDrawerData({
        availability: availData,
        services: servicesData,
        settings: settingsData,
      })
    } catch (e) {
      console.error('Drawer fetch error:', e)
    } finally {
      setDrawerLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!selectedProvider) return
    setActionLoading('disable')
    try {
      const res = await fetch('/api/admin/disable-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: selectedProvider.id, disable: !selectedProvider.disabled }),
      })
      const data = await res.json()
      if (data.success) {
        setProviders(prev => prev.map(p => p.id === selectedProvider.id ? { ...p, disabled: !p.disabled } : p))
        setSelectedProvider((prev: any) => ({ ...prev, disabled: !prev.disabled }))
        setActionMsg(selectedProvider.disabled ? 'Account enabled successfully.' : 'Account disabled successfully.')
      }
    } catch (e) {
      setActionMsg('Failed to update account status.')
    } finally {
      setActionLoading('')
    }
  }

  const handleDelete = async () => {
    if (!selectedProvider) return
    setActionLoading('delete')
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: selectedProvider.id }),
      })
      const data = await res.json()
      if (data.success) {
        setProviders(prev => prev.filter(p => p.id !== selectedProvider.id))
        setSelectedProvider(null)
      }
    } catch (e) {
      setActionMsg('Failed to delete account.')
    } finally {
      setActionLoading('')
      setConfirmDelete(false)
    }
  }

  const handleResetPassword = async () => {
    if (!selectedProvider?.professional_email) return
    setActionLoading('reset')
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedProvider.professional_email }),
      })
      const data = await res.json()
      if (data.success) setActionMsg('Password reset email sent to provider.')
      else setActionMsg('Failed to send reset email.')
    } catch (e) {
      setActionMsg('Failed to send reset email.')
    } finally {
      setActionLoading('')
    }
  }

  const decodeDay = (raw: string) => {
    if (!raw) return null
    const [avail, start, end] = raw.split('|')
    return avail === '1' ? `${start} – ${end}` : null
  }

  const filtered = providers.filter(p => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (`${p.first_name} ${p.last_name}`).toLowerCase().includes(q) ||
      (p.professional_title || '').toLowerCase().includes(q) ||
      (p.parish || '').toLowerCase().includes(q)
  })

  if (!state.admin) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #0d1117; color: #c9d1d9; }

        .page { padding: 24px; width: 100%; }
        .page-header { margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #e6edf3; }
        .page-sub { font-size: 13px; color: #8b949e; margin-top: 3px; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #8b949e; cursor: pointer; font-size: 13px;
          font-weight: 500; transition: all 0.15s;
          margin-bottom: 16px;
          font-family: 'DM Sans', sans-serif;
        }
        .back-btn:hover { background: rgba(255,255,255,0.07); color: #c9d1d9; border-color: rgba(255,255,255,0.12); }

        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 10px; color: #8b949e; pointer-events: none; }
        .search-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 14px 8px 34px; font-size: 13px; color: #c9d1d9; outline: none; width: 240px; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
        .search-input::placeholder { color: #8b949e; }
        .search-input:focus { border-color: rgba(37,150,190,0.4); }

        .panel { background: rgba(22,27,34,0.9); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 11px 16px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8b949e; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .data-table td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #c9d1d9; vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); cursor: pointer; }

        .avatar { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
        .avatar-placeholder { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif; flex-shrink: 0; }

        .action-btn { padding: 5px 11px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
        .btn-blue { background: rgba(37,150,190,0.1); border: 1px solid rgba(37,150,190,0.25); color: #2596be; }
        .btn-blue:hover { background: rgba(37,150,190,0.18); }
        .btn-yellow { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fbbf24; }
        .btn-yellow:hover { background: rgba(245,158,11,0.18); }
        .btn-red { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .btn-red:hover { background: rgba(239,68,68,0.14); }
        .btn-green { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #34d399; }
        .btn-green:hover { background: rgba(16,185,129,0.18); }

        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 80; }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 90; width: 520px; max-width: 100vw; background: #161b22; border-left: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; animation: slideInRight 0.25s ease; overflow: hidden; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .drawer-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 14px; background: rgba(13,17,23,0.8); flex-shrink: 0; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 0; }

        .tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(13,17,23,0.5); flex-shrink: 0; overflow-x: auto; }
        .tab { padding: 12px 18px; font-size: 13px; font-weight: 500; color: #8b949e; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; }
        .tab.active { color: #2596be; border-bottom-color: #2596be; }
        .tab:hover:not(.active) { color: #c9d1d9; }

        .drawer-section { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .drawer-section:last-child { border-bottom: none; }
        .section-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #8b949e; margin-bottom: 14px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; }
        .info-item-label { font-size: 10.5px; color: #8b949e; margin-bottom: 4px; font-weight: 500; }
        .info-item-value { font-size: 13px; color: #e6edf3; font-weight: 500; }

        .day-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 13px; }
        .day-row:last-child { border-bottom: none; }

        .service-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
        .service-card:last-child { margin-bottom: 0; }

        .action-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .confirm-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 14px 16px; margin-top: 12px; }
        .confirm-text { font-size: 13px; color: #f87171; margin-bottom: 12px; }
        .confirm-btns { display: flex; gap: 8px; }
        .msg-box { padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-top: 12px; }
        .msg-success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34d399; }
        .msg-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #2596be; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state { padding: 32px 0; text-align: center; color: #8b949e; font-size: 13px; }

        @media (max-width: 640px) {
          .drawer { width: 100vw; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">

        {/* ── Back button ── */}
        <button className="back-btn" onClick={() => router.push('/admin/dashboard')}>
          <Icon path={icons.back} size={14} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">Providers</div>
            <div className="page-sub">{providers.length} registered providers</div>
          </div>
          <div className="search-wrap">
            <span className="search-icon"><Icon path={icons.search} size={14} /></span>
            <input className="search-input" placeholder="Search by name, title, parish..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="panel">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>Loading providers...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>No providers found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Title</th>
                    <th>Parish</th>
                    <th>Experience</th>
                    <th>Session Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p: any) => (
                    <tr key={p.id} onClick={() => openDrawer(p)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.profile_photo_url ? (
                            <img src={p.profile_photo_url} alt="" className="avatar" />
                          ) : (
                            <div className="avatar-placeholder" style={{ background: 'rgba(37,150,190,0.1)', color: '#2596be', border: '1px solid rgba(37,150,190,0.2)' }}>
                              {p.first_name?.[0]}{p.last_name?.[0]}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: '#e6edf3' }}>{p.first_name} {p.last_name}</div>
                            <div style={{ fontSize: 11.5, color: '#8b949e' }}>{p.professional_email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#8b949e' }}>{p.professional_title || '—'}</td>
                      <td style={{ color: '#8b949e' }}>{p.parish || '—'}</td>
                      <td style={{ color: '#8b949e' }}>{p.experience || '—'}</td>
                      <td style={{ color: '#8b949e' }}>{p.session_cost ? `JMD ${p.session_cost}` : '—'}</td>
                      <td>
                        <Badge type={p.disabled ? 'red' : p.is_accepting_clients ? 'green' : 'yellow'}>
                          {p.disabled ? 'Disabled' : p.is_accepting_clients ? 'Active' : 'Not Accepting'}
                        </Badge>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="action-btn btn-blue" onClick={() => openDrawer(p)}>
                          <Icon path={icons.eye} size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── DRAWER ── */}
      {selectedProvider && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedProvider(null)} />
          <div className="drawer">

            <div className="drawer-header">
              {selectedProvider.profile_photo_url ? (
                <img src={selectedProvider.profile_photo_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,150,190,0.12)', border: '1px solid rgba(37,150,190,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#2596be', fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>
                  {selectedProvider.first_name?.[0]}{selectedProvider.last_name?.[0]}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#e6edf3' }}>{selectedProvider.first_name} {selectedProvider.last_name}</div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{selectedProvider.professional_title}</div>
              </div>
              <button onClick={() => setSelectedProvider(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4, borderRadius: 6, flexShrink: 0 }}>
                <Icon path={icons.x} size={16} />
              </button>
            </div>

            <div className="tabs">
              {['overview', 'availability', 'services', 'settings', 'actions'].map(tab => (
                <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="drawer-body">
              {drawerLoading ? (
                <div style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#8b949e' }}>
                  <div className="spinner" /> Loading provider data...
                </div>
              ) : (
                <>
                  {/* OVERVIEW */}
                  {activeTab === 'overview' && (
                    <>
                      <div className="drawer-section">
                        <div className="section-label">Basic Information</div>
                        <div className="info-grid">
                          {[
                            { label: 'Email', value: selectedProvider.professional_email },
                            { label: 'Phone', value: selectedProvider.phone_number },
                            { label: 'Parish', value: selectedProvider.parish },
                            { label: 'Organization', value: selectedProvider.organization },
                            { label: 'Experience', value: selectedProvider.experience },
                            { label: 'License', value: selectedProvider.license },
                            { label: 'Session Cost', value: selectedProvider.session_cost ? `JMD ${selectedProvider.session_cost}` : null },
                            { label: 'Session Types', value: selectedProvider.session_types },
                            { label: 'Payment Options', value: selectedProvider.payment_options },
                            { label: 'Languages', value: Array.isArray(selectedProvider.languages) ? selectedProvider.languages.join(', ') : selectedProvider.languages },
                          ].map(item => item.value ? (
                            <div key={item.label} className="info-item">
                              <div className="info-item-label">{item.label}</div>
                              <div className="info-item-value">{item.value}</div>
                            </div>
                          ) : null)}
                        </div>
                      </div>
                      {selectedProvider.biography && (
                        <div className="drawer-section">
                          <div className="section-label">Biography</div>
                          <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.7 }}>{selectedProvider.biography}</p>
                        </div>
                      )}
                      {Array.isArray(selectedProvider.practice_areas) && selectedProvider.practice_areas.length > 0 && (
                        <div className="drawer-section">
                          <div className="section-label">Practice Areas</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedProvider.practice_areas.map((area: string) => (
                              <Badge key={area} type="blue">{area}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* AVAILABILITY */}
                  {activeTab === 'availability' && (
                    <div className="drawer-section">
                      {!drawerData?.availability ? (
                        <div className="empty-state">No availability data found for this provider.</div>
                      ) : (
                        <>
                          <div className="section-label">Weekly Schedule</div>
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                            const decoded = decodeDay(drawerData.availability[day])
                            return (
                              <div key={day} className="day-row">
                                <span style={{ color: '#c9d1d9', fontWeight: 500, textTransform: 'capitalize' }}>{day}</span>
                                <span style={{ color: decoded ? '#34d399' : '#8b949e' }}>{decoded || 'Unavailable'}</span>
                              </div>
                            )
                          })}

                          <div style={{ marginTop: 20 }}>
                            <div className="section-label">Session Settings</div>
                            <div className="info-grid">
                              {[
                                { label: 'Session Duration', value: drawerData.availability.session_duration },
                                { label: 'Buffer Between Sessions', value: drawerData.availability.buffer_sessions },
                                { label: 'Advance Booking', value: drawerData.availability.advance_booking },
                                { label: 'Future Bookings', value: drawerData.availability.future_bookings },
                              ].map(item => item.value ? (
                                <div key={item.label} className="info-item">
                                  <div className="info-item-label">{item.label}</div>
                                  <div className="info-item-value">{item.value}</div>
                                </div>
                              ) : null)}
                            </div>
                          </div>

                          {drawerData.availability.blocked_dates && (() => {
                            try {
                              const blocked = JSON.parse(drawerData.availability.blocked_dates)
                              if (!blocked.length) return null
                              return (
                                <div style={{ marginTop: 20 }}>
                                  <div className="section-label">Blocked Dates</div>
                                  {blocked.map((b: any, i: number) => (
                                    <div key={i} className="day-row">
                                      <span style={{ color: '#c9d1d9' }}>{b.title}</span>
                                      <span style={{ color: '#f87171' }}>{b.date}</span>
                                    </div>
                                  ))}
                                </div>
                              )
                            } catch { return null }
                          })()}
                        </>
                      )}
                    </div>
                  )}

                  {/* SERVICES */}
                  {activeTab === 'services' && (
                    <div className="drawer-section">
                      <div className="section-label">Services ({drawerData?.services?.length || 0})</div>
                      {!drawerData?.services?.length ? (
                        <div className="empty-state">No services added yet.</div>
                      ) : (
                        drawerData.services.map((s: any) => (
                          <div key={s.id} className="service-card">
                            <div style={{ fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>{s.name || s.service_name || s.title || 'Service'}</div>
                            {s.description && <p style={{ fontSize: 12.5, color: '#8b949e', lineHeight: 1.6, marginBottom: 8 }}>{s.description}</p>}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {s.price && <Badge type="green">JMD {s.price}</Badge>}
                              {s.cost && <Badge type="green">JMD {s.cost}</Badge>}
                              {s.duration && <Badge type="blue">{s.duration}</Badge>}
                              {s.type && <Badge type="purple">{s.type}</Badge>}
                              {s.session_type && <Badge type="purple">{s.session_type}</Badge>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SETTINGS */}
                  {activeTab === 'settings' && (
                    <div className="drawer-section">
                      {!drawerData?.settings ? (
                        <div className="empty-state">No settings data found for this provider.</div>
                      ) : (
                        <>
                          <div className="section-label">Account Settings</div>
                          <div className="info-grid">
                            {[
                              { label: 'Timezone', value: drawerData.settings.timezone },
                              { label: 'Language', value: drawerData.settings.settings_language },
                              { label: 'Email Notifications', value: drawerData.settings.email_notification !== undefined ? (drawerData.settings.email_notification ? 'Enabled' : 'Disabled') : null },
                              { label: 'SMS Notifications', value: drawerData.settings.sms_notification !== undefined ? (drawerData.settings.sms_notification ? 'Enabled' : 'Disabled') : null },
                              { label: 'Appointment Reminders', value: drawerData.settings.appointment_reminders !== undefined ? (drawerData.settings.appointment_reminders ? 'Enabled' : 'Disabled') : null },
                              { label: 'Last Login', value: drawerData.settings.last_login ? new Date(drawerData.settings.last_login).toLocaleString() : null },
                            ].map(item => item.value ? (
                              <div key={item.label} className="info-item">
                                <div className="info-item-label">{item.label}</div>
                                <div className="info-item-value">{item.value}</div>
                              </div>
                            ) : null)}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* ACTIONS */}
                  {activeTab === 'actions' && (
                    <div className="drawer-section">
                      <div className="section-label">Account Actions</div>
                      <div className="action-row">
                        <button
                          className={`action-btn ${selectedProvider.disabled ? 'btn-green' : 'btn-yellow'}`}
                          onClick={handleDisable}
                          disabled={actionLoading === 'disable'}
                        >
                          {actionLoading === 'disable' ? <div className="spinner" /> : <Icon path={selectedProvider.disabled ? icons.unlock : icons.lock} size={12} />}
                          {selectedProvider.disabled ? 'Enable Account' : 'Disable Account'}
                        </button>
                        <button className="action-btn btn-blue" onClick={handleResetPassword} disabled={actionLoading === 'reset'}>
                          {actionLoading === 'reset' ? <div className="spinner" /> : <Icon path={icons.mail} size={12} />}
                          Reset Password
                        </button>
                        <button className="action-btn btn-red" onClick={() => setConfirmDelete(true)}>
                          <Icon path={icons.trash} size={12} />
                          Delete Account
                        </button>
                      </div>

                      {confirmDelete && (
                        <div className="confirm-box">
                          <div className="confirm-text">Are you sure you want to permanently delete this account? This cannot be undone.</div>
                          <div className="confirm-btns">
                            <button className="action-btn btn-red" onClick={handleDelete} disabled={actionLoading === 'delete'}>
                              {actionLoading === 'delete' ? <div className="spinner" /> : null} Yes, Delete
                            </button>
                            <button className="action-btn btn-blue" onClick={() => setConfirmDelete(false)}>Cancel</button>
                          </div>
                        </div>
                      )}
                      {actionMsg && (
                        <div className={`msg-box ${actionMsg.includes('Failed') ? 'msg-error' : 'msg-success'}`}>{actionMsg}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
