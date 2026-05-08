import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./login.css";

type UserType = "personal" | "company";

const Login = () => {
  const [userType, setUserType] = useState<UserType>("personal");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setMessage("");
      setLoading(true);

      const response = await loginUser(username, password);
      const { token, role, status } = response.data;

      if (status === "approved") {
        login(token || "", role, status);

        if (role === "company") {
          navigate("/cuser-dashboard");
        } else {
          navigate("/puser-dashboard");
        }
        return;
      }

      if (status === "pending") {
        setMessage("Admin will inform you once review is done.");
        return;
      }

      if (status === "rejected") {
        setMessage("You are rejected by admin.");
        return;
      }

    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="login-select"
          >
            <option value="personal">Personal User</option>
            <option value="company">Company User</option>
          </select>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button
            onClick={handleLogin}
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && <p className="login-error">{message}</p>}

          <p className="login-signup-link">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default Login;