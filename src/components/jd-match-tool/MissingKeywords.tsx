import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface MissingKeywordsProps {
  keywords: any[];
}

export default function MissingKeywords({ keywords }: MissingKeywordsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-error">
          Missing Keywords ({keywords.length} of 25)
        </h2>
        <p className="text-gray-600 mt-2">
          Critical gaps - JD requires these but your CV doesn't mention them
        </p>
      </div>

      <div className="space-y-6">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-l-4 border-error overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-error mb-2">
                      {keyword.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="inline-block bg-error text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        {keyword.priority}
                      </span>
                      <span className="text-error font-bold text-sm">
                        Mentioned {keyword.jdFrequency} times in JD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-error/5 rounded-lg p-4 border border-error/20 mb-4">
                <h4 className="font-semibold text-secondary mb-2">High Priority Gap</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The JD mentions "{keyword.name}" {keyword.jdFrequency} times. Your CV: <span className="font-bold text-error">[NOT FOUND]</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Missing this keyword significantly impacts your match score.
                </p>
              </div>

              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex items-center gap-2 text-success font-semibold hover:text-success/80 text-sm"
              >
                How to Add This Keyword
                {expandedIndex === index ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedIndex === index && (
                <div className="mt-4 bg-success/5 rounded-lg p-4 border border-success/20">
                  <h4 className="font-semibold text-secondary mb-3">Recommended Additions:</h4>
                  <div className="text-sm text-gray-700 space-y-3">
                    <div>
                      <p className="font-medium mb-1">OPTION 1: Add to existing work experience</p>
                      <p className="text-gray-600 italic mb-1">Before: "Analyzed customer data to identify trends"</p>
                      <p className="text-success">After: "Applied {keyword.name.toLowerCase()} to customer data, building predictive models with 85% accuracy"</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">OPTION 2: Add to projects</p>
                      <p className="text-success">New bullet: "Built {keyword.name.toLowerCase()}-powered solution using Python and scikit-learn"</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">OPTION 3: Add to skills</p>
                      <p className="text-success">"{keyword.name}: Intermediate (coursework + 2 projects)"</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time to implement: <span className="font-semibold">10-15 minutes</span></span>
                    <span className="text-success font-semibold">Impact: +{keyword.impact}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="bg-error/5 border-2 border-error rounded-2xl p-6">
          <h3 className="font-bold text-secondary mb-3">Missing Keywords Impact</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>If you add all {keywords.length} missing keywords naturally to your CV:</p>
            <p className="text-lg font-bold text-success">Current match: 78% → Potential match: 98% (+20%)</p>
            <p>Time investment: ~45 minutes total</p>
            <p>Result: Move from "fair match" to "excellent match"</p>
          </div>
          <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90">
            Download Action Checklist
          </button>
        </div>
      </div>
    </section>
  );
}
