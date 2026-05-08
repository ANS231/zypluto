import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/Capture.Expert_logo.png";
import "./header.css";

const Header = () => {

  const navigate = useNavigate();

  const { isAuthenticated, logout, user } =
    useAuth();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] =
    useState(false);

  /* SCROLL EFFECT */

  useEffect(() => {

    const handleScrollEffect = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScrollEffect
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScrollEffect
      );

  }, []);

  /* OUTSIDE CLICK */

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <header
      className={`header ${
        scrolled ? "scrolled" : ""
      }`}
    >

      <div className="header-container">

        {/* LOGO */}

        <div
          className="logo"
          onClick={() => navigate("/")}
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

        {/* ===== NOT LOGGED IN ===== */}

        {!isAuthenticated && (
          <>

            <nav className="nav-links">

              <Link
                className="nav-link"
                to="/about"
              >
                About
              </Link>

              {/* Pricing Off */}

              {/*
              <Link
                className="nav-link"
                to="/#pricing"
              >
                Pricing
              </Link>
              */}

              {/* Contact Off */}

              {/*
              <p
                className="nav-link"
                onClick={() => {
                  if (
                    window.location.pathname ===
                    "/"
                  ) {
                    document
                      .getElementById(
                        "contact"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  } else {
                    navigate("/#contact");
                  }
                }}
              >
                Contact
              </p>
              */}

            </nav>

            <div className="nav-buttons">

              <button
                className="btn-outline"
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </button>

              <button
                className="btn-primary"
                onClick={() =>
                  navigate("/signup")
                }
              >
                Get Started
              </button>

            </div>

          </>
        )}

        {/* ===== LOGGED IN ===== */}

        {isAuthenticated && (

          <div className="nav-buttons">

            <NotificationBell />

            <div
              className="profile-dropdown-wrapper"
              ref={dropdownRef}
            >

              <img
                src={
                  user?.profile_image ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="profile-avatar"
                onClick={() =>
                  setDropdownOpen(
                    !dropdownOpen
                  )
                }
              />

              {dropdownOpen && (

                <div className="profile-dropdown">

                  <div className="dropdown-name">
                    {user?.username || "User"}
                  </div>

                  <button
                    onClick={() =>
                      navigate("/dashboard")
                    }
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        "/subscription"
                      )
                    }
                  >
                    Subscription
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

        )}

      </div>

    </header>

  );
};

export default Header;