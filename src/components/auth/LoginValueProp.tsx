import { Eye, Target, Sparkles } from 'lucide-react';

export default function LoginValueProp() {
  return (
    <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-primary to-primary/90 text-white items-center justify-center p-12 xl:p-20">
      <div className="max-w-2xl">
        <h2 className="text-4xl xl:text-5xl font-black mb-4">
          Your CV Transformation Awaits
        </h2>

        <p className="text-lg xl:text-xl text-white/90 mb-12">
          Join 5,000+ MBA students who've landed their dream jobs with RefineCV
        </p>

        <div className="space-y-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">90%+ ATS Pass Rate</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                See exactly what ATS sees with split-panel view. Fix formatting issues in 10 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">80-90% JD Match Score</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Instant keyword gaps and tailoring recommendations for every job description.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">★★★★★ 5-Star Bullets</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                AI-powered bullet point enhancements in 30 seconds. From weak to wow.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-6xl mb-2">"</div>
          <blockquote className="text-xl mb-6 leading-relaxed">
            RefineCV transformed my CV from 42% to 89% ATS score in 15 minutes. I went from 0 interview calls to 8 shortlists. The split-panel ATS view showed me exactly what was wrong.
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black">
              R
            </div>
            <div>
              <p className="font-black text-lg">Rohan M.</p>
              <p className="text-white/80">IIM Bangalore → Bain & Company</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>5,000+ students</span>
          </div>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>600+ IIM CVs analyzed</span>
          </div>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">✓</span>
            <span>90% success rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
