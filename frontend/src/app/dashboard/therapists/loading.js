import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'

const loadingUser = {
  firstName: '',
  lastName: '',
  email: ''
}

export default function TherapistsLoading() {
  return (
    <DashboardLayout user={loadingUser}>
      <div className="space-y-6 animate-pulse">

        {/* HEADER */}
        <div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96"></div>
        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
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
    </DashboardLayout>
  )
}