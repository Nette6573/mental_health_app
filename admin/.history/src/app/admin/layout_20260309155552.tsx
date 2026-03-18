'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext'
import { ChatProvider } from '@/contexts/ChatContext'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminHeader from '../components/layout/AdminHeader'
import SessionTimeout from '../components/auth/SessionTimeout'

function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { state } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/admin/login')
    }
  }, [state.isLoading, state.isAuthenticated, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return null
  }

  return (
    <>
      <SessionTimeout />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ChatProvider>
        <ProtectedAdminLayout>
          {children}
        </ProtectedAdminLayout>
      </ChatProvider>
    </AdminAuthProvider>
  )
}