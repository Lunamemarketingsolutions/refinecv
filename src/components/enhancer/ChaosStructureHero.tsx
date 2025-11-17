import { Clock, X, CheckCircle, ArrowRight, Star } from 'lucide-react';

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
              The Bullet Point Nightmare
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Responsible for..." (passive, weak)</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Helped with projects" (no specifics)</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Managed team" (no size, no outcome)</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">45 min per bullet to improve manually</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Sounds robotic when I add metrics"</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"No idea if version A or B is better"</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Asked 3 seniors, got 3 different answers"</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-secondary">"Generic action verbs don't stand out"</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-2">Example Weak Bullets:</p>
              <div className="bg-error/5 rounded-lg p-3 border border-error/20">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex gap-0.5">
                    <Star className="w-4 h-4 fill-error text-error" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Worked on marketing campaigns"</p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex gap-0.5">
                    <Star className="w-4 h-4 fill-error text-error" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Responsible for sales strategy"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex gap-0.5">
                    <Star className="w-4 h-4 fill-error text-error" />
                    <Star className="w-4 h-4 fill-error text-error" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Part of team that improved processes"</p>
                </div>
              </div>
            </div>

            <div className="bg-error/10 rounded-xl p-6 text-center border-2 border-error/20 mb-4">
              <div className="text-6xl lg:text-7xl font-black text-error mb-2">75%</div>
              <p className="text-gray-600">of MBA students struggle to write strong bullet points</p>
            </div>

            <div className="bg-error/10 rounded-xl p-6 text-center border-2 border-error/20">
              <div className="text-5xl lg:text-6xl font-black text-error mb-2">20-30</div>
              <p className="text-gray-600">bullet points needing improvement in average CV</p>
            </div>
          </div>

          <div className="order-3 lg:order-2 bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-xl border-2 border-success/20">
            <h2 className="text-3xl lg:text-4xl font-black text-success mb-6">
              The RefineCV Intelligence
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">AI rates each bullet (1-5 stars)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">3-5 improved versions per bullet</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Live CV preview (see changes instantly)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">30 seconds per enhancement</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Authentic metrics (verifiable, not fake)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Maintains your voice + amplifies impact</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-secondary">Section-by-section guidance</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-2">Example Strong Bullets:</p>
              <div className="bg-success/5 rounded-lg p-3 border border-success/20">
                <div className="flex items-start gap-2 mb-3">
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Drove 25% revenue growth through data-driven marketing campaign across 3 customer segments"</p>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Led cross-functional team of 8 to redesign sales strategy, increasing conversion rate from 12% to 18%"</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 fill-success text-success" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-700 flex-1">"Streamlined customer onboarding by implementing automated workflows, reducing time by 35%"</p>
                </div>
              </div>
            </div>

            <div className="bg-success/10 rounded-xl p-6 text-center border-2 border-success/20 mb-4">
              <div className="text-6xl lg:text-7xl font-black text-success mb-2">90%</div>
              <p className="text-gray-600">average CV score after RefineCV enhancement</p>
            </div>

            <div className="bg-success/10 rounded-xl p-6 text-center border-2 border-success/20">
              <div className="text-5xl lg:text-6xl font-black text-success mb-2">30 sec</div>
              <p className="text-gray-600">per bullet point with AI suggestions</p>
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
                Transform My Bullets
                <ArrowRight className="w-6 h-6" />
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Upload CV • Get AI suggestions • See live preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
