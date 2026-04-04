'use client'

import { useState, useEffect } from 'react'
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal as deleteGoalAPI
} from '@/services/goalService'

export default function ProgressGoals() {
  const [goals, setGoals] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'spiritual',
    target: 30,
    timeframe: 'monthly',
    description: ''
  })

  // ---------------- FETCH GOALS ----------------
  useEffect(() => {
    const fetchGoals = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      const res = await getGoals(uid)
      setGoals(res.goals || [])
    }

    fetchGoals()
  }, [])

  // ---------------- CREATE GOAL ----------------
  const handleCreateGoal = async (e) => {
    e.preventDefault()

    const uid = localStorage.getItem("uid")
    if (!uid) return

    await createGoal(uid, newGoal)

    const res = await getGoals(uid)
    setGoals(res.goals)

    setShowCreateModal(false)
    setNewGoal({
      title: '',
      type: 'spiritual',
      target: 30,
      timeframe: 'monthly',
      description: ''
    })
  }

  // ---------------- UPDATE PROGRESS ----------------
  const updateGoalProgress = async (id, increment) => {
    const uid = localStorage.getItem("uid")
    if (!uid) return

    await updateGoal(uid, id, increment)

    const res = await getGoals(uid)
    setGoals(res.goals)
  }

  // ---------------- DELETE GOAL ----------------
  const deleteGoal = async (id) => {
    const uid = localStorage.getItem("uid")
    if (!uid) return

    await deleteGoalAPI(uid, id)

    const res = await getGoals(uid)
    setGoals(res.goals)
  }

  // ---------------- HELPERS ----------------
  const calculateProgress = (current, target) =>
    Math.min(Math.round((current / target) * 100), 100)

  const goalTypes = [
    { id: 'spiritual', name: 'Spiritual Growth', icon: '💫', color: 'bg-purple-500' },
    { id: 'prayer', name: 'Prayer Life', icon: '🙏', color: 'bg-green-500' },
    { id: 'scripture', name: 'Scripture Study', icon: '📚', color: 'bg-blue-500' },
    { id: 'community', name: 'Community', icon: '👥', color: 'bg-orange-500' },
    { id: 'service', name: 'Service', icon: '🤝', color: 'bg-red-500' }
  ]

  const getGoalType = (type) =>
    goalTypes.find(t => t.id === type) || goalTypes[0]

  // ---------------- UI ----------------
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded"
        >
          Create Goal
        </button>
      </div>

      {/* GOALS */}
      {goals.length === 0 ? (
        <p>No goals yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const progress = calculateProgress(goal.current, goal.target)
            const goalType = getGoalType(goal.type)

            return (
              <div key={goal.id} className="p-4 border rounded">

                <div className="flex justify-between">
                  <h3>{goal.title}</h3>
                  <button onClick={() => deleteGoal(goal.id)}>❌</button>
                </div>

                <p>{goal.current}/{goal.target} ({progress}%)</p>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className={`${goalType.color} h-2 rounded`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateGoalProgress(goal.id, 1)}>+1</button>
                  <button onClick={() => updateGoalProgress(goal.id, 5)}>+5</button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form onSubmit={handleCreateGoal} className="bg-white p-6 rounded space-y-4">

            <input
              placeholder="Goal Title"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              required
            />

            <input
              type="number"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: parseInt(e.target.value) })
              }
              required
            />

            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>

          </form>
        </div>
      )}

    </div>
  )
}