import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useState, useRef, useEffect } from "react";

import logo from "../assets/Capture.Expert_logo.png";
import defaultAvatar from "../assets/default-avatar.png";

import "./dashboardHeader.css";

const DashboardHeader = () => {

  const navigate = useNavigate();

  const { logout, user, role } = useAuth();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  /* CLOSE DROPDOWN */

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const handleLogout = async () => {

    await logout();

    navigate("/", {
      replace: true,
    });

  };

  return (

    <header className="dashboard-header">

      <div className="dashboard-header-container">

        {/* LOGO */}

        <div
          className="logo"
          onClick={() =>
            navigate(
              role === "company"
                ? "/cuser-dashboard"
                : "/puser-dashboard"
            )
          }
        >

          <img
            src={logo}
            alt="Logo"
            className="logo-img"
          />

          <div className="logo-text">
            Capture<span>.Expert</span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <button
            onClick={() =>
              navigate(
                role === "company"
                  ? "/cuser-dashboard"
                  : "/puser-dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/support")
            }
          >
            Support
          </button>

        </nav>

        {/* RIGHT SIDE */}

        <div className="dashboard-right">

          <div className="notification-wrapper">
            <NotificationBell />
          </div>

          <div
            className="profile-dropdown-wrapper"
            ref={dropdownRef}
          >

            <img
              src={
                user?.profile_image ||
                defaultAvatar
              }
              alt="Profile"
              className="profile-avatar"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
              onError={(e) => {
                (
                  e.currentTarget as HTMLImageElement
                ).src = defaultAvatar;
              }}
            />

            {dropdownOpen && (

              <div className="profile-dropdown">

                <div className="dropdown-name">
                  {user?.username || "User"}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      role === "company"
                        ? "/cuser-dashboard"
                        : "/puser-dashboard"
                    )
                  }
                >
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    navigate(
                      role === "company"
                        ? "/company/profile"
                        : "/user/profile"
                    )
                  }
                >
                  Profile
                </button>

                <button
                  onClick={() =>
                    navigate("/support")
                  }
                >
                  Support
                </button>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
};

export default DashboardHeader;