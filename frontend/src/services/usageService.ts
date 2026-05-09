import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

/* Get Monthly Usage */
export const getCurrentUsage = () => {
  return axios.get(`${API}/api/usage/current`, {
    withCredentials: true,
  });
};