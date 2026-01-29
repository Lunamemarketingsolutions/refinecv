import { Link } from 'react-router-dom';
import { Mic, CheckCircle } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mic className="w-16 h-16 text-white mx-auto mb-8" />

        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
          Ready to Master Your Interview?
        </h2>

        <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
          Join 5,000+ students who've improved their interview scores by 87%
          with Interview Me AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/signup"
            className="bg-white text-purple-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
          >
            Start Practicing Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            to="/login"
            className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2"
          >
            Login to Practice
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/90">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            No credit card required for Free Tier
          </span>
        </div>
      </div>
    </section>
  );
}
