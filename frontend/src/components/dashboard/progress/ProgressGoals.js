'use client'

import { useState } from 'react'

export default function ProgressGoals({ user, data }) {
  const [goals, setGoals] = useState(data?.goals || [])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'spiritual',
    target: 30,
    timeframe: 'monthly',
    description: ''
  })

  const goalTypes = [
    { id: 'spiritual', name: 'Spiritual Growth', icon: '💫', color: 'bg-purple-500' },
    { id: 'prayer', name: 'Prayer Life', icon: '🙏', color: 'bg-green-500' },
    { id: 'scripture', name: 'Scripture Study', icon: '📚', color: 'bg-blue-500' },
    { id: 'community', name: 'Community', icon: '👥', color: 'bg-orange-500' },
    { id: 'service', name: 'Service', icon: '🤝', color: 'bg-red-500' }
  ]

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const getGoalType = (type) => {
    return goalTypes.find(t => t.id === type) || goalTypes[0]
  }

  const handleCreateGoal = (e) => {
    e.preventDefault()
    const goal = {
      id: Date.now(),
      ...newGoal,
      current: 0,
      createdAt: new Date().toISOString()
    }
    setGoals(prev => [...prev, goal])
    setShowCreateModal(false)
    setNewGoal({
      title: '',
      type: 'spiritual',
      target: 30,
      timeframe: 'monthly',
      description: ''
    })
  }

  const updateGoalProgress = (id, increment) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.min(goal.current + increment, goal.target)
        return { ...goal, current: newCurrent }
      }
      return goal
    }))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id))
  }

  const GoalCard = ({ goal }) => {
    const progress = calculateProgress(goal.current, goal.target)
    const goalType = getGoalType(goal.type)

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${goalType.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {goalType.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {goal.timeframe} • {goalType.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {goal.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{goal.description}</p>
        )}

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {goal.current}/{goal.target} ({progress}%)
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${goalType.color}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => updateGoalProgress(goal.id, 1)}
              disabled={goal.current >= goal.target}
              className="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              +1 Progress
            </button>
            <button
              onClick={() => updateGoalProgress(goal.id, 5)}
              disabled={goal.current >= goal.target}
              className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              +5 Progress
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Goals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set and track your spiritual growth goals
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 lg:mt-0 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by creating your first spiritual growth goal
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* Progress Summary */}
      {goals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Goals Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goalTypes.map(type => {
              const typeGoals = goals.filter(goal => goal.type === type.id)
              const totalProgress = typeGoals.reduce((sum, goal) => sum + calculateProgress(goal.current, goal.target), 0)
              const averageProgress = typeGoals.length > 0 ? Math.round(totalProgress / typeGoals.length) : 0
              
              return (
                <div key={type.id} className="text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                    {type.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{type.name}</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{averageProgress}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {typeGoals.length} goal{typeGoals.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowCreateModal(false)}
            />

            <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md">
              <form onSubmit={handleCreateGoal}>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Goal
                  </h3>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Read Bible daily"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal Type
                    </label>
                    <select
                      value={newGoal.type}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      {goalTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target
                      </label>
                      <input
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timeframe
                      </label>
                      <select
                        value={newGoal.timeframe}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, timeframe: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Describe your goal..."
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}