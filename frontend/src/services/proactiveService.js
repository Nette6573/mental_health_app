const BASE_URL = "http://127.0.0.1:8000/api"

export const getProactiveMessage = async (uid) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/proactive`)
  return res.json()
}