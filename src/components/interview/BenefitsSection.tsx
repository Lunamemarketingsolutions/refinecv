import { TrendingUp, Target, Shield, Award } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: '87% Average Score Improvement',
      description:
        'Users improve from 65% average (first session) to 92% (after 3 sessions). That\'s the difference between "needs work" and "interview-ready."',
      stat: 'Most users reach 85%+ readiness in 2-3 practice sessions',
    },
    {
      icon: Target,
      title: 'Save Time, Practice Smart',
      description:
        'Instead of guessing what to practice, get focused feedback on exactly what needs improvement. 30-minute sessions vs hours of unstructured practice.',
      stat: '',
    },
    {
      icon: Shield,
      title: 'Build Confidence Before Real Interviews',
      description:
        "Walk into your interview confident, knowing you've practiced the exact types of questions you'll face. No more surprises, no more anxiety.",
      stat: '',
    },
    {
      icon: Award,
      title: 'Learn from Expert AI Coach',
      description:
        'Our AI is trained on thousands of real interviews from Google, McKinsey, Goldman Sachs, and top MBA programs. Get coaching based on what actually works.',
      stat: '',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Why Interview Me AI Changes Everything
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all border-l-4 border-success"
            >
              <benefit.icon className="w-12 h-12 text-success mb-4" />

              <h3 className="text-2xl font-semibold text-secondary mb-3">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                {benefit.description}
              </p>

              {benefit.stat && (
                <p className="text-sm text-success italic font-medium">
                  {benefit.stat}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
