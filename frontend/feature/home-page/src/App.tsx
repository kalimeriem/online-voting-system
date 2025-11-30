
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import Trust from "./sections/Trust";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

export default function App() {
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
