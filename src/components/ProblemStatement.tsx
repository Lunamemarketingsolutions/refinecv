import { Frown, Clock, Target } from 'lucide-react';

export default function ProblemStatement() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-secondary">
            Running to Seniors for CV Feedback? There's a Better Way.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Frown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary">
              Generic CVs sent everywhere—no idea why you're getting rejected
            </h3>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary">
              Waiting days for feedback from busy seniors and professors
            </h3>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary">
              No clue how to tailor your CV for each job description
            </h3>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            RefineCV brings you AI-powered insights—instantly.
          </p>
        </div>
      </div>
    </section>
  );
}
