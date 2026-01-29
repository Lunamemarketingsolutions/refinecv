import { Link } from 'react-router-dom';
import { Mic, Play, CheckCircle } from 'lucide-react';

export default function InterviewHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              RefineCV Feature #4
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary mb-6">
            Interview Me AI Coach
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-gray-700 mb-6">
            Practice with AI. Master Real Interviews.
          </p>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Get ready for your dream job with 20 personalized interview questions,
            real-time AI feedback, and expert coaching—all based on your CV and target role.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 hover:scale-105 transition-all inline-flex items-center gap-2 shadow-lg"
            >
              Start Practicing Now
              <Mic className="w-5 h-5" />
            </Link>
            <button className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all inline-flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <div className="max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-200">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-12 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Mic className="w-24 h-24 text-purple-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">
                  Interview Session Interface Mockup
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  AI Coach • Voice Practice • Real-time Feedback
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">5,000+ Interviews Practiced</span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">87% Average Score Improvement</span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">4.9/5 User Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
