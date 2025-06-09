import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeatureSection from "../components/landing/FeatureSection";
import Footer from "../components/landing/Footer";


const LandingPage = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Footer />
      </div>
    </div>
  );
};
export default LandingPage;