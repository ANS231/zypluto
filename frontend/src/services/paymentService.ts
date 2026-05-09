import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

/* Confirm Payment */
export const confirmPayment = (planId: string) => {
  return axios.post(
    `${API}/api/payment/confirm`,
    { plan_id: planId },
    { withCredentials: true }
  );
};