import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const mockUser = {
  firstName: 'User',
  lastName: '',
  email: 'user@example.com'
}

export default function MoodLoading() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-32 mt-4 sm:mt-0"></div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}