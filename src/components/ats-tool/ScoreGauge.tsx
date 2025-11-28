import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  criticalCount: number;
  warningCount: number;
  passedCount: number;
}

export default function ScoreGauge({ score, criticalCount, warningCount, passedCount }: ScoreGaugeProps) {
  const getScoreColor = () => {
    if (score < 70) return '#EF4444';
    if (score < 85) return '#F59E0B';
    if (score < 95) return '#10B981';
    return '#059669';
  };

  const getScoreLabel = () => {
    if (score < 70) return { text: 'Poor - ATS Will Likely Reject', color: 'text-error' };
    if (score < 85) return { text: 'Fair - Improvements Needed', color: 'text-amber-600' };
    if (score < 95) return { text: 'Good - ATS Compatible', color: 'text-success' };
    return { text: 'Excellent - Optimal', color: 'text-green-700' };
  };

  const getScoreDescription = () => {
    if (score < 70) {
      return 'Your CV has significant ATS compatibility issues that will likely result in automatic rejection. Critical improvements are needed immediately.';
    }
    if (score < 85) {
      return 'Your CV has 78% ATS compatibility. Some sections are being read correctly, but critical improvements are needed to pass ATS screening confidently. Follow the recommendations below to reach 90%+.';
    }
    if (score < 95) {
      return 'Your CV is mostly ATS-compatible and should pass most screening systems. A few minor improvements will make it even better.';
    }
    return 'Excellent! Your CV is optimally formatted for ATS systems and will pass screening with minimal issues.';
  };

  const scoreLabel = getScoreLabel();

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
            ATS Score
          </div>
        </div>

        <h2 className={`text-3xl font-black mb-3 ${scoreLabel.color}`}>
          {scoreLabel.text}
        </h2>

        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          {getScoreDescription()}
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-success/5 rounded-xl p-4 border-2 border-success/20">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-black text-success mb-1">{passedCount}</div>
            <div className="text-sm text-gray-600">Passed Checks</div>
          </div>

          <div className="bg-amber-500/5 rounded-xl p-4 border-2 border-amber-500/20">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-amber-600 mb-1">{warningCount}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>

          <div className="bg-error/5 rounded-xl p-4 border-2 border-error/20">
            <XCircle className="w-8 h-8 text-error mx-auto mb-2" />
            <div className="text-3xl font-black text-error mb-1">{criticalCount}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
        </div>
      </div>
    </section>
  );
}
