import axios from "axios";

const API =
  `${import.meta.env.VITE_API_BASE_URL}/api`;

export const createTicket = async (data: any) => {

  const formData = new FormData();

  formData.append("subject", data.subject);
  formData.append("category", data.category);
  formData.append("message", data.message);

  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await axios.post(
    `${API}/support/create`,
    formData,
    { withCredentials: true }
  );

  return res.data;
};

export const getMyTickets = async () => {
  const res = await axios.get(
    `${API}/support/my-tickets`,   // ✅ NOW CORRECT
    { withCredentials: true }
  );
  return res.data;
};

export const getMessages = async (ticket_id: string) => {
  const res = await axios.get(
    `${API}/support/messages/${ticket_id}`,
    { withCredentials: true }
  );
  return res.data;
};

export const replyTicket = async (data: any) => {

  const res = await axios.post(
    `${API}/support/reply`,
    data,
    { withCredentials: true }
  );

  return res.data;
};