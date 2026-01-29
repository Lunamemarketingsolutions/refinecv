import { FileText, MessageSquare, Target, Grid, Mic, BarChart } from 'lucide-react';

export default function KeyFeatures() {
  const features = [
    {
      icon: FileText,
      title: 'CV-Based Personalization',
      description:
        'Questions tailored to YOUR experience, not generic templates. AI analyzes your CV and generates questions specific to your background, achievements, and target role.',
      example:
        'If you led a team at Amazon, you\'ll get: "Tell me about your leadership experience at Amazon and how you motivated your team of 5 developers."',
    },
    {
      icon: MessageSquare,
      title: 'Instant AI Coaching',
      description:
        'Get feedback immediately after each answer—no waiting. AI evaluates content quality, structure (STAR), relevance, delivery, and provides specific tips to improve.',
      metrics: [
        'Answer score: 85%',
        'Structure: Strong STAR',
        'Impact: Add more metrics',
        'Suggested improvements',
      ],
    },
    {
      icon: Target,
      title: 'STAR Framework Mastery',
      description:
        'Learn and practice the STAR method (Situation, Task, Action, Result) for behavioral questions. AI checks if your answer includes all components and guides you to strengthen weak areas.',
    },
    {
      icon: Grid,
      title: 'Comprehensive Coverage',
      description:
        'Practice all interview types: Introduction (3Q), Behavioral/STAR (8Q), Technical Skills (4Q), Culture Fit (3Q), Soft Skills (2Q). Total: 20 questions covering everything recruiters ask.',
    },
    {
      icon: Mic,
      title: 'Realistic Voice Practice',
      description:
        'Answer out loud, not in writing. Practice your delivery, pace, confidence, and articulation—just like a real interview. Our AI listens and evaluates your spoken responses.',
    },
    {
      icon: BarChart,
      title: 'Comprehensive Report',
      description:
        'Get a full performance report: overall score, category breakdown, question-by-question feedback, top 5 strengths, top 5 weaknesses, and a personalized action plan. Download as PDF.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Everything You Need to Ace Interviews
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] border-t-4 border-purple-600"
            >
              <feature.icon className="w-12 h-12 text-purple-600 mb-4" />

              <h3 className="text-xl font-semibold text-secondary mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              {feature.example && (
                <div className="bg-purple-50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-gray-700 italic">
                    {feature.example}
                  </p>
                </div>
              )}

              {feature.metrics && (
                <div className="bg-purple-50 rounded-lg p-3 mt-4 space-y-1">
                  {feature.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
