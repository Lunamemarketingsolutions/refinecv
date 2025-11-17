import Header from '../components/Header';
import Footer from '../components/Footer';
import ChaosStructureHero from '../components/ats/ChaosStructureHero';
import ROICalculator from '../components/ats/ROICalculator';
import ATSViewer from '../components/ats/ATSViewer';
import ProofSection from '../components/ats/ProofSection';
import FeatureDifferentiation from '../components/ats/FeatureDifferentiation';
import ATSFaq from '../components/ats/ATSFaq';
import UrgentCTA from '../components/ats/UrgentCTA';
import RelatedFeatures from '../components/ats/RelatedFeatures';

export default function ATSAnalyzer() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ChaosStructureHero />
        <ROICalculator />
        <ATSViewer />
        <ProofSection />
        <FeatureDifferentiation />
        <ATSFaq />
        <UrgentCTA />
        <RelatedFeatures />
      </main>
      <Footer />
    </div>
  );
}
