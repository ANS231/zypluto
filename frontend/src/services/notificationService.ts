import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const getNotifications = async () => {
  const res = await axios.get(`${API}/notifications`, {
    withCredentials: true,
  });
  return res.data;
};

export const markRead = async (id: number) => {
  await axios.post(`${API}/notifications/read/${id}`, {}, {
    withCredentials: true,
  });
};