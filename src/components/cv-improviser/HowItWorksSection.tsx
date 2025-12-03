import { Star, Sparkles, BarChart3, Eye } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Star,
      title: '1-5 Star Rating',
      description: 'Each CV section gets rated. See exactly which sections need improvement.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Suggestions',
      description: 'Get 3-5 enhanced versions with stronger verbs, metrics, and impact framing.',
    },
    {
      icon: BarChart3,
      title: 'Choose Best Version',
      description: 'Pick the one that sounds most authentic to you. Maintain your voice.',
    },
    {
      icon: Eye,
      title: 'See Changes Live',
      description: 'Watch your CV transform in real-time with instant preview updates.',
    },
  ];

  return (
    <section className="py-12 bg-white rounded-xl shadow-sm mt-8">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-[#0F1C2A] mb-8 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
          How Instant CV Enhancer Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-[#F7F7FE] rounded-lg p-6 border border-gray-200 hover:border-[#2782EA] transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#2782EA] p-2 rounded-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F1C2A]" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center text-gray-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
          Analysis takes approximately 30 seconds | Enhancement: 15-30 min
        </div>
      </div>
    </section>
  );
}

