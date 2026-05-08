import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CaptureRequestPage.css";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

type CaptureData = {
  id: number;
  request_code: string;
  dataset_name: string;
  payment_status: string;
};

type CaptureRequestType = {
  id: number;
  request_code: string;
  status: string;
  price: number;
  payment_status: string;
};

export default function CaptureRequestPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    contact_number: "",
    address: "",
    request_description: ""
  });

  const [loading, setLoading] = useState(false);

  const [myData, setMyData] = useState<CaptureData[]>([]);
  const [myRequests, setMyRequests] = useState<CaptureRequestType[]>([]);

  // =========================================
  // FETCH ASSIGNED DATA
  // =========================================

  const fetchMyData = async () => {
    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture/my-data`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setMyData(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // FETCH REQUESTS
  // =========================================

  const fetchMyRequests = async () => {
    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture/my-requests`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setMyRequests(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyData();
    fetchMyRequests();
  }, []);

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async () => {

    if (!formData.request_description.trim()) {
      alert("Please describe your data requirement");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/capture/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Submission failed");
        return;
      }

      alert(
        `✅ Request submitted successfully.\n\nRequest Code: ${data.request_code}\n\nPlease contact support with your request code.`
      );

      setFormData({
        name: "",
        email_id: "",
        contact_number: "",
        address: "",
        request_description: ""
      });

      fetchMyRequests();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // =========================================
  // PAYMENT
  // =========================================

  const handlePay = (id: number, price: number) => {
    navigate(`/payment?type=capture_request&id=${id}&amount=${price}`);
  };

  // =========================================
  // DOWNLOAD
  // =========================================

  const handleDownload = (id: number) => {

    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/capture/download?id=${id}`,
      "_blank"
    );

  };

  return (
    <>
      <DashboardHeader />

      <div className="capture-container">

        {/* =========================================
            LEFT PANEL
        ========================================= */}

        <div className="capture-left">

          <div className="capture-left-top">

            <span className="capture-tag">
              Data Capture
            </span>

            <h2>Capture Request</h2>

            <p>
              Submit your custom dataset request and track
              your assigned data in real-time.
            </p>

          </div>

          {/* FORM */}

          <div className="capture-form">

            <div className="capture-input-group">

              <label>Full Name</label>

              <input
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            <div className="capture-input-group">

              <label>Email Address</label>

              <input
                name="email_id"
                placeholder="Enter email address"
                value={formData.email_id}
                onChange={handleChange}
              />

            </div>

            <div className="capture-input-group">

              <label>Contact Number</label>

              <input
                name="contact_number"
                placeholder="Enter contact number"
                value={formData.contact_number}
                onChange={handleChange}
              />

            </div>

            <div className="capture-input-group">

              <label>Address</label>

              <textarea
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />

            </div>

            <div className="capture-input-group">

              <label>Requirement Description</label>

              <textarea
                name="request_description"
                rows={6}
                placeholder="Describe your data requirement..."
                value={formData.request_description}
                onChange={handleChange}
              />

            </div>

            <button
              className="capture-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>

        </div>

        {/* =========================================
            RIGHT PANEL
        ========================================= */}

        <div className="capture-right">

          {/* REQUESTS */}

          <div className="capture-card">

            <div className="capture-card-header">

              <div>
                <h3>Your Requests</h3>
                <p>Track pricing & payment status</p>
              </div>

            </div>

            {myRequests.length === 0 ? (

              <div className="capture-empty">
                No requests available
              </div>

            ) : (

              <div className="capture-table-wrapper">

                <table className="capture-table">

                  <thead>
                    <tr>
                      <th>Request Code</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Payment</th>
                    </tr>
                  </thead>

                  <tbody>

                    {myRequests.map((r) => (

                      <tr key={r.id}>

                        <td className="capture-code">
                          {r.request_code}
                        </td>

                        <td>

                          <span
                            className={`capture-status ${r.status}`}
                          >
                            {r.status}
                          </span>

                        </td>

                        <td className="capture-price">
                          {r.price ? `$${r.price}` : "-"}
                        </td>

                        <td>

                          {r.payment_status !== "paid" && r.price ? (

                            <button
                              className="capture-action-btn"
                              onClick={() => handlePay(r.id, r.price)}
                            >
                              Pay
                            </button>

                          ) : r.payment_status === "paid" ? (

                            <span className="capture-paid">
                              Paid
                            </span>

                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* CAPTURED DATA */}

          <div className="capture-card">

            <div className="capture-card-header">

              <div>
                <h3>Your Captured Data</h3>
                <p>Download assigned datasets</p>
              </div>

            </div>

            {myData.length === 0 ? (

              <div className="capture-empty">
                No data assigned yet
              </div>

            ) : (

              <div className="capture-table-wrapper">

                <table className="capture-table">

                  <thead>

                    <tr>
                      <th>Request Code</th>
                      <th>Dataset Name</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {myData.map((d) => (

                      <tr key={d.id}>

                        <td className="capture-code">
                          {d.request_code}
                        </td>

                        <td>
                          {d.dataset_name
                            ? d.dataset_name.replace(/_/g, " ")
                            : "-"}
                        </td>

                        <td>

                          <button
                            className="capture-action-btn"
                            disabled={d.payment_status !== "paid"}
                            onClick={() => handleDownload(d.id)}
                          >
                            {d.payment_status === "paid"
                              ? "Download"
                              : "Payment Required"}
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}