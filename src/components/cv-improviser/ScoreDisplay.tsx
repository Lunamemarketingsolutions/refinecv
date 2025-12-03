interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = () => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke={getScoreColor()}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: getScoreColor() }}>
              {score}%
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0F1C2A] mb-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            CV Score
          </h3>
          <p className="text-sm text-gray-600">
            Based on clarity, impact, quantification, and ATS friendliness
          </p>
        </div>
      </div>
    </div>
  );
}

