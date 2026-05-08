import { useState } from "react";
import { Link } from "react-router-dom";
import {
  companySignup,
  personalSignup,
} from "../../services/authService";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "./signup.css";

export default function Signup() {

  const [userType, setUserType] =
    useState<"personal" | "company">(
      "personal"
    );

  const [form, setForm] =
    useState<any>({});

  const [message, setMessage] =
    useState("");

  const [isError, setIsError] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e: any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleFile = (e: any) => {

    if (
      e.target.files &&
      e.target.files.length > 0
    ) {

      setForm({
        ...form,
        [e.target.name]:
          e.target.files[0],
      });

    }

  };

  const handleSubmit = async (
    e: any
  ) => {

    e.preventDefault();

    setMessage("");

    setIsError(false);

    if (
      form.password !==
      form.reenter_password
    ) {

      setMessage(
        "Passwords do not match"
      );

      setIsError(true);

      return;

    }

    const data = new FormData();

    Object.keys(form).forEach(
      (key) => {

        if (
          form[key] !== undefined &&
          form[key] !== null
        ) {

          data.append(
            key,
            form[key]
          );

        }

      }
    );

    try {

      setLoading(true);

      if (
        userType === "company"
      ) {

        await companySignup(data);

      } else {

        await personalSignup(data);

      }

      setMessage(
        "Signup submitted successfully. Admin will review your request."
      );

      setIsError(false);

      setForm({});

    } catch (err: any) {

      setMessage(
        err.response?.data?.detail ||
          "Signup failed"
      );

      setIsError(true);

    } finally {

      setLoading(false);

    }

  };

  return (
    <>

      <Header />

      <div className="signup-page">

        <div className="signup-card">

          <h2>
            Create Account
          </h2>

          {/* TOGGLE */}

          <div className="signup-toggle">

            <button
              type="button"
              className={
                userType === "personal"
                  ? "active"
                  : ""
              }
              onClick={() => {

                setUserType(
                  "personal"
                );

                setForm({});

                setMessage("");

              }}
            >
              Personal
            </button>

            <button
              type="button"
              className={
                userType === "company"
                  ? "active"
                  : ""
              }
              onClick={() => {

                setUserType(
                  "company"
                );

                setForm({});

                setMessage("");

              }}
            >
              Company
            </button>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
          >

            {userType ===
              "company" && (
              <>

                <input
                  className="signup-input"
                  name="company_name"
                  placeholder="Company Name"
                  onChange={
                    handleChange
                  }
                  required
                />

                <input
                  className="signup-input"
                  name="address"
                  placeholder="Company Address"
                  onChange={
                    handleChange
                  }
                  required
                />

                <input
                  className="signup-input"
                  name="email"
                  placeholder="Director Email"
                  onChange={
                    handleChange
                  }
                  required
                />

              </>
            )}

            {userType ===
              "personal" && (
              <>

                <input
                  className="signup-input"
                  name="full_name"
                  placeholder="Full Name"
                  onChange={
                    handleChange
                  }
                  required
                />

                <input
                  className="signup-input"
                  name="address"
                  placeholder="Address"
                  onChange={
                    handleChange
                  }
                  required
                />

              </>
            )}

            <select
              className="signup-input"
              name="region"
              onChange={
                handleChange
              }
              required
            >

              <option value="">
                Select Region
              </option>

              <option value="IN">
                India
              </option>

              <option value="US">
                United States
              </option>

              <option value="EU">
                Europe
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

            <input
              className="signup-input"
              name="username"
              placeholder="Username"
              onChange={
                handleChange
              }
              required
            />

            <input
              className="signup-input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={
                handleChange
              }
              required
            />

            <input
              className="signup-input"
              name="reenter_password"
              type="password"
              placeholder="Confirm Password"
              onChange={
                handleChange
              }
              required
            />

            {/* FILES */}

            {/*<div className="signup-files">

              <div className="signup-documents-box">

                <h4>
                  Required Verification
                  Documents
                </h4>

                {userType ===
                "company" ? (

                  <ul>

                    <li>
                      📄 Company
                      Agreement / MOU
                    </li>

                    <li>
                      🪪 Director
                      National ID
                    </li>

                    <li>
                      📸 Director
                      Photo
                    </li>

                    <li>
                      🏢 Company
                      Address Proof
                    </li>

                  </ul>

                ) : (

                  <ul>

                    <li>
                      🪪 Government
                      National ID
                    </li>

                    <li>
                      📸 Photo
                    </li>

                    <li>
                      🏠 Address Proof
                    </li>

                  </ul>

                )}

              </div>

              {userType ===
              "company" ? (
                <>

                  <label className="upload-label">
                    Upload Company
                    Agreement / MOU
                  </label>

                  <input
                    type="file"
                    name="mou"
                    onChange={
                      handleFile
                    }
                    required
                  />

                  <label className="upload-label">
                    Upload Director
                    National ID
                  </label>

                  <input
                    type="file"
                    name="director_national_id"
                    onChange={
                      handleFile
                    }
                    required
                  />

                  <label className="upload-label">
                    Upload Director
                    Photo
                  </label>

                  <input
                    type="file"
                    name="director_live_photo"
                    onChange={
                      handleFile
                    }
                    required
                  />

                  <label className="upload-label">
                    Upload Company
                    Address Proof
                  </label>

                  <input
                    type="file"
                    name="address_proof"
                    onChange={
                      handleFile
                    }
                    required
                  />

                </>
              ) : (
                <>

                   <label className="upload-label">
                    Upload National ID
                  </label>

                  <input
                    type="file"
                    name="national_id"
                    onChange={
                      handleFile
                    }
                    required
                  />

                  <label className="upload-label">
                    Upload Photo 
                  </label>

                  <input
                    type="file"
                    name="live_photo"
                    onChange={
                      handleFile
                    }
                    required
                  />

                  <label className="upload-label">
                    Upload Address
                    Proof
                  </label>

                  <input
                    type="file"
                    name="address_proof"
                    onChange={
                      handleFile
                    }
                    required
                  /> 

                </>
              )}

            </div>*/} 

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : "Create Account"}

            </button>

          </form>

          {message && (

            <div
              className={
                isError
                  ? "signup-error"
                  : "signup-success"
              }
            >

              {message}

            </div>

          )}

          <p className="signup-login-link">

            Already have an account?

            {" "}

            <Link to="/login">
              Login here
            </Link>

          </p>

        </div>

      </div>

      <Footer />

    </>
  );
}