export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not set in environment variables");
}