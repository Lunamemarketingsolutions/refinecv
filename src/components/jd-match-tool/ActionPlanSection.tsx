import { Target, Download } from 'lucide-react';

interface ActionPlanSectionProps {
  currentScore: number;
  actionItems: any;
  missingKeywords: any[];
  partialMatches: any[];
}

export default function ActionPlanSection({ currentScore, actionItems, missingKeywords, partialMatches }: ActionPlanSectionProps) {
  const totalMissingImpact = missingKeywords.reduce((sum, k) => sum + k.impact, 0);
  const totalPartialImpact = partialMatches.reduce((sum, m) => sum + m.impact, 0);
  const potentialScore = Math.min(currentScore + totalMissingImpact + totalPartialImpact, 100);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
          <Target className="w-7 h-7 text-primary" />
          Your Tailoring Action Plan
        </h2>
        <p className="text-gray-600 mt-2">
          Follow these steps in priority order to reach 90%+ match score
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-error/5 border-l-4 border-error rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-error text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              HIGH PRIORITY
            </span>
            <span className="text-error font-bold text-sm">Do These First</span>
          </div>

          <div className="mb-4">
            <p className="text-secondary font-semibold">
              Impact: +18% ATS Score → Target: 96%
            </p>
          </div>

          <ol className="space-y-3 text-sm text-gray-700">
            {actionItems?.high?.map((item: any, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="font-bold text-error flex-shrink-0 mt-0.5">{index + 1}.</span>
                <span>{item.task} ({item.time} min) → +{item.impact}%</span>
              </li>
            ))}
          </ol>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm space-y-1">
            <p><span className="font-semibold">Total time investment:</span> ~45 minutes</p>
            <p><span className="font-semibold">Total impact:</span> Your score {currentScore}% → 96%</p>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              MEDIUM PRIORITY
            </span>
            <span className="text-amber-600 font-bold text-sm">Next Steps</span>
          </div>

          <div className="mb-4">
            <p className="text-secondary font-semibold">
              Impact: +8% → Target: 98%+
            </p>
          </div>

          <ol className="space-y-2 text-sm text-gray-700" start={3}>
            {actionItems?.medium?.map((item: any, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="font-bold text-amber-600 flex-shrink-0 mt-0.5">{index + 3}.</span>
                <span>{item.task} ({item.time} min) → +{item.impact}%</span>
              </li>
            ))}
          </ol>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
            <p><span className="font-semibold">Total time:</span> ~20 minutes</p>
          </div>
        </div>

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
              <p className="text-4xl font-black">{potentialScore}%</p>
              <p className="text-white/80 text-sm">Excellent</p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-6">
            <p><span className="font-bold">Improvement:</span> +{potentialScore - currentScore}%</p>
            <p><span className="font-bold">Time Investment:</span> ~80 minutes total</p>
            <p><span className="font-bold">Keyword Coverage:</span> 18/25 (72%) → 25/25 (100%)</p>
            <p><span className="font-bold">Competitive Position:</span> Top 30% → Top 5%</p>
            <p><span className="font-bold">Interview Odds:</span> 15-20% → 60-75% (4x improvement)</p>
          </div>

          <p className="text-white/90 mb-6">
            ROI: Transform from "likely rejection" to "ATS-optimized" in just ~1 hour
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
