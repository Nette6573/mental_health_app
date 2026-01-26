import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const mockUser = {
  firstName: 'User',
  lastName: '',
  email: 'user@example.com'
}

export default function TherapistsLoading() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-48 mt-4 lg:mt-0"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-48">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}