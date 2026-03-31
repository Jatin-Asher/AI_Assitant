const fallbackApiBaseUrl = "https://ai-assitant-yn6v.onrender.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || fallbackApiBaseUrl;
