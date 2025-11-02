// Centralized API base and fetch wrapper with safe JSON parsing
export const apiBase = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const urlPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${apiBase}${urlPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Read text first to handle empty/invalid JSON bodies gracefully
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Non-JSON response
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
      }
      throw new Error("Unexpected non-JSON response from server");
    }
  }

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}
