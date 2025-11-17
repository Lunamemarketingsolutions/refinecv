import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            Start Free, Upgrade When Ready
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="inline-block bg-success/10 text-success px-4 py-2 rounded-lg font-bold text-sm mb-4">
              FREE
            </div>

            <div className="mb-6">
              <div className="text-4xl font-black text-secondary">₹0</div>
              <div className="text-gray-600">/month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">3 analyses per day</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">Basic ATS score</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">Basic JD match percentage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">Limited CV suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">Dashboard access</span>
              </li>
            </ul>

            <a
              href="/signup"
              className="block w-full text-center border-2 border-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all"
              data-cta="pricing-free"
            >
              Get Started Free
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-primary relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm">
                🔥 Launch Offer
              </div>
            </div>

            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm mb-4">
              PREMIUM
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-secondary">₹499</div>
                <div className="text-xl text-gray-400 line-through">₹999</div>
              </div>
              <div className="text-gray-600">/month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Unlimited analyses</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Advanced ATS breakdown</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Detailed section-wise ratings</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">AI-powered rephrasing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">LinkedIn connection suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Job matching engine</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Export reports (PDF)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-secondary font-semibold">Priority support</span>
              </li>
            </ul>

            <a
              href="/signup"
              className="block w-full text-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:scale-105 hover:shadow-xl transition-all"
              data-cta="pricing-premium"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/pricing" className="text-primary font-semibold hover:underline">
            View Full Pricing Details →
          </a>
        </div>
      </div>
    </section>
  );
}
