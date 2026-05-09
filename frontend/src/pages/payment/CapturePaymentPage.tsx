import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

export default function CapturePaymentPage() {

  const [params] = useSearchParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const captureRequestId = params.get("id");

  const amount = params.get("amount");

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePayment = async () => {

    if (!captureRequestId) {
      alert("Invalid request");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture-payment/pay`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({
            capture_request_id: Number(captureRequestId)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Payment failed");
        return;
      }

      alert("Payment successful");

      navigate(`/capture-invoice/${data.invoice_id}`);

    } catch (err) {

      console.error(err);

      alert("Payment failed");

    }

    setLoading(false);
  };

  return (
    <>
      <DashboardHeader />

      <div
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >

        <h2>Capture Request Payment</h2>

        <p>
          Amount:
          {" "}
          <b>${amount}</b>
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: "pointer"
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>

      <Footer />
    </>
  );
}