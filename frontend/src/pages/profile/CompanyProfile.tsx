import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./CompanyProfile.css";

export default function CompanyProfile() {

  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company/profile`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Company Profile API:", data);

        if (!res.ok) {
          setError(data.detail || "Error fetching profile");
          return;
        }

        setProfile(data);

      } catch {
        setError("Server error");
      }

    };

    fetchProfile();

  }, []);


  if (error) {
    return (
      <>
        <DashboardHeader />
        <div className="profile-error">{error}</div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <DashboardHeader />
        <div className="profile-loading">Loading...</div>
        <Footer />
      </>
    );
  }

  return (

    <>
      <DashboardHeader />

      <div className="profile-page">

        <div className="profile-card">

          <h2 className="profile-title">Company Profile</h2>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Company Name</span>
              <p>{profile.company_name || "-"}</p>
            </div>

            <div className="profile-item">
              <span>Email</span>
              <p>{profile.email || "-"}</p>
            </div>

            <div className="profile-item">
              <span>Username</span>
              <p>{profile.username || "-"}</p>
            </div>

            <div className="profile-item">
              <span>Address</span>
              <p>{profile.address || "-"}</p>
            </div>

            <div className="profile-item">
              <span>Status</span>
              <p>{profile.status || "-"}</p>
            </div>

            <div className="profile-item">
              <span>Created At</span>
              <p>{profile.created_at || "-"}</p>
            </div>

          </div>

        </div>

      </div>

      <Footer />

    </>
  );
}