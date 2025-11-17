import Header from '../components/Header';
import Footer from '../components/Footer';
import ChaosStructureHero from '../components/enhancer/ChaosStructureHero';
import BulletPointCalculator from '../components/enhancer/BulletPointCalculator';
import TransformationExamples from '../components/enhancer/TransformationExamples';
import SuccessStories from '../components/enhancer/SuccessStories';
import FeatureComparison from '../components/enhancer/FeatureComparison';
import EnhancerFaq from '../components/enhancer/EnhancerFaq';
import FinalCTA from '../components/enhancer/FinalCTA';
import RelatedFeatures from '../components/enhancer/RelatedFeatures';

export default function CVEnhancer() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ChaosStructureHero />
        <BulletPointCalculator />
        <TransformationExamples />
        <SuccessStories />
        <FeatureComparison />
        <EnhancerFaq />
        <FinalCTA />
        <RelatedFeatures />
      </main>
      <Footer />
    </div>
  );
}
