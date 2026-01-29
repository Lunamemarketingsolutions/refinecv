import Header from '../components/Header';
import Footer from '../components/Footer';
import InterviewHero from '../components/interview/InterviewHero';
import ProblemSection from '../components/interview/ProblemSection';
import HowItWorks from '../components/interview/HowItWorks';
import KeyFeatures from '../components/interview/KeyFeatures';
import SampleResults from '../components/interview/SampleResults';
import BenefitsSection from '../components/interview/BenefitsSection';
import WhoItsFor from '../components/interview/WhoItsFor';
import PricingMention from '../components/interview/PricingMention';
import Testimonials from '../components/interview/Testimonials';
import InterviewFaq from '../components/interview/InterviewFaq';
import FinalCTA from '../components/interview/FinalCTA';
import RelatedFeatures from '../components/interview/RelatedFeatures';

export default function InterviewAI() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <InterviewHero />
        <ProblemSection />
        <HowItWorks />
        <KeyFeatures />
        <SampleResults />
        <BenefitsSection />
        <WhoItsFor />
        <PricingMention />
        <Testimonials />
        <InterviewFaq />
        <FinalCTA />
        <RelatedFeatures />
      </main>
      <Footer />
    </div>
  );
}
