import { Star, TrendingUp, Clock, Zap } from 'lucide-react';

export default function SuccessStories() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Real Students, Real Transformations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            MBA students who enhanced their CVs with RefineCV and landed their dream jobs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border-2 border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-error/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Before</p>
                <div className="flex gap-0.5 mb-1">
                  <Star className="w-4 h-4 fill-error text-error" />
                  <Star className="w-4 h-4 fill-error text-error" />
                  <Star className="w-4 h-4 text-gray-300" />
                  <Star className="w-4 h-4 text-gray-300" />
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-xs text-gray-600">0 interview calls</p>
              </div>
              <div className="bg-success/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">After</p>
                <div className="flex gap-0.5 mb-1">
                  <Star className="w-4 h-4 fill-success text-success" />
                  <Star className="w-4 h-4 fill-success text-success" />
                  <Star className="w-4 h-4 fill-success text-success" />
                  <Star className="w-4 h-4 fill-success text-success" />
                  <Star className="w-4 h-4 fill-success text-success" />
                </div>
                <p className="text-xs text-gray-600">9 interview calls</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 italic">
              "I was stuck on 'Managed team of 5.' RefineCV gave me 5 versions. I picked: 'Led cross-functional team of 5 (marketing, tech, ops) to launch product feature in 6-week sprint, achieving 5,000 user signups in Week 1.' It felt real because I actually did that—I just didn't know how to say it powerfully."
            </p>

            <div className="border-t border-gray-200 pt-4">
              <p className="font-black text-secondary text-lg">Aditi R.</p>
              <p className="text-primary font-semibold">IIM Kozhikode → Bain & Company</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                ★★☆☆☆ → ★★★★★ in 15 minutes
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border-2 border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-error/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Before</p>
                <p className="text-lg font-black text-error">3 hours</p>
                <p className="text-xs text-gray-600">per CV rewrite</p>
              </div>
              <div className="bg-success/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">After</p>
                <p className="text-lg font-black text-success">15 min</p>
                <p className="text-xs text-gray-600">entire CV</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 italic">
              "The live preview was game-changing. I could see exactly how my changes looked in the actual CV format. And the section-by-section approach meant I wasn't overwhelmed—I tackled Work Experience, then Education, then Projects. By the end, my CV score went from 65% to 94%."
            </p>

            <div className="border-t border-gray-200 pt-4">
              <p className="font-black text-secondary text-lg">Rohan M.</p>
              <p className="text-primary font-semibold">XLRI → McKinsey</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-bold">
                <Clock className="w-4 h-4" />
                12x faster (3 hrs → 15 min)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border-2 border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-error/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Before</p>
                <p className="text-sm text-error font-semibold">Generic bullets</p>
                <p className="text-xs text-gray-600">No verification</p>
              </div>
              <div className="bg-success/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">After</p>
                <p className="text-sm text-success font-semibold">Verified metrics</p>
                <p className="text-xs text-gray-600">With proof</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6 italic">
              "The authentication piece was huge for me. RefineCV suggested metrics I could actually verify. When my placement committee asked for proof, I had manager emails backing every claim. That confidence showed in interviews."
            </p>

            <div className="border-t border-gray-200 pt-4">
              <p className="font-black text-secondary text-lg">Sneha K.</p>
              <p className="text-primary font-semibold">ISB → Google Product Management</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-bold">
                <Zap className="w-4 h-4" />
                Generic → Verifiable + Powerful
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Star className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-5xl font-black text-primary mb-2">4.5/5</div>
            <p className="text-sm text-gray-600 font-semibold">Average Bullet Rating</p>
            <p className="text-xs text-gray-500 mt-1">After RefineCV enhancement</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-5xl font-black text-primary mb-2">35%</div>
            <p className="text-sm text-gray-600 font-semibold">CV Score Improvement</p>
            <p className="text-xs text-gray-500 mt-1">On average (65% → 90%)</p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-5xl font-black text-primary mb-2">12x</div>
            <p className="text-sm text-gray-600 font-semibold">Faster</p>
            <p className="text-xs text-gray-500 mt-1">Than manual rewriting</p>
          </div>
        </div>
      </div>
    </section>
  );
}
