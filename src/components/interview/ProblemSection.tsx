import { XCircle, AlertCircle, Clock } from 'lucide-react';

export default function ProblemSection() {
  const painPoints = [
    {
      icon: XCircle,
      iconColor: 'text-red-500',
      title: 'No Real Practice',
      description:
        "You can't practice real interviews with friends or family. They don't know what recruiters look for.",
    },
    {
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      title: 'No Feedback',
      description:
        "You don't know if your answers are good or bad. Generic advice like 'be confident' doesn't help.",
    },
    {
      icon: Clock,
      iconColor: 'text-red-500',
      title: 'Wasted Opportunities',
      description:
        'Every real interview is a high-stakes opportunity. One bad answer can cost you the job.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Why Interview Practice Matters
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Most candidates fail interviews not because they lack skills,
            but because they lack practice and feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <point.icon className={`w-12 h-12 ${point.iconColor} mb-4`} />
              <h3 className="text-xl font-semibold text-secondary mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-purple-600">
            That's where Interview Me AI comes in.
          </p>
        </div>
      </div>
    </section>
  );
}
