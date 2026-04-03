const BASE_URL = "http://127.0.0.1:8000/api";

export async function saveMood(userId, moodData) {
  const res = await fetch(`${BASE_URL}/mood/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(moodData)
  });

  if (!res.ok) {
    throw new Error("Failed to save mood");
  }

  return res.json();
}

export async function getMood(userId) {
  const res = await fetch(`${BASE_URL}/mood/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch mood");
  }

  return res.json();
}