import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

/* ===============================
   Get Current Subscription
================================= */
export const getCurrentSubscription = () => {
  return axios.get(`${API}/api/subscription/current`, {
    withCredentials: true,
  });
};

/* ===============================
   Get All Plans By Region
================================= */
export const getPlans = (region: string) => {
  return axios.get(`${API}/api/subscription/plans?region=${region}`, {
    withCredentials: true,
  });
};

/* ===============================
   Get Addon Settings (NEW)
================================= */
// subscriptionService.ts

export const getAddonSettings = (region: string) => {
  return axios.get(`${API}/api/addon/settings?region=${region}`, {
    withCredentials: true,
  });
};

/* ===============================
   Purchase Addon (FINAL)
================================= */
export const purchaseAddon = (addon_id: number) => {
  return axios.post(
    `${API}/api/addon/purchase?addon_id=${addon_id}`,
    {},
    {
      withCredentials: true,
    }
  );
};