const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'signed up',
    time: '2 minutes ago',
    avatar: 'JD'
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'uploaded a new resource',
    time: '1 hour ago',
    avatar: 'JS'
  },
  {
    id: 3,
    user: 'Bob Johnson',
    action: 'completed a therapy session',
    time: '3 hours ago',
    avatar: 'BJ'
  },
  {
    id: 4,
    user: 'Alice Brown',
    action: 'updated their profile',
    time: '5 hours ago',
    avatar: 'AB'
  },
  {
    id: 5,
    user: 'Charlie Wilson',
    action: 'joined a support group',
    time: '1 day ago',
    avatar: 'CW'
  }
]

export default function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{activity.avatar}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium w-full text-center">
          View all activity
        </button>
      </div>
    </div>
  )
}