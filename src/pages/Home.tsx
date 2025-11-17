import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ProblemStatement from '../components/ProblemStatement';
import HowItWorks from '../components/HowItWorks';
import KeyFeatures from '../components/KeyFeatures';
import BeforeAfter from '../components/BeforeAfter';
import Testimonials from '../components/Testimonials';
import FeatureTools from '../components/FeatureTools';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemStatement />
        <HowItWorks />
        <KeyFeatures />
        <BeforeAfter />
        <Testimonials />
        <FeatureTools />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
