export async function getUserAssessments(userId: string) {
  const res = await fetch(
    `https://your-backend-url/api/user/${userId}/assessments`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch assessments");
  }

  return res.json();
}