import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">VoteSphere</div>

        <div className="nav-links">
          <a href="/#">Features</a>
          <a href="/#">How It Works</a>
          <a href="/#">About</a>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Modern Voting Made Simple & Secure</h1>
        <p>
          A comprehensive digital voting system built for organizations, schools, and associations.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Start for Free
          </button>
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <Stat number="24" label="Elections Today" />
        <Stat number="1,237" label="Active Voters" />
        <Stat number="16" label="Organizations" />
      </div>

      {/* Features */}
      <section>
        <h2 className="section-title">Everything You Need for Secure Voting</h2>

        <div className="features">
          <FeatureCard title="Secure & Transparent" desc="End-to-end encryption with verifiable audit logs." />
          <FeatureCard title="Mobile & Web Compatible" desc="Vote from any device, anywhere." />
          <FeatureCard title="Fast Notifications" desc="Email & SMS alerts for voters." />
          <FeatureCard title="Private Ballots" desc="Anonymous and fair digital elections." />
          <FeatureCard title="Scheduled Voting" desc="Automated election opening & closing." />
          <FeatureCard title="Real-Time Results" desc="Instant result generation with full reports." />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="step-container">
          <StepCard number="01" text="Create an account & set up your organization." />
          <StepCard number="02" text="Set up candidates and customize ballot options." />
          <StepCard number="03" text="Share links & manage voter access." />
          <StepCard number="04" text="View results instantly with full analytics." />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Ready to Modernize Your Elections?</h3>
        <p>Start creating secure digital elections in minutes.</p>
        <button className="btn-primary" onClick={() => navigate("/register")}>
          Create Election
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 VoteSphere. All rights reserved.</p>
      </footer>

    </div>
  );
}

/* Components */
function FeatureCard({ title, desc }) {
  return (
    <div className="feature-card">
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function StepCard({ number, text }) {
  return (
    <div className="step-card">
      <p className="step-number">{number}</p>
      <p className="step-text">{text}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="stat">
      <p className="stat-number">{number}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

