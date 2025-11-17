import { CheckCircle, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [atsScore, setAtsScore] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setAtsScore(prev => {
        if (prev >= 86) {
          clearInterval(interval);
          return 86;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-b from-background to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🎓</span>
              <span className="text-sm font-semibold text-secondary">Trusted by 5,000+ MBA Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary leading-tight">
              Stop Guessing Why Your CV Gets Rejected
            </h1>

            <h3 className="text-xl sm:text-2xl text-gray-600 font-semibold">
              Transform your resume into a bespoke, JD-specific profile in minutes. Get data-driven insights from 600+ elite IIM CVs.
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-secondary">Instantly unlock hidden strengths and critical gaps</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-secondary">Get authentic, actionable ATS-ready recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg text-secondary">Know exactly why you got shortlisted—or didn't</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/signup"
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all text-center"
                data-cta="hero-primary"
              >
                Get Started Free
              </a>
              <a
                href="#demo"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center gap-2"
                data-cta="hero-secondary"
              >
                <Play className="w-5 h-5" />
                Try a Demo
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Free tier: 3 analyses per day • No credit card required
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-secondary">ATS Score</h3>
                  <span className="text-sm text-gray-500">Updated</span>
                </div>

                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#F7F7FE"
                      strokeWidth="16"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={atsScore >= 86 ? '#10B981' : '#F59E0B'}
                      strokeWidth="16"
                      strokeDasharray={`${(atsScore / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-5xl font-black ${atsScore >= 86 ? 'text-success' : 'text-warning'}`}>
                        {atsScore}
                      </div>
                      <div className="text-sm text-gray-500">/ 100</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm font-semibold text-secondary">Contact Info</span>
                    <span className="text-success font-bold">95</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm font-semibold text-secondary">Work Experience</span>
                    <span className="text-success font-bold">88</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm font-semibold text-secondary">Education</span>
                    <span className="text-success font-bold">92</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm font-semibold text-secondary">Skills</span>
                    <span className="text-warning font-bold">78</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Job Match</span>
                  <span className="text-lg font-bold text-primary">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
