import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Clock, TrendingUp } from 'lucide-react';

interface Warning {
  title: string;
  impactScore: number;
  problem: string;
  fix: string;
  timeToFix: string;
}

interface WarningsProps {
  warnings: Warning[];
}

export default function Warnings({ warnings }: WarningsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (warnings.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          Warnings ({warnings.length})
        </h2>
        <p className="text-gray-600 mt-2">
          These issues may cause parsing problems with some ATS systems. Address these to improve compatibility.
        </p>
      </div>

      <div className="space-y-4">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-l-4 border-amber-500 overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-700">
                    {warning.title}
                  </h3>
                </div>
                <span className="text-amber-600 font-bold text-sm">
                  {warning.impactScore}% ATS Score
                </span>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-400 ml-3" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 ml-3" />
              )}
            </button>

            {expandedIndex === index && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="bg-amber-50 rounded-lg p-4 mt-4 border border-amber-200">
                  <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                    <span className="text-amber-600">⚠️</span>
                    Problem:
                  </h4>
                  <p className="text-gray-700 text-sm mb-4">
                    {warning.problem}
                  </p>

                  <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                    <span className="text-success">✅</span>
                    Fix:
                  </h4>
                  <p className="text-gray-700 text-sm mb-4">
                    {warning.fix}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Time: <span className="font-semibold">{warning.timeToFix}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-600">
                        Impact: <span className="font-semibold text-amber-600">{Math.abs(warning.impactScore)}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
