import { useState } from "react";
import { Link } from "react-router-dom";
import { companySignup } from "../../services/authService";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import "./signup.css";

export default function Signup() {

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

      await companySignup(data);

      setMessage(
        "Company registration submitted successfully. Admin will review your request."
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
            Company Registration
          </h2>

          <p className="signup-subtitle">
            Only verified companies can create accounts.
          </p>

          <form
            onSubmit={handleSubmit}
          >

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
              type="email"
              placeholder="Authorized Representative Email"
              onChange={
                handleChange
              }
              required
            />

            <input
              className="signup-input"
              name="position"
              placeholder="Position / Role (CEO, Director, Manager, Founder, etc.)"
              onChange={
                handleChange
              }
              required
            />

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

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : "Register Company"}

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