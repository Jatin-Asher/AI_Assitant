const fallbackApiBaseUrl = "http://localhost:5000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || fallbackApiBaseUrl;
