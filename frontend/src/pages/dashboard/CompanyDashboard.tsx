import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./UserDashboard.css";

type CompanyProfile = {
  company_name: string;
  profile_image: string;
};

type SubscriptionInfo = {
  plan_name: string;
  expire_date: string;
  status: "active" | "expired" | string;
};

type UsageInfo = {
  download_used_mb: number;
  api_used_mb: number;
  total_limit_mb: number;
  remaining_mb: number;
};

export default function CompanyDashboard() {

  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<CompanyProfile | null>(null);

  const [subscription, setSubscription] =
    useState<SubscriptionInfo | null>(null);

  const [usage, setUsage] =
    useState<UsageInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [p, s, u] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/company/profile`,
            { credentials: "include" }
          ),

          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/subscription/current`,
            { credentials: "include" }
          ),

          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/usage/current`,
            { credentials: "include" }
          ),
        ]);

        if (
          p.status === 401 ||
          s.status === 401 ||
          u.status === 401
        ) {
          setProfile(null);
          setSubscription(null);
          setUsage(null);
          return;
        }

        const profileData = await p.json();
        const subData = await s.json();
        const usageData = await u.json();

        setProfile(profileData);
        setSubscription(subData);
        setUsage(usageData);

      } catch (err) {

        console.error(
          "Dashboard load error:",
          err
        );

      } finally {

        setLoading(false);

      }
    };

    const checkEnterprise = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/enterprise/check`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.expired) {
          alert("Your enterprise plan has expired");
          setLoading(false);
          return;
        }

        if (data.payment_required) {
          navigate(
            `/payment?amount=${data.amount}&currency=${data.currency}`
          );

          return;
        }

        loadDashboard();

      } catch (err) {

        console.error(
          "Enterprise check failed",
          err
        );

        loadDashboard();

      }
    };

    checkEnterprise();

  }, [navigate]);

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

        {/* ================= USAGE STATS OFF ================= */}

        {/*
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-value">
              {usage?.download_used_mb || 0}
            </div>

            <div className="stat-title">
              Download Usage (MB)
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">
              {usage?.api_used_mb || 0}
            </div>

            <div className="stat-title">
              API Usage (MB)
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">
              {usage?.total_limit_mb || 0}
            </div>

            <div className="stat-title">
              Total Limit (MB)
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">
              {usage?.remaining_mb || 0}
            </div>

            <div className="stat-title">
              Remaining (MB)
            </div>
          </div>

        </div>
        */}

      
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
      ✅ If you need custom datasets, raise a capture request,
      pay securely, and get the required data delivered to you.
    </div>

    <div className="databox-point">
      ✅ Enhance datasets with AI, analytics, automation,
      model integrations, APIs, and intelligent business workflows.
    </div>

    <div className="databox-point">
      ✅ Get fully customized AI-powered solutions and
      development according to your exact business needs.
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

            {/* Subscription OFF */}

            {/*
            <div
              onClick={() =>
                navigate("/subscription")
              }
              className="dashboard-box"
            >
              <h2>Subscription</h2>

              <p>
                Current plan:
                {subscription?.plan_name}
              </p>
            </div>
            */}

            {/* Usage OFF */}

            {/*
            <div
              onClick={() =>
                navigate("/usage")
              }
              className="dashboard-box"
            >
              <h2>Usage</h2>
            </div>
            */}

            {/* Buy Addon OFF */}

            {/*
            <div
              onClick={() =>
                navigate("/addon")
              }
              className="dashboard-box"
            >
              <h2>Buy Addon</h2>
            </div>
            */}

            {/* SUPPORT */}

<div
  className="dashboard-box"
  onClick={() =>
    navigate("/support")
  }
>

  <h2>Support</h2>

  <p>
    Need help with datasets, AI integrations,
    automation workflows, or custom business solutions? Our team is here to help.
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