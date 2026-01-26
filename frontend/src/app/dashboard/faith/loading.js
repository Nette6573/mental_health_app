import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const mockUser = {
  firstName: 'User',
  lastName: '',
  email: 'user@example.com'
}

export default function FaithLoading() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-48 mt-4 lg:mt-0"></div>
        </div>

        {/* Today's Verse Skeleton */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 h-32"></div>

        {/* Category Navigation Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-300 dark:bg-gray-700 rounded-xl p-4 h-20"></div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-48"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}