'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const Icon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

const icons = {
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  x: 'M18 6L6 18M6 6l12 12',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6',
  check: 'M20 6L9 17l-5-5',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  external: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
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

export default function AdminApplicationsPage() {
  const { state } = useAdminAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    if (!state.isLoading && !state.admin) router.replace('/admin')
  }, [state.isLoading, state.admin, router])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const snap = await getDocs(collection(db, 'providers'))
        // Only include providers who have uploaded credentials
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((p: any) => Array.isArray(p.credentials) && p.credentials.length > 0)
        setProviders(list)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const updateStatus = async (providerId: string, status: 'approved' | 'pending' | 'rejected') => {
    setActionLoading(providerId + status)
    try {
      await updateDoc(doc(db, 'providers', providerId), {
        application_status: status,
        application_updated_at: serverTimestamp(),
      })
      setProviders(prev => prev.map(p => p.id === providerId ? { ...p, application_status: status } : p))
      if (selectedProvider?.id === providerId) {
        setSelectedProvider((prev: any) => ({ ...prev, application_status: status }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading('')
    }
  }

  const getStatusType = (status: string) => {
    if (status === 'approved') return 'green'
    if (status === 'rejected') return 'red'
    return 'yellow'
  }

  const filtered = providers.filter(p => {
    const matchSearch = !searchQuery ||
      (`${p.first_name} ${p.last_name}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.professional_title || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter = filter === 'all' || (p.application_status || 'pending') === filter
    return matchSearch && matchFilter
  })

  if (!state.admin) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #0d1117; color: #c9d1d9; }
        .page { padding: 24px; width: 100%; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #e6edf3; }
        .page-sub { font-size: 13px; color: #8b949e; margin-top: 3px; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 20px; }
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 10px; color: #8b949e; pointer-events: none; }
        .search-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 14px 8px 34px; font-size: 13px; color: #c9d1d9; outline: none; width: 240px; font-family: 'DM Sans', sans-serif; }
        .search-input::placeholder { color: #8b949e; }
        .search-input:focus { border-color: rgba(37,150,190,0.4); }
        .filter-tabs { display: flex; gap: 6px; }
        .filter-tab { padding: 7px 14px; border-radius: 9px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; background: none; color: #8b949e; }
        .filter-tab.active { background: rgba(37,150,190,0.1); border-color: rgba(37,150,190,0.25); color: #2596be; }
        .filter-tab:hover:not(.active) { background: rgba(255,255,255,0.04); color: #c9d1d9; }
        .panel { background: rgba(22,27,34,0.9); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 11px 16px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8b949e; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .data-table td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); color: #c9d1d9; vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .avatar-placeholder { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif; flex-shrink: 0; }
        .action-btn { padding: 5px 11px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
        .btn-blue { background: rgba(37,150,190,0.1); border: 1px solid rgba(37,150,190,0.25); color: #2596be; }
        .btn-green { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #34d399; }
        .btn-red { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .btn-yellow { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fbbf24; }
        .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 80; }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 90; width: 540px; max-width: 100vw; background: #161b22; border-left: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; animation: slideInRight 0.25s ease; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .drawer-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 14px; background: rgba(13,17,23,0.8); flex-shrink: 0; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
        .section-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #8b949e; margin-bottom: 14px; }
        .doc-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
        .doc-card:last-child { margin-bottom: 0; }
        .doc-icon { width: 38px; height: 38px; border-radius: 9px; background: rgba(37,150,190,0.1); border: 1px solid rgba(37,150,190,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #2596be; }
        .doc-name { font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 3px; }
        .doc-type { font-size: 11.5px; color: #8b949e; }
        .view-doc-btn { margin-left: auto; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(37,150,190,0.1); border: 1px solid rgba(37,150,190,0.25); color: #2596be; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s; text-decoration: none; flex-shrink: 0; }
        .view-doc-btn:hover { background: rgba(37,150,190,0.18); }
        .status-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 20px 0; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #2596be; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; }
        .info-item-label { font-size: 10.5px; color: #8b949e; margin-bottom: 4px; }
        .info-item-value { font-size: 13px; color: #e6edf3; font-weight: 500; }
      `}</style>

      <div className="page">
        <div className="page-header">
          <div className="page-title">Applications</div>
          <div className="page-sub">Provider credential applications — review and approve</div>
        </div>

        <div className="toolbar">
          <div className="filter-tabs">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && (
                  <span style={{ marginLeft: 5, background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 10, fontSize: 10.5 }}>
                    {providers.filter(p => (p.application_status || 'pending') === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <span className="search-icon"><Icon path={icons.search} size={14} /></span>
            <input className="search-input" placeholder="Search providers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>Loading applications...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>No applications found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Title</th>
                    <th>Documents</th>
                    <th>License</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p: any) => {
                    const status = p.application_status || 'pending'
                    const isLoading = actionLoading.startsWith(p.id)
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {p.profile_photo_url ? (
                              <img src={p.profile_photo_url} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <div className="avatar-placeholder" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
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
                        <td>
                          <Badge type="blue">{p.credentials?.length || 0} docs</Badge>
                        </td>
                        <td style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: 12 }}>{p.license || '—'}</td>
                        <td>
                          <Badge type={getStatusType(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn btn-blue" onClick={() => setSelectedProvider(p)}>
                              <Icon path={icons.eye} size={12} /> Review
                            </button>
                            {status !== 'approved' && (
                              <button className="action-btn btn-green" onClick={() => updateStatus(p.id, 'approved')} disabled={isLoading}>
                                {isLoading && actionLoading === p.id + 'approved' ? <div className="spinner" /> : <Icon path={icons.check} size={12} />}
                                Approve
                              </button>
                            )}
                            {status !== 'rejected' && (
                              <button className="action-btn btn-red" onClick={() => updateStatus(p.id, 'rejected')} disabled={isLoading}>
                                {isLoading && actionLoading === p.id + 'rejected' ? <div className="spinner" /> : <Icon path={icons.x} size={12} />}
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selectedProvider && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedProvider(null)} />
          <div className="drawer">
            <div className="drawer-header">
              {selectedProvider.profile_photo_url ? (
                <img src={selectedProvider.profile_photo_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div className="avatar-placeholder" style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', fontSize: 16, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                  {selectedProvider.first_name?.[0]}{selectedProvider.last_name?.[0]}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#e6edf3' }}>{selectedProvider.first_name} {selectedProvider.last_name}</div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{selectedProvider.professional_title}</div>
              </div>
              <button onClick={() => setSelectedProvider(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4 }}>
                <Icon path={icons.x} size={16} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Current status + quick actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 6 }}>Current Status</div>
                  <Badge type={getStatusType(selectedProvider.application_status || 'pending')}>
                    {(selectedProvider.application_status || 'pending').charAt(0).toUpperCase() + (selectedProvider.application_status || 'pending').slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="status-actions">
                <button
                  className="action-btn btn-green"
                  onClick={() => updateStatus(selectedProvider.id, 'approved')}
                  disabled={selectedProvider.application_status === 'approved' || !!actionLoading}
                  style={{ opacity: selectedProvider.application_status === 'approved' ? 0.4 : 1 }}
                >
                  <Icon path={icons.check} size={12} /> Approve
                </button>
                <button
                  className="action-btn btn-yellow"
                  onClick={() => updateStatus(selectedProvider.id, 'pending')}
                  disabled={selectedProvider.application_status === 'pending' || !!actionLoading}
                  style={{ opacity: selectedProvider.application_status === 'pending' ? 0.4 : 1 }}
                >
                  <Icon path={icons.clock} size={12} /> Set Pending
                </button>
                <button
                  className="action-btn btn-red"
                  onClick={() => updateStatus(selectedProvider.id, 'rejected')}
                  disabled={selectedProvider.application_status === 'rejected' || !!actionLoading}
                  style={{ opacity: selectedProvider.application_status === 'rejected' ? 0.4 : 1 }}
                >
                  <Icon path={icons.alert} size={12} /> Reject
                </button>
              </div>

              <div className="divider" />

              {/* Provider info */}
              <div className="section-label">Provider Information</div>
              <div className="info-grid" style={{ marginBottom: 20 }}>
                {[
                  { label: 'Email', value: selectedProvider.professional_email },
                  { label: 'License', value: selectedProvider.license },
                  { label: 'Organization', value: selectedProvider.organization },
                  { label: 'Experience', value: selectedProvider.experience },
                  { label: 'Parish', value: selectedProvider.parish },
                  { label: 'Category', value: selectedProvider.category },
                ].map(item => item.value ? (
                  <div key={item.label} className="info-item">
                    <div className="info-item-label">{item.label}</div>
                    <div className="info-item-value">{item.value}</div>
                  </div>
                ) : null)}
              </div>

              <div className="divider" />

              {/* Credentials / Documents */}
              <div className="section-label">
                Uploaded Documents ({selectedProvider.credentials?.length || 0})
              </div>

              {!selectedProvider.credentials?.length ? (
                <p style={{ color: '#8b949e', fontSize: 13 }}>No documents uploaded yet.</p>
              ) : (
                selectedProvider.credentials.map((cred: any, i: number) => (
                  <div key={i} className="doc-card">
                    <div className="doc-icon">
                      <Icon path={icons.file} size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="doc-name">{cred.fileName || cred.documentType || `Document ${i + 1}`}</div>
                      <div className="doc-type">{cred.documentType || 'Document'}</div>
                      {cred.uploadedAt && (
                        <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>
                          Uploaded: {new Date(cred.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                    {(cred.url || cred.viewUrl) && (
                      <a
                        href={cred.viewUrl || cred.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-doc-btn"
                      >
                        <Icon path={icons.external} size={12} />
                        View
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
