import { Link } from 'react-router-dom';
import { RefreshCw, Eye } from 'lucide-react';

export default function NextStepsSection() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary text-center">
          What's Next?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary hover:border-primary transition-colors">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-secondary mb-3">
            Apply Changes & Re-analyze
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Make the recommended changes to your CV, then upload your updated version to see your new match score. Target: 90%+! Each iteration gets you closer to the perfect match.
          </p>
          <div className="space-y-2 text-sm mb-6">
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Add missing keywords</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Reframe for PM language</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Strengthen partial matches</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>See your score improve in real-time</span>
            </p>
          </div>
          <Link
            to="/jd-match-tool"
            className="block w-full bg-primary text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Analyze Updated CV
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-success hover:border-success transition-colors">
          <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-secondary mb-3">
            Check ATS Compatibility
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Once your CV matches the JD well (80%+), make sure it's also ATS-compatible. Check formatting, contact info parsing, and section detection.
          </p>
          <div className="space-y-2 text-sm mb-6">
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Split-panel ATS view</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Format issue detection</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>One-click fixes</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>90%+ ATS pass rate</span>
            </p>
          </div>
          <Link
            to="/ats-tool"
            className="block w-full bg-success text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-success/90 transition-colors"
          >
            Run ATS Analyzer →
          </Link>
        </div>
      </div>
    </section>
  );
}
