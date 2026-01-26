import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const activities = [
  {
    id: 1,
    type: 'mood',
    title: 'Mood Logged',
    description: 'You rated your mood 8/10',
    time: '2 hours ago',
    icon: '😊',
    color: 'green'
  },
  {
    id: 2,
    type: 'resource',
    title: 'Resource Completed',
    description: 'Finished "Managing Anxiety" guide',
    time: '1 day ago',
    icon: '📚',
    color: 'blue'
  },
  {
    id: 3,
    type: 'session',
    title: 'Therapy Session',
    description: 'Completed session with Dr. Johnson',
    time: '2 days ago',
    icon: '💬',
    color: 'purple'
  },
  {
    id: 4,
    type: 'faith',
    title: 'Daily Devotional',
    description: 'Read "Strength in Faith" passage',
    time: '3 days ago',
    icon: '🙏',
    color: 'yellow'
  }
]

const colorClasses = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
}

export default function RecentActivity() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-lg">
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <Badge color={activity.color} size="sm">
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activity yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start tracking your mood and using resources to see your activity here.
          </p>
          <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
            Get Started
          </button>
        </div>
      )}
    </Card>
  )
}