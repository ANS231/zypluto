import { useEffect, useState } from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

export default function CapturePaymentsDetailsPage() {

  const [payments, setPayments] = useState<any[]>([]);

  const fetchPayments = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture-payment-details/`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setPayments(data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <>
      <DashboardHeader />

      <div style={{ padding: 20 }}>

        <h1>Capture Payment Details</h1>

        <table width="100%" border={1} cellPadding={10}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Stripe</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {payments.map((p) => (
              <tr key={p.id}>

                <td>{p.id}</td>

                <td>{p.request_code}</td>

                <td>
                  ${p.amount} {p.currency}
                </td>

                <td>{p.status}</td>

                <td>{p.payment_method}</td>

                <td>{p.stripe_payment_intent_id}</td>

                <td>
                  {new Date(p.created_at).toLocaleString()}
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