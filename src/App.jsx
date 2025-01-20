import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tokenomics from './components/Tokenomics';
import About from './components/About';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import PartnersSection from "./components/PartnersSection";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (in ms)
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Tokenomics />
      <Roadmap />
      <FAQ />
      <PartnersSection />
      <Footer />
    </div>
  );
}

export default App;
