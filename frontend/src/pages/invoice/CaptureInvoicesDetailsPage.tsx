import { useEffect, useState } from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

export default function CaptureInvoicesDetailsPage() {

  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchInvoices = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture-invoice-details/`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setInvoices(data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <DashboardHeader />

      <div style={{ padding: 20 }}>

        <h1>Capture Invoice Details</h1>

        <table width="100%" border={1} cellPadding={10}>

          <thead>
            <tr>
              <th>Invoice</th>
              <th>Request</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {invoices.map((i) => (
              <tr key={i.invoice_id}>

                <td>{i.invoice_number}</td>

                <td>{i.request_code}</td>

                <td>
                  ${i.amount} {i.currency}
                </td>

                <td>{i.status}</td>

                <td>{i.payment_method}</td>

                <td>
                  {new Date(i.created_at).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <Footer />
    </>
  );
}