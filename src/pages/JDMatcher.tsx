import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TailoringHero from '../components/jd/TailoringHero';
import PlacementCalculator from '../components/jd/PlacementCalculator';
import CVUploadForm from '../components/jd/CVUploadForm';
import JDMatchViewer from '../components/jd/JDMatchViewer';
import RoleFraming from '../components/jd/RoleFraming';
import KeywordVenn from '../components/jd/KeywordVenn';
import JDTestimonials from '../components/jd/JDTestimonials';
import FeatureComparison from '../components/jd/FeatureComparison';
import JDFaq from '../components/jd/JDFaq';
import FinalCTA from '../components/jd/FinalCTA';
import RelatedFeatures from '../components/jd/RelatedFeatures';
import { CVAnalysis } from '../lib/supabase';

export default function JDMatcher() {
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);

  const handleAnalysisComplete = (newAnalysis: CVAnalysis) => {
    setAnalysis(newAnalysis);
    setTimeout(() => {
      document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <TailoringHero />
        <PlacementCalculator />
        <section id="viewer" className="py-16 lg:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
                Analyze Your CV-JD Match
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Upload your CV and paste any job description. Get instant match analysis with keyword gaps, strengths, weaknesses, and tailoring recommendations.
              </p>
            </div>
            <CVUploadForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </section>
        <div id="analysis-results">
          <JDMatchViewer analysis={analysis} />
        </div>
        <RoleFraming />
        <KeywordVenn />
        <JDTestimonials />
        <FeatureComparison />
        <JDFaq />
        <FinalCTA />
        <RelatedFeatures />
      </main>
      <Footer />
    </div>
  );
}
