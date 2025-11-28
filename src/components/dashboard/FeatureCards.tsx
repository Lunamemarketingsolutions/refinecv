import { useNavigate } from 'react-router-dom';
import { Eye, Target, Sparkles } from 'lucide-react';

interface FeatureCardsProps {
  featureUsage: {
    atsAnalyzerCount: number;
    jdMatchCount: number;
    cvEnhancerCount: number;
  };
}

export default function FeatureCards({ featureUsage }: FeatureCardsProps) {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      topBorder: 'border-t-primary',
      title: 'ATS Analyzer',
      description: 'Upload your CV and see exactly what ATS systems read. Get instant formatting fixes and ATS compatibility score.',
      features: [
        'Split-panel ATS view',
        '90%+ pass rate guarantee',
        'One-click fixes',
      ],
      usageCount: featureUsage.atsAnalyzerCount,
      usageColor: 'text-primary',
      buttonBg: 'bg-primary hover:bg-primary/90',
      buttonText: 'Start ATS Analysis',
      path: '/ats-tool',
    },
    {
      icon: Target,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      topBorder: 'border-t-success',
      title: 'JD CV Match Analyzer',
      description: 'Upload your CV and paste any job description. Get instant match score, keyword gaps, and tailoring recommendations.',
      features: [
        '80-90% match scores',
        'Keyword gap analysis',
        'Role-specific framing',
      ],
      usageCount: featureUsage.jdMatchCount,
      usageColor: 'text-success',
      buttonBg: 'bg-success hover:bg-success/90',
      buttonText: 'Start JD Match',
      path: '/features/jd-matcher',
    },
    {
      icon: Sparkles,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-600/10',
      topBorder: 'border-t-purple-600',
      title: 'Instant CV Enhancer',
      description: 'Get AI-powered bullet point improvements. Rate each section, see 3-5 enhanced versions, and watch your CV transform in real-time.',
      features: [
        'Section-by-section ratings',
        '3-5 AI suggestions per bullet',
        'Live CV preview',
      ],
      usageCount: featureUsage.cvEnhancerCount,
      usageColor: 'text-purple-600',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
      buttonText: 'Start Enhancement',
      path: '/features/cv-enhancer',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black text-secondary mb-6">
        Get Started with Your CV Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => navigate(feature.path)}
            className={`bg-white rounded-2xl p-8 shadow-lg border-t-4 ${feature.topBorder} cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all`}
          >
            <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
              <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
            </div>

            <h3 className="text-xl font-black text-secondary mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {feature.description}
            </p>

            <div className="space-y-2 mb-4">
              {feature.features.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-success">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={`text-xs ${feature.usageColor} font-semibold mb-4`}>
              You've used this {feature.usageCount} times
            </div>

            <button
              className={`w-full ${feature.buttonBg} text-white px-6 py-3 rounded-lg font-semibold transition-all`}
            >
              {feature.buttonText} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
