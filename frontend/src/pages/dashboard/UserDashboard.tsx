import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./UserDashboard.css";
 
export default function UserDashboard() {
 
  const navigate = useNavigate();
 
  const [loading] = useState(false);
 
  if (loading) {
 
    return (
      <>
        <DashboardHeader />
 
        <div style={{ padding: "40px" }}>
          Loading dashboard...
        </div>
 
        <Footer />
      </>
    );
  }
 
  return (
    <>
      <DashboardHeader />
 
      <div className="dashboard-page">
 
        <div className="dashboard-main">
 
          {/* ================= DATABOX ================= */}
 
          <div
            className="dashboard-box databox-large"
            onClick={() => navigate("/capture-request")}
          >
 
            <div className="databox-header">
 
              <h2>Capture Request Box</h2>
 
              <span className="databox-tag">
                AI Ready
              </span>
 
            </div>
 
            <div className="databox-points">
 
              <div className="databox-point">
                ✅ If you need custom datasets,
                raise a capture request,
                pay securely, and get the required
                data delivered to you.
              </div>
 
              <div className="databox-point">
                ✅ Enhance datasets with AI,
                analytics, automation,
                model integrations, APIs,
                and intelligent business workflows.
              </div>
 
              <div className="databox-point">
                ✅ Get fully customized
                AI-powered solutions and
                development according to your
                exact business needs.
              </div>
 
            </div>
 
            <div className="databox-stats">
 
              <div>
                <strong>Data</strong>
                <span>Collection</span>
              </div>
 
              <div>
                <strong>AI</strong>
                <span>Integration</span>
              </div>
 
              <div>
                <strong>Custom</strong>
                <span>Development</span>
              </div>
 
            </div>
 
            <div className="databox-footer blink-btn">
              Raise Data Request →
            </div>
 
          </div>
 
          {/* ================= RIGHT SIDE ================= */}
 
          <div className="dashboard-right">
 
            {/* SUPPORT */}
 
            <div
              className="dashboard-box"
              onClick={() =>
                navigate("/support")
              }
            >
 
              <h2>Support</h2>
 
              <p>
                Need help with datasets,
                AI integrations,
                automation workflows,
                or custom business solutions?
                Our team is here to help.
              </p>
 
            </div>
 
            {/* CAPTURE PAYMENTS */}
 
            <div
              className="dashboard-box"
              onClick={() =>
                navigate("/capture-payments")
              }
            >
 
              <h2>Capture Payments</h2>
 
              <p>
                View capture request payments
              </p>
 
            </div>
 
            {/* CAPTURE INVOICES */}
 
            <div
              className="dashboard-box"
              onClick={() =>
                navigate("/capture-invoices")
              }
            >
 
              <h2>Capture Invoices</h2>
 
              <p>
                View capture request invoices
              </p>
 
            </div>
 
          </div>
 
        </div>
 
      </div>
 
      <Footer />
    </>
  );
}
