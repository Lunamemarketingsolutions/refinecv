import { Link as LinkIcon, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RelatedFeatures() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-black text-secondary mb-3">
            Complete Your CV Transformation
          </h3>
          <p className="text-lg text-gray-600">
            ATS Analyzer works even better with these features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-primary/30">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <LinkIcon className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-2xl font-black text-secondary mb-4">
              JD CV Match Analyzer
            </h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              See how well your CV matches specific job descriptions. Get keyword gaps, strengths/weaknesses analysis, and tailoring recommendations.
            </p>
            <Link
              to="/features/jd-matcher"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-primary/30">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-2xl font-black text-secondary mb-4">
              Instant CV Enhancer
            </h4>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get AI-powered bullet point improvements, section-wise ratings, and authentic rephrasing suggestions that maintain your voice.
            </p>
            <a
              href="#cv-enhancer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
