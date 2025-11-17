import { useState, useEffect } from 'react';
import { Clock, Building2, Timer, CheckCircle, ArrowRight, Play } from 'lucide-react';

export default function FinalCTA() {
  const [daysUntil, setDaysUntil] = useState(45);

  useEffect(() => {
    const placementDate = new Date('2025-12-01');
    const today = new Date();
    const diffTime = placementDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntil(diffDays > 0 ? diffDays : 0);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-2xl px-6 lg:px-12 py-6 border-2 border-white/20">
            <div className="text-center">
              <Clock className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-4xl lg:text-5xl font-black text-white mb-1">{daysUntil}</div>
              <p className="text-white/90 text-sm font-semibold">Days Until Placement Season</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/20"></div>
            <div className="text-center">
              <Building2 className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-4xl lg:text-5xl font-black text-white mb-1">30-50</div>
              <p className="text-white/90 text-sm font-semibold">Average Applications</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/20"></div>
            <div className="text-center">
              <Timer className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-4xl lg:text-5xl font-black text-white mb-1">90-150</div>
              <p className="text-white/90 text-sm font-semibold">Hours to Tailor Manually</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
          Stop Sending Generic CVs. Start Getting Shortlisted.
        </h2>

        <div className="max-w-3xl mx-auto mb-10 space-y-4 text-lg text-white/95">
          <p>Generic CVs get 75% lower response rates.</p>
          <p>Tailoring manually takes 3-4 hours per application.</p>
          <p className="text-xl font-bold text-white mt-6">
            RefineCV shows you exact keyword gaps, match scores, and action items—in 15 minutes.
          </p>
          <p className="text-2xl font-black text-white mt-6">
            3-5x more interview calls. 90% of time saved.
          </p>
          <p className="text-xl font-bold text-white">
            That's the placement season advantage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#signup"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-2xl transition-all"
          >
            Match My CV to Any JD
            <ArrowRight className="w-6 h-6" />
          </a>
          <button className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:bg-white/10 transition-all">
            <Play className="w-6 h-6" />
            Watch 90-Sec Demo
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>5,000+ MBA students</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>80-90% match scores</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>3 free matches/day</span>
          </div>
        </div>
      </div>
    </section>
  );
}
