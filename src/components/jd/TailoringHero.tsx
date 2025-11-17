import { Clock, X, CheckCircle, ArrowRight } from 'lucide-react';

export default function TailoringHero() {
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
              The Tailoring Nightmare
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Same CV sent to 50+ companies</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">No idea which keywords matter</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">3-4 hours per tailored version</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Generic CV = 75% lower response</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Consulting vs PM vs Marketing—different formats?</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Which bullet points to emphasize?</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Copy-pasting keywords feels fake</p>
              </div>
            </div>

            <div className="bg-error/10 rounded-xl p-6 text-center border-2 border-error/20">
              <div className="text-6xl lg:text-7xl font-black text-error mb-2">75%</div>
              <p className="text-gray-600">lower response rate for generic CVs</p>
            </div>

            <div className="mt-6 bg-error/5 rounded-lg p-4 border border-error/20">
              <div className="text-4xl lg:text-5xl font-black text-error mb-1">20-50+</div>
              <p className="text-gray-600 text-sm">CV versions needed during placement season</p>
            </div>
          </div>

          <div className="order-3 lg:order-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-success/20">
            <h2 className="text-3xl lg:text-4xl font-black text-success mb-6">
              The RefineCV Precision
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Instant match % for any JD</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">See exact keyword gaps</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Tailored in 15 minutes</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">3x higher response rate</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Role-specific framing suggestions</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Know which bullet points to emphasize</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Natural keyword integration (no stuffing)</p>
              </div>
            </div>

            <div className="bg-success/10 rounded-xl p-6 text-center border-2 border-success/20">
              <div className="text-6xl lg:text-7xl font-black text-success mb-2">87%</div>
              <p className="text-gray-600">average match score with RefineCV</p>
            </div>

            <div className="mt-6 bg-success/5 rounded-lg p-4 border border-success/20">
              <div className="text-4xl lg:text-5xl font-black text-success mb-1">15 min</div>
              <p className="text-gray-600 text-sm">to create perfectly tailored CV</p>
            </div>
          </div>

          <div className="order-2 lg:order-3 lg:col-span-2 flex justify-center">
            <div className="text-center">
              <div className="hidden lg:flex justify-center mb-6">
                <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <a
                href="#calculator"
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all"
              >
                Check My Match Score
                <ArrowRight className="w-6 h-6" />
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Upload CV + Paste JD • Get instant match % • Free
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
