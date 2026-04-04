const BASE_URL = "http://127.0.0.1:8000/api"

export const getHistory = async (uid) => {
  const res = await fetch(`${BASE_URL}/user/${uid}/history`)
  return res.json()
}