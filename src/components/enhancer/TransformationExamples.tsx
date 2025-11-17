import { X, CheckCircle, Star, Lightbulb } from 'lucide-react';

export default function TransformationExamples() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            From Weak to Wow: Real Transformations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how RefineCV transforms the same experience from 1-star to 5-star bullets
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-error/5 to-error/10 p-6 lg:p-8 border-r-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">BEFORE</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-error text-error" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Managed college fest with 500 participants"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Vague verb: "Managed"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No specifics on what you managed</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No outcome or impact</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No team size mentioned</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-success/5 to-success/10 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">AFTER</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 font-medium">"Directed 3-day tech fest operations with team of 12, coordinating 20+ events across 4 venues; increased participation by 35% (500 to 675 attendees) through data-driven marketing campaign and secured ₹8 lakh sponsorship (20% above target)"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Strong action verb: "Directed"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Quantified team size: 12 people</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Specific metrics: 35% increase, ₹8L sponsorship</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Clear scope: 3 days, 20+ events, 4 venues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-error/5 to-error/10 p-6 lg:p-8 border-r-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">BEFORE</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-error text-error" />
                    <Star className="w-5 h-5 fill-error text-error" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Worked on marketing projects and helped improve campaigns"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Passive: "Worked on", "helped"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Vague: "projects", "campaigns"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No metrics or outcomes</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-success/5 to-success/10 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">AFTER</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 font-medium">"Optimized email marketing campaigns by A/B testing 15 subject line variations across 50,000+ subscriber base, improving open rates from 18% to 27% (+50% improvement) and generating ₹2.5 lakh incremental revenue in Q3"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Strong verb: "Optimized"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Specific method: "A/B testing"</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Clear outcomes: 18% → 27%, ₹2.5L revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-error/5 to-error/10 p-6 lg:p-8 border-r-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-error text-white px-3 py-1 rounded-full text-sm font-bold">BEFORE</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-error text-error" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Built a mobile app using React Native"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No context or purpose</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>No users or impact</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Sounds like a toy project</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-success/5 to-success/10 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">AFTER</div>
                  <div className="flex gap-0.5">
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                    <Star className="w-5 h-5 fill-success text-success" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 font-medium">"Architected and launched cross-platform mobile app (iOS/Android) using React Native and Firebase, serving 5,000+ active users within 3 months; implemented real-time data synchronization and push notifications, achieving 4.6/5 App Store rating"</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Technical depth: React Native, Firebase</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Scale: 5,000+ users in 3 months</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>User satisfaction: 4.6/5 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-primary/10 rounded-2xl p-8 border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black text-secondary mb-3">Pattern Recognition:</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Weak verbs</span> ("worked on", "helped") → <span className="font-semibold text-success">Strong verbs</span> ("Architected", "Optimized", "Directed")</p>
                <p><span className="font-semibold">Vague descriptions</span> → <span className="font-semibold text-success">Specific methods and tools</span></p>
                <p><span className="font-semibold">Missing numbers</span> → <span className="font-semibold text-success">Quantified metrics</span> (users, %, time, money)</p>
                <p><span className="font-semibold">Task lists</span> → <span className="font-semibold text-success">Achievement-driven outcomes</span></p>
                <p className="text-primary font-bold mt-4">Same experience. Massively different impact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
