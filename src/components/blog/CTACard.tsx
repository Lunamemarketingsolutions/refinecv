import { Link } from 'react-router-dom';
import { Download, Target, Mic } from 'lucide-react';

type CTAType = 'lead-magnet' | 'jd-match' | 'interview-ai';

interface CTACardProps {
  type: CTAType;
}

export default function CTACard({ type }: CTACardProps) {
  const ctaContent = {
    'lead-magnet': {
      icon: Download,
      title: 'Free Download',
      heading: 'The Ultimate CV Template for MBA Students',
      description: 'Optimized for ATS, used by 5,000+ students at IIMs, ISB, XLRI',
      buttonText: 'Download Free Template →',
      buttonLink: '/signup',
      bgGradient: 'from-[#2762ea] to-[#1e4fc4]',
      iconColor: 'text-white',
    },
    'jd-match': {
      icon: Target,
      title: 'Not sure if your CV matches the job?',
      heading: 'Try our JD CV Match Analyzer',
      description: 'Upload your CV + paste any JD\nGet instant match score + keyword gaps',
      buttonText: 'Try Free →',
      buttonLink: '/jd-matcher',
      bgGradient: 'from-[#10B981] to-[#059669]',
      iconColor: 'text-white',
    },
    'interview-ai': {
      icon: Mic,
      title: 'Nervous about interviews?',
      heading: 'Practice with Interview Me AI',
      description: '20 personalized questions + Real-time feedback\nVoice-based practice',
      buttonText: 'Start Practice →',
      buttonLink: '/interview-ai',
      bgGradient: 'from-[#8B5CF6] to-[#7C3AED]',
      iconColor: 'text-white',
    },
  };

  const content = ctaContent[type];
  const Icon = content.icon;

  return (
    <div className={`bg-gradient-to-br ${content.bgGradient} rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col justify-center`}>
      <div className="flex justify-center mb-4">
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
          <Icon className={`w-12 h-12 ${content.iconColor}`} />
        </div>
      </div>

      <p className="text-white/90 text-sm font-medium mb-2">{content.title}</p>

      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
        {content.heading}
      </h3>

      <p className="text-white/90 mb-6 leading-relaxed whitespace-pre-line">
        {content.description}
      </p>

      <Link
        to={content.buttonLink}
        className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {content.buttonText}
      </Link>
    </div>
  );
}
