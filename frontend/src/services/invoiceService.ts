const API = import.meta.env.VITE_API_BASE_URL;

/* Get Invoice Download URL */
export const getInvoiceDownloadUrl = (invoiceId: string) => {
  return `${API}/api/invoice/${invoiceId}`;
};