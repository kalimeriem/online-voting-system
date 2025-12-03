import React from 'react';
import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import Stats from "./sections/Stats.jsx";
import Features from "./sections/Features.jsx";
import HowItWorks from "./sections/HowItWorks.jsx";
import Trust from "./sections/Trust.jsx";
import CTA from "./sections/CTA.jsx";
import Footer from "./sections/Footer.jsx";
import './App.css';

function Homepage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;