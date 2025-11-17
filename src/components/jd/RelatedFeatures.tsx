import { Eye, Sparkles, ArrowRight } from 'lucide-react';

export default function RelatedFeatures() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-black text-secondary mb-4">
            Complete Your Placement Toolkit
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 rounded-xl p-4">
                <Eye className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-black text-secondary mb-2">ATS Analyzer</h4>
                <p className="text-gray-700 leading-relaxed">
                  Make sure your tailored CV actually passes ATS. See split-panel view of what ATS sees vs your formatted CV. Fix issues in 10 minutes.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-black text-primary mb-1">90%+</div>
                  <p className="text-xs text-gray-600">ATS Pass Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">15 min</div>
                  <p className="text-xs text-gray-600">To Fix Issues</p>
                </div>
              </div>
            </div>
            <a
              href="/features/ats-analyzer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors"
            >
              Check ATS Compatibility
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 rounded-xl p-4">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-black text-secondary mb-2">Instant CV Enhancer</h4>
                <p className="text-gray-700 leading-relaxed">
                  Once your CV matches the JD, enhance bullet points with AI-powered suggestions. Get authentic rephrasing that maintains your voice while amplifying impact.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-black text-primary mb-1">3x</div>
                  <p className="text-xs text-gray-600">Impact Boost</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">5 min</div>
                  <p className="text-xs text-gray-600">Per Bullet Point</p>
                </div>
              </div>
            </div>
            <a
              href="#cv-enhancer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors"
            >
              Improve CV Quality
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-6 lg:p-8 border-2 border-primary/20 text-center">
          <h4 className="text-2xl font-black text-secondary mb-3">The Complete RefineCV Flow</h4>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-left">
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 flex-1 max-w-xs">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-bold text-secondary mb-1">JD Match Analyzer</p>
                <p className="text-sm text-gray-600">Find gaps, get 80-90% match</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 flex-1 max-w-xs">
              <div className="bg-success text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-bold text-secondary mb-1">ATS Analyzer</p>
                <p className="text-sm text-gray-600">Ensure ATS compatibility</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 flex-1 max-w-xs">
              <div className="bg-warning text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-bold text-secondary mb-1">CV Enhancer</p>
                <p className="text-sm text-gray-600">Polish bullet points</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-secondary">
            All three tools work together to get you from generic CV to interview-ready in under 30 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
