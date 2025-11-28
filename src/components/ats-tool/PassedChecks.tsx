import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface PassedChecksProps {
  checks: string[];
}

export default function PassedChecks({ checks }: PassedChecksProps) {
  const [expanded, setExpanded] = useState(false);

  if (checks.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
            <span className="text-success">✅</span>
            Passed Checks ({checks.length})
          </h2>
          {expanded ? (
            <ChevronUp className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </button>

        {expanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <p className="text-gray-600 mt-4 mb-6">
              These elements are ATS-compatible. Great job!
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {checks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{check}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
