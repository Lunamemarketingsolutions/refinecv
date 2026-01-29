import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function PricingMention() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />

        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
          Interview Me AI is included in all RefineCV plans
        </h2>

        <div className="text-lg sm:text-xl text-white/90 space-y-2 mb-8">
          <p className="font-semibold">Free Tier: 2 practice sessions per month</p>
          <p className="font-semibold">
            Premium: Unlimited practice sessions + progress tracking
          </p>
          <p className="text-2xl font-bold text-white mt-4">
            Starting at ₹99/month or ₹999/year
          </p>
        </div>

        <Link
          to="/pricing"
          className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
        >
          See Pricing Plans
        </Link>
      </div>
    </section>
  );
}
