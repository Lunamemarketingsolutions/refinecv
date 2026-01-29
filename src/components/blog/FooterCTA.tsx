import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function FooterCTA() {
  return (
    <section className="bg-[#2762ea] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Land Your Dream Job?
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join 10,000+ students who've improved their CVs with RefineCV
        </p>

        <Link
          to="/signup"
          className="inline-block bg-white text-[#2762ea] font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-50 transition-colors shadow-lg"
        >
          Get Started Free →
        </Link>
      </div>
    </section>
  );
}
