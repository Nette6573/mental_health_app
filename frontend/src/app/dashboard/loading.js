import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

// Mock user for loading state
const mockUser = {
  firstName: 'User',
  lastName: '',
  email: 'user@example.com'
}

export default function DashboardLoading() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-6 h-32"></div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"></div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}