import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const mockUser = {
  firstName: 'User',
  lastName: '',
  email: 'user@example.com'
}

export default function ResourcesLoading() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-48 mt-4 sm:mt-0"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3].map(i => (
            <div key={i} className="pb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}