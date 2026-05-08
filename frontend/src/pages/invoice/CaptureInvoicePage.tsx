import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

export default function CaptureInvoicePage() {

  const { invoiceId } = useParams();

  const [invoice, setInvoice] = useState<any>(null);

  // =========================
  // FETCH INVOICE
  // =========================
  const fetchInvoice = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture-invoice/${invoiceId}`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setInvoice(data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <>
      <DashboardHeader />

      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >

        <h2>Invoice</h2>

        {!invoice ? (

          <p>Loading...</p>

        ) : (

          <div>

            <p>
              <b>Invoice ID:</b>
              {" "}
              {invoice.invoice_id}
            </p>

            <p>
              <b>Invoice Number:</b>
              {" "}
              {invoice.invoice_number}
            </p>

            <p>
              <b>Date:</b>
              {" "}
              {invoice.created_at}
            </p>

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}