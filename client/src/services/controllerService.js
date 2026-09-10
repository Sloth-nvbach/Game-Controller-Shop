const API_URL = "http://localhost:5000/api/controllers";

export async function getControllers() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch controllers");
  }
  return res.json();
}