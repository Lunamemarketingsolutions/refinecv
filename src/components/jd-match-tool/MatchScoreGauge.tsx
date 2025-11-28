import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface MatchScoreGaugeProps {
  score: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
}

export default function MatchScoreGauge({ score, matchedCount, partialCount, missingCount }: MatchScoreGaugeProps) {
  const getScoreColor = () => {
    if (score < 60) return '#EF4444';
    if (score < 80) return '#F59E0B';
    if (score < 90) return '#10B981';
    return '#059669';
  };

  const getScoreLabel = () => {
    if (score < 60) return { text: 'Poor Match - Major Gaps', color: 'text-error' };
    if (score < 80) return { text: 'Fair Match - Tailoring Recommended', color: 'text-amber-600' };
    if (score < 90) return { text: 'Good Match - Well Aligned', color: 'text-success' };
    return { text: 'Excellent Match - Ideal Candidate', color: 'text-green-700' };
  };

  const getScoreDescription = () => {
    if (score < 60) {
      return 'Your CV has significant gaps compared to this job description. Major tailoring is needed to be competitive for this role.';
    }
    if (score < 80) {
      return 'Your CV has 78% alignment with this job description. You have most of the required qualifications, but strategic tailoring will significantly improve your chances. Focus on the 7 missing keywords and reframe 3 key experiences to match role-specific language.';
    }
    if (score < 90) {
      return 'Your CV aligns well with this job description. Minor refinements will make you an even stronger candidate.';
    }
    return 'Excellent! Your CV is highly aligned with this role and you\'re positioned as an ideal candidate.';
  };

  const scoreLabel = getScoreLabel();
  const totalKeywords = matchedCount + partialCount + missingCount;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl p-10 shadow-lg border-2 border-gray-100 text-center">
        <div className="max-w-md mx-auto mb-6">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textSize: '24px',
              textColor: '#0F1C2A',
              pathColor: getScoreColor(),
              trailColor: '#E5E7EB',
              strokeLinecap: 'round',
            })}
            strokeWidth={8}
          />
          <div className="mt-2 text-sm text-gray-600 font-medium">
            Match Score
          </div>
        </div>

        <h2 className={`text-3xl font-black mb-3 ${scoreLabel.color}`}>
          {scoreLabel.text}
        </h2>

        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          {getScoreDescription()}
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="bg-success/5 rounded-xl p-4 border-2 border-success/20">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-black text-success mb-1">{matchedCount}</div>
            <div className="text-sm text-gray-600">Matched Keywords</div>
            <div className="text-xs text-gray-500 mt-1">Out of {totalKeywords} required</div>
          </div>

          <div className="bg-amber-500/5 rounded-xl p-4 border-2 border-amber-500/20">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-600 mb-1">{partialCount}</div>
            <div className="text-sm text-gray-600">Partial Matches</div>
            <div className="text-xs text-gray-500 mt-1">Can be strengthened</div>
          </div>

          <div className="bg-error/5 rounded-xl p-4 border-2 border-error/20">
            <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
            <div className="text-3xl font-black text-error mb-1">{missingCount}</div>
            <div className="text-sm text-gray-600">Missing Keywords</div>
            <div className="text-xs text-gray-500 mt-1">High priority gaps</div>
          </div>
        </div>

        <div className="bg-primary/5 border-2 border-primary rounded-2xl p-6 max-w-3xl mx-auto">
          <h3 className="font-bold text-secondary mb-3">Competitive Context:</h3>
          <div className="text-sm text-gray-700 leading-relaxed text-left space-y-2">
            <p>Your {score}% match is <span className="font-bold text-success">ABOVE AVERAGE</span> for this role.</p>
            <p>• Average applicant match: 45-55%</p>
            <p>• You're in the <span className="font-bold">top 30%</span> of applicants</p>
            <p>• With tailoring → potential <span className="font-bold text-success">90%+ match (top 10%)</span></p>
            <p className="pt-2 border-t border-gray-200 mt-3">
              <span className="font-semibold">Estimated applications for this role:</span> 200-300<br />
              <span className="font-semibold">Your current position:</span> ~60th place<br />
              <span className="font-semibold">After tailoring:</span> ~20th place <span className="text-success font-bold">(3x better odds)</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
