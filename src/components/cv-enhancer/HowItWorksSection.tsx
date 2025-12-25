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
    <section className="py-16 lg:py-20 bg-white rounded-xl shadow-sm mt-12">
      <div className="max-w-[calc(100%+96px)] lg:max-w-[calc(95%+96px)] xl:max-w-[calc(90%+96px)] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1C2A] mb-12 lg:mb-16 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
          How Instant CV Enhancer Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-[#F7F7FE] rounded-xl p-5 lg:p-6 border-2 border-gray-200 hover:border-[#2782EA] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-[#2782EA] p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F1C2A] leading-tight" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center text-gray-600 text-base pt-4" style={{ fontFamily: 'Lato, sans-serif' }}>
          Analysis takes approximately 30 seconds | Enhancement: 15-30 min
        </div>
      </div>
    </section>
  );
}

