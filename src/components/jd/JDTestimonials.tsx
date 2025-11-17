import { Target, Zap, TrendingUp } from 'lucide-react';

export default function JDTestimonials() {
  const testimonials = [
    {
      before: 'Sent same CV to 30 companies. 1 response.',
      after: 'Used RefineCV to tailor CV for each role. 12 responses from 20 applications.',
      journey: {
        genericMatch: 45,
        tailoredMatch: 85,
      },
      quote: 'The keyword gap analysis was eye-opening. I was missing "stakeholder management" in every consulting JD. Added one project with that focus, and suddenly I was getting shortlisted.',
      name: 'Rohan S.',
      details: 'IIM Bangalore → Bain & Company',
      metric: '1 response → 12 responses',
      multiplier: '12x improvement',
    },
    {
      before: 'Spent 4 hours per CV trying to manually match keywords. Exhausting.',
      after: '15 minutes per tailored CV with RefineCV. Applied to 40 companies in 2 days.',
      journey: {
        manualTime: 160,
        refineCVTime: 10,
        saved: 150,
      },
      quote: 'I used those 150 saved hours for interview prep. That\'s the real ROI—I was prepared for every interview because I wasn\'t exhausted from CV tailoring.',
      name: 'Ananya K.',
      details: 'XLRI → Google Product Management',
      metric: '160 hours → 10 hours',
      multiplier: '15x faster',
    },
    {
      before: 'My CV matched 50% for consulting JDs and 40% for PM JDs. No interview calls.',
      after: 'RefineCV helped me create 2 versions: Consulting CV (88% match) and PM CV (91% match). 8 interview calls.',
      journey: {
        consultingBefore: 50,
        consultingAfter: 88,
        pmBefore: 40,
        pmAfter: 91,
      },
      quote: 'The role-specific framing examples showed me how to position my same experiences differently. My consulting CV emphasized "structured problem-solving," my PM CV emphasized "user research and roadmaps."',
      name: 'Vikram M.',
      details: 'IIM Ahmedabad → McKinsey',
      metric: '0 calls → 8 interview calls',
      multiplier: '∞ improvement',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Students Who Tailored, Students Who Succeeded
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real results from MBA students who used JD CV Match Analyzer
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gradient-to-br from-background to-white rounded-2xl p-6 lg:p-8 border-2 border-primary/20 shadow-lg">
              <div className="mb-6">
                <div className="bg-error/10 rounded-lg p-4 border-l-4 border-error mb-4">
                  <p className="text-xs font-bold text-error mb-1">BEFORE:</p>
                  <p className="text-sm text-gray-700">{testimonial.before}</p>
                </div>
                <div className="bg-success/10 rounded-lg p-4 border-l-4 border-success">
                  <p className="text-xs font-bold text-success mb-1">AFTER:</p>
                  <p className="text-sm text-gray-700">{testimonial.after}</p>
                </div>
              </div>

              {testimonial.journey.genericMatch !== undefined && (
                <div className="mb-6 bg-white rounded-lg p-4 border border-primary/20">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Match Score Journey:</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Generic CV</p>
                      <p className="text-2xl font-black text-error">{testimonial.journey.genericMatch}%</p>
                    </div>
                    <div className="text-2xl text-primary">→</div>
                    <div>
                      <p className="text-xs text-gray-600">Tailored CV</p>
                      <p className="text-2xl font-black text-success">{testimonial.journey.tailoredMatch}%</p>
                    </div>
                  </div>
                </div>
              )}

              {testimonial.journey.manualTime !== undefined && (
                <div className="mb-6 bg-white rounded-lg p-4 border border-primary/20">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Time Savings:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manual tailoring:</span>
                      <span className="font-bold text-error">{testimonial.journey.manualTime} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">With RefineCV:</span>
                      <span className="font-bold text-success">{testimonial.journey.refineCVTime} hours</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-900 font-bold">Saved:</span>
                      <span className="font-black text-primary">{testimonial.journey.saved} hours</span>
                    </div>
                  </div>
                </div>
              )}

              {testimonial.journey.consultingBefore !== undefined && (
                <div className="mb-6 bg-white rounded-lg p-4 border border-primary/20">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Match Score Improvement:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consulting:</span>
                      <span className="font-bold">
                        <span className="text-error">{testimonial.journey.consultingBefore}%</span> → <span className="text-success">{testimonial.journey.consultingAfter}%</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PM:</span>
                      <span className="font-bold">
                        <span className="text-error">{testimonial.journey.pmBefore}%</span> → <span className="text-success">{testimonial.journey.pmAfter}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <blockquote className="mb-6 bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              </blockquote>

              <div className="border-t pt-4">
                <p className="font-black text-secondary text-lg mb-1">{testimonial.name}</p>
                <p className="text-sm text-primary font-semibold mb-3">{testimonial.details}</p>
                <div className="bg-success/10 rounded-lg p-3 text-center border border-success/20">
                  <p className="text-xs text-gray-600 mb-1">Impact:</p>
                  <p className="font-black text-success text-lg">{testimonial.metric}</p>
                  <p className="text-xs text-success font-semibold mt-1">({testimonial.multiplier})</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 lg:p-8 text-center border-2 border-primary/20">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-5xl font-black text-primary mb-2">3-5x</div>
            <p className="font-bold text-secondary mb-2">Higher Response Rate</p>
            <p className="text-sm text-gray-600">With tailored CVs vs generic</p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 lg:p-8 text-center border-2 border-primary/20">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-5xl font-black text-primary mb-2">15 min</div>
            <p className="font-bold text-secondary mb-2">Per Tailored CV</p>
            <p className="text-sm text-gray-600">vs 3-4 hours manually</p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 lg:p-8 text-center border-2 border-primary/20">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-5xl font-black text-primary mb-2">80-90%</div>
            <p className="font-bold text-secondary mb-2">Average Match Score</p>
            <p className="text-sm text-gray-600">RefineCV users vs 35-50% generic</p>
          </div>
        </div>
      </div>
    </section>
  );
}
