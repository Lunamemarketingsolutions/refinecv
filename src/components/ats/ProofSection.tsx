import { TrendingUp, Clock, Users } from 'lucide-react';

export default function ProofSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Trusted by Students from India's Top B-Schools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            RefineCV's ATS Analyzer is the #1 choice for MBA placements
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 pb-12 border-b border-gray-200">
          <div className="text-gray-400 font-bold text-sm">IIM Ahmedabad</div>
          <div className="text-gray-400 font-bold text-sm">IIM Bangalore</div>
          <div className="text-gray-400 font-bold text-sm">IIM Calcutta</div>
          <div className="text-gray-400 font-bold text-sm">XLRI</div>
          <div className="text-gray-400 font-bold text-sm">ISB</div>
          <div className="text-gray-400 font-bold text-sm">FMS Delhi</div>
        </div>
        <p className="text-center text-gray-500 text-sm mb-16">Used by students from 50+ top B-schools</p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-5xl lg:text-6xl font-black text-primary mb-2">90%+</div>
            <div className="font-bold text-secondary mb-1">Average ATS Pass Rate</div>
            <div className="text-sm text-gray-600">vs 25% industry average</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-5xl lg:text-6xl font-black text-primary mb-2">15 min</div>
            <div className="font-bold text-secondary mb-1">Per CV Optimization</div>
            <div className="text-sm text-gray-600">vs 3-5 hours manually</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-5xl lg:text-6xl font-black text-primary mb-2">5,000+</div>
            <div className="font-bold text-secondary mb-1">MBA Students</div>
            <div className="text-sm text-gray-600">Trust RefineCV for placements</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-background rounded-2xl p-6 lg:p-8 border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <span className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">
                  Before: 42%
                </span>
                <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">
                  After: 89%
                </span>
              </div>
            </div>

            <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
              "I was using 3 different ATS checkers and getting 3 different scores. RefineCV showed me exactly what was wrong—my contact info was in the header and ATS couldn't read it. Fixed it in 5 minutes."
            </blockquote>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                <div className="font-bold text-secondary text-lg">Arjun M.</div>
                <div className="text-primary font-semibold">IIM Lucknow → Goldman Sachs</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Placement outcome:</div>
                <div className="font-bold text-success">0 → 8 shortlists</div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl p-6 lg:p-8 border-2 border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <span className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">
                  Before: 4 hours
                </span>
                <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">
                  After: 15 min
                </span>
              </div>
            </div>

            <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
              "The split-panel view is a game-changer. I can see in real-time how every change affects ATS parsing. No more guessing. No more conflicting advice from random tools."
            </blockquote>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div>
                <div className="font-bold text-secondary text-lg">Priya K.</div>
                <div className="text-primary font-semibold">XLRI → McKinsey</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Placement outcome:</div>
                <div className="font-bold text-success">3 apps, 3 shortlists</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
