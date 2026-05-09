import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import "./UserProfile.css";

interface UserProfileType {
  full_name: string;
  address: string;
  username: string;
  status: string;
  created_at: string;
}

export default function UserProfile() {

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || "Failed to fetch profile");
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

          <h2 className="profile-title">User Profile</h2>

          <div className="profile-grid">

            <div className="profile-item">
              <span>Full Name</span>
              <p>{profile.full_name}</p>
            </div>

            <div className="profile-item">
              <span>Username</span>
              <p>{profile.username}</p>
            </div>

            <div className="profile-item">
              <span>Address</span>
              <p>{profile.address}</p>
            </div>

            <div className="profile-item">
              <span>Status</span>
              <p>{profile.status}</p>
            </div>

            <div className="profile-item">
              <span>Created At</span>
              <p>{profile.created_at}</p>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}