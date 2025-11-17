import { Clock, X, CheckCircle, ArrowRight } from 'lucide-react';

export default function ChaosStructureHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-24">
      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-error/10 to-error/5"></div>
        <div className="hidden lg:block w-1/2 bg-gradient-to-br from-success/10 to-success/5"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="order-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-error/20">
            <h2 className="text-3xl lg:text-4xl font-black text-error mb-6">
              The ATS Nightmare
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Multiple ATS checkers, conflicting scores</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Scored 85%... still got rejected</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">3-5 hours per CV tailoring</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Keyword stuffing detected</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Contact info not parsed</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Tables broke everything</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">No idea what ATS actually sees</p>
              </div>
            </div>

            <div className="bg-error/10 rounded-xl p-6 text-center border-2 border-error/20">
              <div className="text-6xl lg:text-7xl font-black text-error mb-2">75%</div>
              <p className="text-gray-600">of CVs rejected by ATS before human eyes</p>
            </div>

            <div className="mt-6 flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-error" />
              <span>3-5 hours per application</span>
            </div>
          </div>

          <div className="order-3 lg:order-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-success/20">
            <h2 className="text-3xl lg:text-4xl font-black text-success mb-6">
              The RefineCV Clarity
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Single source of truth for ATS</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">See exactly what ATS sees</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">15 minutes per CV</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Natural keyword optimization</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Instant formatting fixes</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Every section parsed correctly</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">90%+ ATS pass rate guarantee</p>
              </div>
            </div>

            <div className="bg-success/10 rounded-xl p-6 text-center border-2 border-success/20">
              <div className="text-6xl lg:text-7xl font-black text-success mb-2">90%+</div>
              <p className="text-gray-600">ATS pass rate with RefineCV</p>
            </div>

            <div className="mt-6 flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-success" />
              <span>15 minutes per application</span>
            </div>
          </div>

          <div className="order-2 lg:order-3 lg:col-span-2 flex justify-center">
            <div className="text-center">
              <div className="hidden lg:flex justify-center mb-6">
                <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <a
                href="#upload"
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all"
              >
                See Your ATS Score Now
                <ArrowRight className="w-6 h-6" />
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Upload CV • Get instant ATS view • No signup required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
