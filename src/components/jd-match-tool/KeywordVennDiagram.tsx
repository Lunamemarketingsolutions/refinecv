interface KeywordVennDiagramProps {
  cvKeywords: number;
  jdKeywords: number;
  matchedKeywords: number;
}

export default function KeywordVennDiagram({ cvKeywords, jdKeywords, matchedKeywords }: KeywordVennDiagramProps) {
  const coverage = Math.round((matchedKeywords / jdKeywords) * 100);

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary">
          Keyword Analysis
        </h2>
        <p className="text-gray-600 mt-2">
          Visual breakdown of keyword overlap between your CV and the job description
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
        <div className="flex items-center justify-center mb-8">
          <div className="relative" style={{ width: '500px', height: '300px' }}>
            <svg width="500" height="300" className="mx-auto">
              <circle
                cx="150"
                cy="150"
                r="120"
                fill="rgba(39, 98, 234, 0.15)"
                stroke="#2762ea"
                strokeWidth="2"
              />
              <circle
                cx="350"
                cy="150"
                r="120"
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <ellipse
                cx="250"
                cy="150"
                rx="80"
                ry="100"
                fill="rgba(16, 185, 129, 0.3)"
                stroke="#10B981"
                strokeWidth="2"
              />

              <text x="80" y="50" fill="#0F1C2A" fontSize="14" fontWeight="600">
                Your CV ({cvKeywords})
              </text>
              <text x="320" y="50" fill="#0F1C2A" fontSize="14" fontWeight="600">
                JD Requirements ({jdKeywords})
              </text>
              <text x="185" y="155" fill="#059669" fontSize="16" fontWeight="700" textAnchor="middle">
                Matched
              </text>
              <text x="185" y="175" fill="#059669" fontSize="16" fontWeight="700" textAnchor="middle">
                ({matchedKeywords})
              </text>
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-block bg-success text-white px-4 py-2 rounded-full font-bold">
            {coverage}% Coverage ({matchedKeywords}/{jdKeywords} JD requirements)
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border-l-4 border-success rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
              <span className="text-success">✓</span>
              Strong Overlap ({matchedKeywords} keywords)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              These keywords appear in both your CV and the JD:
            </p>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">Python, Data Analysis, Team Leadership, Project Management, Communication, Product Development, Analytics, Agile, Testing, Git, API, Cloud, AWS, Excel, JavaScript, React, Dashboard, Collaboration</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-success font-medium">
                Action: Keep all of these prominent in your CV.
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-error rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
              <span className="text-error font-bold">!</span>
              High Priority Gaps (7 keywords)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              JD requires these but they're NOT in your CV:
            </p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Machine Learning (4x in JD - HIGH priority)</p>
              <p>• Stakeholder Management (3x)</p>
              <p>• User Research (3x)</p>
              <p>• Roadmap Planning (2x)</p>
              <p>• A/B Testing (2x)</p>
              <p>• Product Analytics (2x)</p>
              <p>• Cross-functional (1x)</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-error font-medium">
                Action: Add 5-7 of these keywords naturally.
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-amber-500 rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
              <span className="text-amber-600 font-bold">*</span>
              Strengthen These (5 keywords)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Your CV says → JD prefers:
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• "Managed team" → "Led cross-functional team"</p>
              <p>• "Worked on features" → "Owned product roadmap"</p>
              <p>• "Analyzed data" → "Conducted user research"</p>
              <p>• "Improved process" → "Implemented Agile methodologies"</p>
              <p>• "Sales growth" → "Revenue optimization"</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-amber-600 font-medium">
                Action: Replace your phrases with JD's exact language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
