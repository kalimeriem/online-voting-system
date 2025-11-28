import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import myLogo from "../assets/logo.png";
import "../styles/auth.css";

export default function Register() {
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
                    {passwordRules.length ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />} At least 8 characters
                  </p>
                  <p className={passwordRules.lowercase ? "rule-ok" : "rule-fail"}>
                    {passwordRules.lowercase ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />} One lowercase letter
                  </p>
                  <p className={passwordRules.uppercase ? "rule-ok" : "rule-fail"}>
                    {passwordRules.uppercase ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />} One uppercase letter
                  </p>
                  <p className={passwordRules.number ? "rule-ok" : "rule-fail"}>
                    {passwordRules.number ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />} One number
                  </p>
                  <p className={passwordRules.special ? "rule-ok" : "rule-fail"}>
                    {passwordRules.special ? <CheckCircle size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />} One special character
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

