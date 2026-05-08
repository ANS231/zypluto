import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;