const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function saveMood(userId, moodData) {
const res = await fetch(`${BASE_URL}/api/mood/${userId}`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(moodData)
});

if (!res.ok) {
const errorText = await res.text();
console.error("Save mood error:", errorText);
throw new Error("Failed to save mood");
}

return res.json();
}

export async function getMood(userId) {
const res = await fetch(`${BASE_URL}/api/mood/${userId}`);

if (!res.ok) {
throw new Error("Failed to fetch mood");
}

return res.json();
}
