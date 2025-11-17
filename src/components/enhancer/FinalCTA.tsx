import { Clock, Sparkles, Briefcase, ArrowRight, Play } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-8 mb-8 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Average time wasted: 2-3 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>RefineCV time: 15 minutes</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <span>30-50 applications</span>
          </div>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
          Stop Rewriting. Start Enhancing.
        </h2>

        <div className="text-lg lg:text-xl text-white/95 mb-10 space-y-3 max-w-2xl mx-auto">
          <p>Weak bullet points cost you interviews.</p>
          <p>Manual rewriting takes 2-3 hours per CV.</p>
          <p>AI enhancement takes 15 minutes.</p>
          <p className="pt-3 font-semibold">
            Get AI-powered suggestions. See live preview. Choose authentic versions. Download your perfected CV.
          </p>
          <p className="text-xl font-black">
            3-5x better bullet ratings. 12x faster than manual. That's the placement season advantage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="#enhancer-demo"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-2xl transition-all"
          >
            Enhance My CV Now
            <ArrowRight className="w-6 h-6" />
          </a>
          <button className="inline-flex items-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all border-2 border-white">
            <Play className="w-5 h-5" />
            Watch Enhancement Demo
          </button>
        </div>

        <p className="text-sm text-white/80">
          Upload CV • Get AI ratings • See live preview • Free
        </p>

        <div className="mt-8 pt-8 border-t border-white/20 flex items-center justify-center gap-6 text-sm text-white/80">
          <span>✓ 5,000+ MBA students</span>
          <span>•</span>
          <span>✓ 4.5/5 avg bullet rating</span>
          <span>•</span>
          <span>✓ 3 free enhancements/day</span>
        </div>
      </div>
    </section>
  );
}
