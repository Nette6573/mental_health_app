'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { db } from '@/lib/firebase/firebaseClient'
import { collection, getDocs, query, where } from 'firebase/firestore'

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
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',
}

function Badge({ children, type = 'blue' }: { children: React.ReactNode; type?: string }) {
  const styles: Record<string, any> = {
    green: { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' },
    red: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
    yellow: { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
    blue: { background: 'rgba(37,150,190,0.1)', color: '#38bdf8', border: '1px solid rgba(37,150,190,0.2)' },
  }
  return (
    <span style={{ ...styles[type], display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
      {children}
    </span>
  )
}

export default function AdminClientsPage() {
  const { state } = useAdminAuth()
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [bookingCount, setBookingCount] = useState<Record<string, number>>({})
  const [actionLoading, setActionLoading] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!state.isLoading && !state.admin) router.replace('/admin')
  }, [state.isLoading, state.admin, router])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'))
        const userList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        setClients(userList)

        // Fetch booking counts per user
        const bookingsSnap = await getDocs(collection(db, 'bookings'))
        const counts: Record<string, number> = {}
        // Also check providers/{id}/bookings subcollections
        const provSnap = await getDocs(collection(db, 'providers'))
        for (const provDoc of provSnap.docs) {
          const provBookings = await getDocs(collection(db, 'providers', provDoc.id, 'bookings'))
          provBookings.docs.forEach(b => {
            const uid = b.data().userId
            if (uid) counts[uid] = (counts[uid] || 0) + 1
          })
        }
        // Also check top-level bookings collection
        bookingsSnap.docs.forEach(b => {
          const uid = b.data().userId
          if (uid) counts[uid] = (counts[uid] || 0) + 1
        })
        setBookingCount(counts)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const handleDisable = async () => {
    if (!selectedClient) return
    setActionLoading('disable')
    try {
      const res = await fetch('/api/admin/disable-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: selectedClient.id, disable: !selectedClient.disabled }),
      })
      const data = await res.json()
      if (data.success) {
        setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, disabled: !c.disabled } : c))
        setSelectedClient((prev: any) => ({ ...prev, disabled: !prev.disabled }))
        setActionMsg(selectedClient.disabled ? 'Account enabled.' : 'Account disabled.')
      }
    } catch (e) {
      setActionMsg('Failed to update account.')
    } finally {
      setActionLoading('')
    }
  }

  const handleDelete = async () => {
    if (!selectedClient) return
    setActionLoading('delete')
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: selectedClient.id }),
      })
      const data = await res.json()
      if (data.success) {
        setClients(prev => prev.filter(c => c.id !== selectedClient.id))
        setSelectedClient(null)
      }
    } catch (e) {
      setActionMsg('Failed to delete account.')
    } finally {
      setActionLoading('')
      setConfirmDelete(false)
    }
  }

  const filtered = clients.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (`${c.firstName} ${c.lastName}`).toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
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
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .avatar-placeholder { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif; flex-shrink: 0; }
        .action-btn { padding: 5px 11px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
        .btn-blue { background: rgba(37,150,190,0.1); border: 1px solid rgba(37,150,190,0.25); color: #2596be; }
        .btn-yellow { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fbbf24; }
        .btn-red { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .btn-green { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #34d399; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 80; }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 90; width: 460px; max-width: 100vw; background: #161b22; border-left: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; animation: slideInRight 0.25s ease; }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .drawer-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 14px; background: rgba(13,17,23,0.8); flex-shrink: 0; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
        .section-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #8b949e; margin-bottom: 14px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .info-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px; }
        .info-item-label { font-size: 10.5px; color: #8b949e; margin-bottom: 4px; }
        .info-item-value { font-size: 13px; color: #e6edf3; font-weight: 500; }
        .stat-box { background: rgba(37,150,190,0.06); border: 1px solid rgba(37,150,190,0.15); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .action-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .confirm-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 14px 16px; margin-top: 12px; }
        .confirm-text { font-size: 13px; color: #f87171; margin-bottom: 12px; }
        .confirm-btns { display: flex; gap: 8px; }
        .msg-box { padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-top: 12px; }
        .msg-success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34d399; }
        .msg-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #2596be; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 20px 0; }
      `}</style>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-title">Clients</div>
            <div className="page-sub">{clients.length} registered clients</div>
          </div>
          <div className="search-wrap">
            <span className="search-icon"><Icon path={icons.search} size={14} /></span>
            <input className="search-input" placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>Loading clients...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8b949e' }}>No clients found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                    <th>Newsletter</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar-placeholder" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                            {c.firstName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span style={{ fontWeight: 600, color: '#e6edf3' }}>{c.firstName} {c.lastName}</span>
                        </div>
                      </td>
                      <td style={{ color: '#8b949e' }}>{c.email}</td>
                      <td style={{ color: '#8b949e', fontSize: 12 }}>
                        {c.joinDate ? new Date(c.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td>
                        <Badge type="blue">{bookingCount[c.id] || 0} bookings</Badge>
                      </td>
                      <td>
                        <Badge type={c.newsletter ? 'green' : 'red'}>{c.newsletter ? 'Yes' : 'No'}</Badge>
                      </td>
                      <td>
                        <Badge type={c.disabled ? 'red' : 'green'}>{c.disabled ? 'Disabled' : 'Active'}</Badge>
                      </td>
                      <td>
                        <button className="action-btn btn-blue" onClick={() => { setSelectedClient(c); setActionMsg(''); setConfirmDelete(false) }}>
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

      {/* Drawer */}
      {selectedClient && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedClient(null)} />
          <div className="drawer">
            <div className="drawer-header">
              <div className="avatar-placeholder" style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: 16, fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                {selectedClient.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#e6edf3' }}>{selectedClient.firstName} {selectedClient.lastName}</div>
                <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{selectedClient.email}</div>
              </div>
              <button onClick={() => setSelectedClient(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4 }}>
                <Icon path={icons.x} size={16} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Booking count stat */}
              <div className="stat-box">
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Total Bookings</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#2596be' }}>{bookingCount[selectedClient.id] || 0}</div>
                </div>
                <Icon path={icons.calendar} size={28} />
              </div>

              <div className="section-label">Account Information</div>
              <div className="info-grid">
                {[
                  { label: 'First Name', value: selectedClient.firstName },
                  { label: 'Last Name', value: selectedClient.lastName },
                  { label: 'Email', value: selectedClient.email },
                  { label: 'Role', value: selectedClient.role },
                  { label: 'Newsletter', value: selectedClient.newsletter ? 'Subscribed' : 'Not subscribed' },
                  { label: 'Joined', value: selectedClient.joinDate ? new Date(selectedClient.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—' },
                ].map(item => item.value ? (
                  <div key={item.label} className="info-item">
                    <div className="info-item-label">{item.label}</div>
                    <div className="info-item-value">{item.value}</div>
                  </div>
                ) : null)}
              </div>

              <div className="divider" />
              <div className="section-label">Account Actions</div>
              <div className="action-row">
                <button
                  className={`action-btn ${selectedClient.disabled ? 'btn-green' : 'btn-yellow'}`}
                  onClick={handleDisable}
                  disabled={actionLoading === 'disable'}
                >
                  {actionLoading === 'disable' ? <div className="spinner" /> : <Icon path={selectedClient.disabled ? icons.unlock : icons.lock} size={12} />}
                  {selectedClient.disabled ? 'Enable Account' : 'Disable Account'}
                </button>

                <button className="action-btn btn-red" onClick={() => setConfirmDelete(true)}>
                  <Icon path={icons.trash} size={12} />
                  Delete Account
                </button>
              </div>

              {confirmDelete && (
                <div className="confirm-box">
                  <div className="confirm-text">Permanently delete this client account? This cannot be undone.</div>
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
          </div>
        </>
      )}
    </>
  )
}
