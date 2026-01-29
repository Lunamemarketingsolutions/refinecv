import { Upload, Sparkles, Mic, BarChart } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Upload,
      title: 'Upload Your CV & Job Description',
      description:
        "Share your CV and paste the job description for the role you're targeting. Our AI analyzes your experience and the job requirements to generate personalized questions.",
      time: 'Takes 30 seconds',
      mockupText: 'CV + JD Upload Interface',
    },
    {
      number: '2',
      icon: Sparkles,
      title: 'AI Generates 20 Personalized Questions',
      description:
        'Get questions tailored to your profile across 5 categories: Introduction, Behavioral (STAR framework), Technical Skills, Culture Fit, and Soft Skills. Every question is relevant to YOUR experience and the specific role.',
      time: '',
      examples: [
        'Tell me about yourself and your journey to product management',
        'Describe a time you led a team at Amazon to achieve a challenging goal',
        'How would you prioritize features for a new product at Google?',
      ],
      mockupText: '20 Personalized Questions',
    },
    {
      number: '3',
      icon: Mic,
      title: 'Answer Questions with Your Voice',
      description:
        'Practice answering out loud, just like a real interview. Speak naturally—our AI listens and understands your responses. See real-time guidance on answer quality, structure (STAR), and duration.',
      time: '',
      note: 'No transcript feature (coming soon)',
      mockupText: 'Voice Recording Interface',
    },
    {
      number: '4',
      icon: BarChart,
      title: 'Get Instant AI Feedback & Coaching',
      description:
        'After each answer, receive detailed feedback: what worked, what needs improvement, and specific tips to strengthen your response. See your overall score, category performance, and a personalized action plan.',
      time: '',
      metrics: [
        'Answer score (0-100%)',
        'STAR framework analysis',
        'Strengths & weaknesses',
        'Suggested improvements',
        'Overall readiness score',
      ],
      mockupText: 'AI Feedback Report',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            How Interview Me AI Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Practice realistic interviews in 4 simple steps
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                    {step.number}
                  </div>
                  <step.icon className="w-12 h-12 text-purple-600" />
                </div>

                <h3 className="text-2xl font-semibold text-secondary mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                {step.time && (
                  <p className="text-purple-600 italic text-sm font-medium mb-4">
                    {step.time}
                  </p>
                )}

                {step.examples && (
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Example Questions:
                    </p>
                    <ul className="space-y-2">
                      {step.examples.map((example, i) => (
                        <li key={i} className="text-sm text-gray-600 italic">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.metrics && (
                  <div className="space-y-2">
                    {step.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-success"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600 text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.note && (
                  <p className="text-xs text-gray-500 italic mt-2">{step.note}</p>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-8 aspect-video flex items-center justify-center border-2 border-purple-200 shadow-lg">
                  <div className="text-center">
                    <step.icon className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-700">
                      {step.mockupText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
