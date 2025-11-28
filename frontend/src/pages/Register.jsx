import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import myLogo from "../assets/logo.png";
import "../styles/auth.css";
import { authRepository } from "../api/repositories/authRepository";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errors, setErrors] = useState({});

  const [serverErrors, setServerErrors] = useState({});

  const [backendError, setBackendError] = useState("");

  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-]).{8,}$/.test(password);

  const validateFullName = (name) => {
    const words = name.trim().split(/\s+/);
    return /^[A-Za-z\s]+$/.test(name) && words.length >= 2;
  };

  const renderRuleIcon = (isValid) =>
    isValid ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerErrors({});
    setBackendError("");

    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (!validateFullName(fullName))
      newErrors.fullName = "Full name must contain at least 2 words";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password) {
      newErrors.password = "Password is required";
      setShowPasswordRules(true);
    } else if (!validatePassword(password)) {
      newErrors.password = "Password is weak";
      setShowPasswordRules(true);
    } else {
      setShowPasswordRules(false);
    }

    if (!confirm) newErrors.confirm = "Please confirm password";
    else if (confirm !== password) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authRepository.register(fullName, email, password);
      console.log("Register success", res);


    } catch (err) {
      console.log("Backend error:", err);

      if (err?.fieldErrors) {
        setServerErrors(err.fieldErrors);
        return;
      }

      setBackendError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-gradient">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="login-wrapper"
      >
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-box">
            <img src={myLogo} alt="Logo" className="logo-img" />
          </div>
          <h1 className="logo-title">VoteSystem</h1>
          <p className="logo-subtitle">Create your account</p>
        </div>

        {/* Card */}
        <motion.div style={{ width: "100%" }}>
          <AuthCard title="Create Account" subtitle="Create a new account to start voting">
            <form onSubmit={handleSubmit} className="space">

              {/* Full Name */}
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName || serverErrors.fullName}
              />
              {(errors.fullName || serverErrors.fullName) && (
                <p className="error-text icon-error">
                  <AlertCircle size={16} />
                  {errors.fullName || serverErrors.fullName}
                </p>
              )}

              {/* Email */}
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

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);

                  setPasswordRules({
                    length: val.length >= 8,
                    lowercase: /[a-z]/.test(val),
                    uppercase: /[A-Z]/.test(val),
                    number: /\d/.test(val),
                    special: /[@$!%*?&_\-]/.test(val),
                  });

                  if (showPasswordRules) setShowPasswordRules(true);
                }}
                error={errors.password || serverErrors.password}
              />
              {(errors.password || serverErrors.password) && (
                <p className="error-text icon-error">
                  <AlertCircle size={16} />
                  {errors.password || serverErrors.password}
                </p>
              )}

              {/* Password Rules (live) */}
              {showPasswordRules && (
                <div className="password-rules">
                  <p className={passwordRules.length ? "rule-ok" : "rule-fail"}>
                    {renderRuleIcon(passwordRules.length)} At least 8 characters
                  </p>
                  <p className={passwordRules.lowercase ? "rule-ok" : "rule-fail"}>
                    {renderRuleIcon(passwordRules.lowercase)} One lowercase letter
                  </p>
                  <p className={passwordRules.uppercase ? "rule-ok" : "rule-fail"}>
                    {renderRuleIcon(passwordRules.uppercase)} One uppercase letter
                  </p>
                  <p className={passwordRules.number ? "rule-ok" : "rule-fail"}>
                    {renderRuleIcon(passwordRules.number)} One number
                  </p>
                  <p className={passwordRules.special ? "rule-ok" : "rule-fail"}>
                    {renderRuleIcon(passwordRules.special)} One special character
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm || serverErrors.confirm}
              />
              {(errors.confirm || serverErrors.confirm) && (
                <p className="error-text icon-error">
                  <AlertCircle size={16} />
                  {errors.confirm || serverErrors.confirm}
                </p>
              )}

              {/* GLOBAL BACKEND ERROR */}
              {backendError && (
                <p className="error-text icon-error global-error">
                  <AlertCircle size={16} />
                  {backendError}
                </p>
              )}

              <button className="auth-btn" type="submit">
                Create Account
              </button>

              <p className="toggle-text">
                Already have an account? <Link className="toggle-link" to="/login">Sign in</Link>
              </p>
            </form>
          </AuthCard>
        </motion.div>

        <p className="footer-text">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}