import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Dashboard - HopePath',
  description: 'Your personal mental wellness dashboard',
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}