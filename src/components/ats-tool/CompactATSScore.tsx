import type { ATSAnalysis } from '../../types/ats';

interface CompactATSScoreProps {
  analysis: ATSAnalysis;
}

export default function CompactATSScore({ analysis }: CompactATSScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 90) return 'stroke-emerald-600';
    if (score >= 75) return 'stroke-green-600';
    if (score >= 60) return 'stroke-yellow-600';
    if (score >= 40) return 'stroke-orange-600';
    return 'stroke-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (analysis.score / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${getScoreRingColor(analysis.score)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className={`text-lg font-semibold ${getScoreColor(analysis.score)}`}>
            {getScoreLabel(analysis.score)}
          </div>
          <div className="text-sm text-gray-600">ATS Compatibility Score</div>
        </div>
      </div>
    </div>
  );
}
