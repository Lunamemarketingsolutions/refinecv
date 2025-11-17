import { Eye, Link2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RelatedFeatures() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-4xl font-black text-secondary mb-4">
            Complete Your CV Transformation
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-primary transition-colors">
            <Eye className="w-12 h-12 text-primary mb-4" />
            <h4 className="text-2xl font-black text-secondary mb-3">ATS Analyzer</h4>
            <p className="text-gray-600 mb-6">
              After enhancing your bullets, make sure they pass ATS. See split-panel view of your CV vs what ATS reads. Fix formatting issues in 10 minutes.
            </p>
            <Link
              to="/features/ats-analyzer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Check ATS Score
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-primary transition-colors">
            <Link2 className="w-12 h-12 text-primary mb-4" />
            <h4 className="text-2xl font-black text-secondary mb-3">JD CV Match Analyzer</h4>
            <p className="text-gray-600 mb-6">
              Once your bullets are strong, tailor them for specific job descriptions. Get keyword gap analysis, match %, and role-specific framing suggestions.
            </p>
            <Link
              to="/features/jd-matcher"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              Match CV to JDs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
