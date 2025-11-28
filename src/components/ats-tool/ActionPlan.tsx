import { Target, TrendingUp, Download } from 'lucide-react';

interface Issue {
  title: string;
  timeToFix: string;
  scoreImpact: string;
}

interface Warning {
  title: string;
  timeToFix: string;
  impactScore: number;
}

interface ActionPlanProps {
  currentScore: number;
  criticalIssues: Issue[];
  warnings: Warning[];
}

export default function ActionPlan({ currentScore, criticalIssues, warnings }: ActionPlanProps) {
  const criticalImpact = criticalIssues.reduce((sum, issue) => {
    const match = issue.scoreImpact.match(/\+(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const warningImpact = warnings.reduce((sum, warning) => sum + Math.abs(warning.impactScore), 0);

  const criticalTime = criticalIssues.reduce((sum, issue) => {
    const match = issue.timeToFix.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const warningTime = warnings.reduce((sum, warning) => {
    const match = warning.timeToFix.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const targetScore = Math.min(currentScore + criticalImpact + warningImpact, 100);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
          <Target className="w-7 h-7 text-primary" />
          Action Plan to Reach 90%+ Score
        </h2>
        <p className="text-gray-600 mt-2">
          Follow these steps in priority order to optimize your CV for ATS
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-error">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-error text-white px-3 py-1 rounded-full text-xs font-bold">
              HIGH PRIORITY
            </span>
            <span className="text-error font-bold text-sm">
              Do These First
            </span>
          </div>

          <div className="mb-4">
            <p className="text-secondary font-semibold mb-1">
              Impact: +{criticalImpact}% ATS Score → Target: {Math.min(currentScore + criticalImpact, 100)}%
            </p>
          </div>

          <ol className="space-y-3 text-sm">
            {criticalIssues.map((issue, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="font-bold text-error flex-shrink-0 mt-0.5">
                  {index + 1}.
                </span>
                <span className="text-gray-700">
                  {issue.title} ({issue.timeToFix}) → {issue.scoreImpact}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold">Total time investment:</span> ~{criticalTime} minutes
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Total impact:</span> Your score {currentScore}% → {Math.min(currentScore + criticalImpact, 100)}%
            </p>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                MEDIUM PRIORITY
              </span>
              <span className="text-amber-600 font-bold text-sm">
                Next Steps
              </span>
            </div>

            <div className="mb-4">
              <p className="text-secondary font-semibold mb-1">
                Impact: +{warningImpact}% → Target: {Math.min(currentScore + criticalImpact + warningImpact, 100)}%+
              </p>
            </div>

            <ol className="space-y-2 text-sm" start={criticalIssues.length + 1}>
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-bold text-amber-600 flex-shrink-0 mt-0.5">
                    {criticalIssues.length + index + 1}.
                  </span>
                  <span className="text-gray-700">
                    {warning.title} ({warning.timeToFix}) → +{Math.abs(warning.impactScore)}%
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Total time:</span> ~{warningTime} minutes
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-12 h-12" />
            <h3 className="text-2xl font-black">Complete Action Plan</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Current Score:</p>
              <p className="text-4xl font-black">{currentScore}%</p>
              <p className="text-white/80 text-sm">Fair</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Potential Score:</p>
              <p className="text-4xl font-black">{targetScore}%</p>
              <p className="text-white/80 text-sm">Excellent</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/80 mb-1">Improvement:</p>
              <p className="text-2xl font-black flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                +{targetScore - currentScore}%
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/80 mb-1">Time Investment:</p>
              <p className="text-2xl font-black">
                ~{criticalTime + warningTime} min
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-6">
            <p><span className="font-bold">Critical Issues:</span> {criticalIssues.length} → 0</p>
            <p><span className="font-bold">Warnings:</span> {warnings.length} → 0</p>
            <p><span className="font-bold">Passed Checks:</span> Will increase with fixes</p>
          </div>

          <p className="text-white/90 mb-6">
            ROI: Transform from "likely rejection" to "ATS-optimized" in just {Math.ceil((criticalTime + warningTime) / 60)} hour{Math.ceil((criticalTime + warningTime) / 60) > 1 ? 's' : ''}
          </p>

          <button className="w-full bg-white text-primary px-6 py-3 rounded-lg font-bold text-base hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Full Action Plan (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}
