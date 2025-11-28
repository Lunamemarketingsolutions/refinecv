import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MatchedKeywordsProps {
  keywords: any[];
}

export default function MatchedKeywords({ keywords }: MatchedKeywordsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayKeywords = showAll ? keywords : keywords.slice(0, 5);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-success">
          Matched Keywords ({keywords.length} of 25)
        </h2>
        <p className="text-gray-600 mt-2">
          Keywords you already have - keep these prominent in your CV
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
        <div className="space-y-4">
          {displayKeywords.map((keyword, index) => (
            <div
              key={index}
              className="border-l-4 border-success bg-success/5 rounded-lg p-4 hover:bg-success/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-secondary text-lg">{keyword.name}</h3>
                  <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded">
                    ✓ Matched
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-success font-bold">{keyword.jdFrequency}x in JD</span>
                  <span className="text-gray-600">{keyword.cvFrequency}x in your CV</span>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-semibold">Status:</span> {keyword.status === 'matched' ? 'Well covered!' : 'Under-represented - could strengthen'}</p>
                <p><span className="font-semibold">Recommendation:</span> {keyword.status === 'matched' ? 'Maintain current prominence. This keyword is contributing well to your match score.' : `Add ${keyword.jdFrequency - keyword.cvFrequency} more mentions to match JD emphasis.`}</p>
              </div>
            </div>
          ))}
        </div>

        {keywords.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-6 text-primary font-semibold hover:text-primary/80 flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                Show All {keywords.length} Keywords <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
