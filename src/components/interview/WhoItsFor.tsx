import { GraduationCap, Briefcase, TrendingUp, Users } from 'lucide-react';

export default function WhoItsFor() {
  const personas = [
    {
      icon: GraduationCap,
      title: 'MBA Students',
      description:
        'Preparing for PM, consulting, banking interviews at Amazon, Google, McKinsey, Goldman Sachs',
    },
    {
      icon: Briefcase,
      title: 'Career Switchers',
      description:
        'Engineers → PMs, Analysts → Consultants, anyone transitioning to a new role',
    },
    {
      icon: TrendingUp,
      title: 'Job Seekers',
      description:
        'Anyone applying to competitive roles who wants to practice and improve interview skills',
    },
    {
      icon: Users,
      title: 'Fresh Graduates',
      description:
        'First-time interviewees who need to learn STAR framework and build confidence',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Perfect For
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-[1.05] border-2 border-gray-100 hover:border-purple-300"
            >
              <persona.icon className="w-12 h-12 text-purple-600 mb-4" />

              <h3 className="text-xl font-semibold text-secondary mb-3">
                {persona.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
