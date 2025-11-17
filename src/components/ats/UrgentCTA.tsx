import { useState, useEffect } from 'react';
import { Clock, Play } from 'lucide-react';

export default function UrgentCTA() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-01-17T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 animate-pulse">
          <Clock className="w-8 h-8 text-white" />
          <div className="text-white text-xl font-bold">Placements Start In:</div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
            <div className="text-4xl lg:text-5xl font-black text-white mb-1">
              {timeLeft.days}
            </div>
            <div className="text-white/80 text-sm font-semibold">Days</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
            <div className="text-4xl lg:text-5xl font-black text-white mb-1">
              {timeLeft.hours}
            </div>
            <div className="text-white/80 text-sm font-semibold">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
            <div className="text-4xl lg:text-5xl font-black text-white mb-1">
              {timeLeft.minutes}
            </div>
            <div className="text-white/80 text-sm font-semibold">Minutes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
            <div className="text-4xl lg:text-5xl font-black text-white mb-1">
              {timeLeft.seconds}
            </div>
            <div className="text-white/80 text-sm font-semibold">Seconds</div>
          </div>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
          Stop Guessing. Start Seeing.
        </h2>

        <p className="text-xl text-white/95 mb-8 leading-relaxed max-w-2xl mx-auto">
          75% of CVs get rejected by ATS before human eyes.
          <br />
          Don't let formatting mistakes cost you your dream job.
        </p>

        <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
          See exactly what ATS sees. Fix issues in 15 minutes.
          <br />
          Apply with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href="#upload"
            className="bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-2xl transition-all inline-flex items-center gap-2"
          >
            Analyze My CV Now
          </a>
          <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2">
            <Play className="w-5 h-5" />
            Watch 2-Min Demo
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Used by 5,000+ MBA students</span>
          </div>
          <div className="hidden sm:block text-white/50">•</div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>90%+ ATS pass rate</span>
          </div>
          <div className="hidden sm:block text-white/50">•</div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}
