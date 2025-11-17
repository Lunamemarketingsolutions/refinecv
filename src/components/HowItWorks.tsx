import { Upload, FileCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to transform your resume
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-4 items-start mb-12">
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
                1
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Upload Your Current Resume
              </h3>
              <p className="text-gray-600">
                Drop in your existing CV (PDF or Word). Our AI starts analyzing immediately.
              </p>
            </div>
            <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
                2
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Add a Job Description
              </h3>
              <p className="text-gray-600">
                Paste or upload the role you're applying to. We'll match it precisely.
              </p>
            </div>
            <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
              <ArrowRight className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
              3
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Get a Tailored, ATS-Approved Rewrite
            </h3>
            <p className="text-gray-600">
              Receive rewritten bullet points, structure recommendations, job-match insights, and referral suggestions.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/signup"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-xl transition-all"
            data-cta="how-it-works"
          >
            Try It Now
          </a>
        </div>
      </div>
    </section>
  );
}
