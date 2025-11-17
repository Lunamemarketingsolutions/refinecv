import { X, Check, ArrowRight } from 'lucide-react';

export default function BeforeAfter() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            Before & After
          </h2>
          <p className="text-xl text-gray-600">
            See how RefineCV transforms generic bullet points into powerful, ATS-approved achievements
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-error/10 text-error px-4 py-2 rounded-lg font-bold text-sm">
                  BEFORE
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                      <X className="w-6 h-6 text-error" />
                    </div>
                    <div className="text-5xl font-black text-error">42</div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border-2 border-error/20">
                    <p className="text-gray-600 italic">
                      "Worked on college fest management."
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center gap-4">
                <ArrowRight className="w-12 h-12 text-primary" />
                <div className="bg-success/10 text-success px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap">
                  +105% improvement
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block bg-success/10 text-success px-4 py-2 rounded-lg font-bold text-sm">
                  AFTER
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-6 h-6 text-success" />
                    </div>
                    <div className="text-5xl font-black text-success">86</div>
                  </div>

                  <div className="bg-success/5 p-6 rounded-xl border-2 border-success/20">
                    <p className="text-secondary font-semibold">
                      "Directed a 14-member operations team to execute a 3-day festival with 2,400+ attendees, achieving 98% vendor fulfillment and under-budget execution."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/signup"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all"
            data-cta="before-after"
          >
            Transform Your CV Now
          </a>
        </div>
      </div>
    </section>
  );
}
