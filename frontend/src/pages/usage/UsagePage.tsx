import { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./UsagePage.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function UsagePage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchUsage = async () => {
    try {
      const res = await axios.get(`${API}/api/usage/current`, {
        withCredentials: true,
      });
      setUsage(res.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to load usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleBuyAddon = async () => {
    try {
      setProcessing(true);


      alert("200MB Addon purchased successfully!");
      await fetchUsage();

    } catch (err: any) {
      alert(err.response?.data?.detail || "Addon purchase failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <div className="usage-loading">Loading usage...</div>
        <Footer />
      </>
    );
  }

  if (!usage) {
    return (
      <>
        <DashboardHeader />
        <div className="usage-loading">No usage data</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DashboardHeader />

      <div className="usage-page">

        <h2 className="usage-title">Monthly Usage</h2>

        {usage.status === "expired" ? (
          <div className="usage-expired">
            <h3>Subscription Expired</h3>
            <p>Please renew your subscription to access data.</p>
          </div>
        ) : (
          <>
            <div className="usage-card">

              <div className="usage-item">
                <p className="usage-label">
                  Downloads: {usage.download_used_mb} / {usage.download_limit_mb} MB
                </p>

                <ProgressBar
                  used={usage.download_used_mb}
                  limit={usage.download_limit_mb}
                />
              </div>

              <div className="usage-item">
                <p className="usage-label">
                  API Calls: {usage.api_used} / {usage.api_limit}
                </p>

                <ProgressBar
                  used={usage.api_used}
                  limit={usage.api_limit}
                />
              </div>

            </div>

            {usage.download_used_mb >= usage.download_limit_mb && (
              <button
                className="addon-btn"
                onClick={handleBuyAddon}
                disabled={processing}
              >
                {processing ? "Processing..." : "Buy 200MB Addon ($5)"}
              </button>
            )}
          </>
        )}

      </div>

      <Footer />
    </>
  );
}


/* Progress Bar Component */

function ProgressBar({ used, limit }: { used: number; limit: number }) {

  const percentage =
    limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
