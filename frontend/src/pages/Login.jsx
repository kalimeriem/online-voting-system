import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import myLogo from "../assets/logo.png";
import "../styles/auth.css";
import { authRepository } from "../api/repositories/authRepository";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerErrors({});
    setBackendError("");

    if (!validate()) return;

    try {
      const res = await authRepository.login(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      console.log("Login successful", res);

      navigate("/dashboard");

    } catch (err) {
      console.log("Backend error:", err);

      if (err?.fieldErrors) {
        setServerErrors(err.fieldErrors);
        return;
      }

      setBackendError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-gradient">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-wrapper"
      >
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-box">
            <img src={myLogo} alt="Logo" className="logo-img" />
          </div>
          <h1 className="logo-title">VoteSystem</h1>
          <p className="logo-subtitle">Secure and transparent voting platform</p>
        </div>

        {/* Card */}
        <motion.div style={{ width: "100%" }}>
          <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
            <div className="space">

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email || serverErrors.email}
              />
              {(errors.email || serverErrors.email) && (
                <p className="error-text icon-error">
                  <AlertCircle size={16} />
                  {errors.email || serverErrors.email}
                </p>
              )}

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password || serverErrors.password}
              />
              {(errors.password || serverErrors.password) && (
                <p className="error-text icon-error">
                  <AlertCircle size={16} />
                  {errors.password || serverErrors.password}
                </p>
              )}

              {backendError && (
                <p className="error-text icon-error global-error">
                  <AlertCircle size={16} />
                  {backendError}
                </p>
              )}

              <button className="auth-btn" onClick={handleSubmit}>
                Sign In
              </button>

              <p className="toggle-text">
                Don't have an account?{" "}
                <Link className="toggle-link" to="/register">
                  Create account
                </Link>
              </p>
            </div>
          </AuthCard>
        </motion.div>

        <p className="footer-text">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
