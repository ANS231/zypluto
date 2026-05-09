import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

import "./UserDashboard.css";

type CompanyProfile = {
  company_name: string;
  profile_image: string;
};

export default function CompanyDashboard() {

  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<CompanyProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/company/profile`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {

          setProfile(null);

          setLoading(false);

          return;
        }

        const profileData =
          await response.json();

        setProfile(profileData);

      } catch (err) {

        console.error(
          "Dashboard load error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  if (loading) {

    return (
      <>
        <DashboardHeader />

        <div
          style={{
            padding: "60px",
            fontSize: "18px",
            fontWeight: 600,
            color: "#334155",
          }}
        >
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

        {/* ================= WELCOME ================= */}

        <div className="dashboard-welcome">

          <h1>

            Welcome{" "}

            {profile?.company_name && (

              <span>
                {profile.company_name}
              </span>

            )}

          </h1>

          <p>
            Manage capture requests,
            AI-powered workflows,
            enterprise datasets,
            invoices, payments,
            and intelligent business
            solutions from your
            centralized dashboard.
          </p>

        </div>

        {/* ================= MAIN ================= */}

        <div className="dashboard-main">

          {/* ================= LEFT DATABOX ================= */}

          <div
            className="dashboard-box databox-large"
            onClick={() =>
              navigate("/capture-request")
            }
          >

            {/* HEADER */}

            <div className="databox-header">

              {/* LEFT */}

              <div className="databox-header-left">

                <h2>
                  Capture Request Box
                </h2>

                <button
                  className="databox-action-btn blink-btn"
                  onClick={(e) => {

                    e.stopPropagation();

                    navigate(
                      "/capture-request"
                    );

                  }}
                >

                  Click To New Capture Request

                </button>

              </div>

              {/* RIGHT TAG */}

              <span className="databox-tag">
                AI READY
              </span>

            </div>

            {/* POINTS */}

            <div className="databox-points">

              <div className="databox-points">

  <div className="databox-point">

    ✅ Need custom datasets for your business?
    Raise a secure capture request and
    download tailored datasets designed
    specifically for your operational needs.

  </div>

  <div className="databox-point">

    ✅ Access downloadable business data,
    analytics-ready files, and structured
    enterprise datasets for smarter
    decision making and workflow efficiency.

  </div>

  <div className="databox-point">

    ✅ Get customized downloadable data
    solutions prepared according to your
    business requirements, industry usecases,
    and organizational goals.

  </div>

</div>

            </div>

            {/* STATS */}

            <div className="databox-stats">

              <div>

                <strong>
                  Data
                </strong>

                <span>
                  Collection
                </span>

              </div>

              <div>

                <strong>
                  AI
                </strong>

                <span>
                  Integration
                </span>

              </div>

              <div>

                <strong>
                  Custom
                </strong>

                <span>
                  Development
                </span>

              </div>

            </div>

            {/* FOOTER */}

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

              <h2>
                Support
              </h2>

              <p>
                Need assistance with
                datasets, AI integrations,
                automation workflows,
                or enterprise solutions?
                Our expert team is here
                to help you.
              </p>

            </div>

            {/* PAYMENTS */}

            <div
              className="dashboard-box"
              onClick={() =>
                navigate("/capture-payments")
              }
            >

              <h2>
                Capture Payments
              </h2>

              <p>
                View and manage all
                capture request payment
                transactions securely.
              </p>

            </div>

            {/* INVOICES */}

            <div
              className="dashboard-box"
              onClick={() =>
                navigate("/capture-invoices")
              }
            >

              <h2>
                Capture Invoices
              </h2>

              <p>
                Access generated invoices
                and billing records for
                your capture requests.
              </p>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </>
  );

}