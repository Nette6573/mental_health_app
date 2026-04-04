const BASE_URL = "http://127.0.0.1:8000/api"

export const getGoals = async (uid) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/goals`)
  return res.json()
}

export const createGoal = async (uid, goal) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal)
  })
  return res.json()
}

export const updateGoal = async (uid, goalId, increment = 1) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/goals/${goalId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ increment })
  })
  return res.json()
}

export const deleteGoal = async (uid, goalId) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/goals/${goalId}`, {
    method: "DELETE"
  })
  return res.json()
}