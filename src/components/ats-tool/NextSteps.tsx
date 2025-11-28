import { Link } from 'react-router-dom';
import { RefreshCw, Target } from 'lucide-react';

export default function NextSteps() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary">
          🚀 What's Next?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-primary transition-colors">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-secondary mb-3">
            Fix Your CV & Re-analyze
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Apply the recommendations above, then upload your updated CV to see the improvement.
          </p>
          <Link
            to="/ats-tool"
            className="block w-full bg-primary text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Analyze Updated CV
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-success transition-colors">
          <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-secondary mb-3">
            Match Your CV to Specific JDs
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Now that your CV is ATS-compatible, tailor it to specific job descriptions for even better results.
          </p>
          <Link
            to="/features/jd-matcher"
            className="block w-full bg-success text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-success/90 transition-colors"
          >
            Try JD CV Match →
          </Link>
        </div>
      </div>
    </section>
  );
}
