import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

/* ================= LOGIN ================= */
export const loginUser = (username: string, password: string) => {
  return axios.post(
    `${API}/api/login`,
    { username, password },
    { withCredentials: true }
  );
};

/* ================= PERSONAL SIGNUP ================= */
export const personalSignup = (data: FormData) => {
  return axios.post(
    `${API}/api/personal/signup`,
    data,
    { withCredentials: true }
  );
};

/* ================= COMPANY SIGNUP ================= */
export const companySignup = (data: FormData) => {
  return axios.post(
    `${API}/api/company/signup`,
    data,
    { withCredentials: true }
  );
};