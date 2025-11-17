import { useState } from 'react';
import { FileText, CheckCircle, X, AlertTriangle, Download } from 'lucide-react';
import { CVAnalysis } from '../../lib/supabase';

interface JDMatchViewerProps {
  analysis: CVAnalysis | null;
}

export default function JDMatchViewer({ analysis }: JDMatchViewerProps) {
  const [activePanel, setActivePanel] = useState<'cv' | 'analysis' | 'jd'>('analysis');

  if (!analysis) {
    return null;
  }

  const matchScore = analysis.match_score;
  const matchedKeywords = analysis.matched_keywords;
  const missingKeywords = analysis.missing_keywords;
  const partialMatches = analysis.partial_matches;
  const strengths = analysis.strengths;
  const weaknesses = analysis.weaknesses;
  const actionItems = analysis.action_items;

  const getMatchColor = (score: number) => {
    if (score >= 91) return 'text-success';
    if (score >= 76) return 'text-success';
    if (score >= 61) return 'text-warning';
    return 'text-error';
  };

  const getMatchBg = (score: number) => {
    if (score >= 91) return 'bg-success';
    if (score >= 76) return 'bg-success';
    if (score >= 61) return 'bg-warning';
    return 'bg-error';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 91) return 'Excellent Match';
    if (score >= 76) return 'Good Match';
    if (score >= 61) return 'Fair Match';
    return 'Poor Match';
  };

  const totalImpact = actionItems.reduce((sum, item) => {
    const impact = parseInt(item.impact.replace('+', '').replace('%', ''));
    return sum + impact;
  }, 0);

  const handleDownloadReport = () => {
    const reportContent = `
CV-JD Match Analysis Report
Generated: ${new Date().toLocaleString()}

Match Score: ${matchScore}%
Status: ${getMatchLabel(matchScore)}

MATCHED KEYWORDS (${matchedKeywords.length}):
${matchedKeywords.map(k => `- ${k.keyword}: CV ${k.cvCount}x, JD ${k.jdCount}x`).join('\n')}

MISSING KEYWORDS (${missingKeywords.length}):
${missingKeywords.map(k => `- ${k.keyword} (${k.priority} Priority): ${k.jdCount} mentions in JD\n  Suggestion: ${k.suggestion}\n  Example: ${k.example}`).join('\n\n')}

PARTIAL MATCHES (${partialMatches.length}):
${partialMatches.map(p => `- Your CV: "${p.cvText}"\n  JD uses: "${p.jdText}"\n  Recommendation: ${p.recommendation}`).join('\n\n')}

STRENGTHS:
${strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

WEAKNESSES:
${weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

ACTION ITEMS:
${actionItems.map((a, i) => `${i + 1}. [${a.priority}] ${a.action}\n   Impact: ${a.impact} | Time: ${a.time}${a.suggestion ? `\n   Suggestion: ${a.suggestion}` : ''}`).join('\n\n')}

Total Potential Improvement: +${totalImpact}%
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-jd-match-report-${matchScore}%.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Your CV-JD Match Analysis
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Detailed analysis with keyword gaps, strengths, weaknesses, and actionable recommendations
          </p>
        </div>

        <div className="lg:hidden mb-6">
          <div className="flex gap-2 bg-white rounded-lg p-1">
            <button
              onClick={() => setActivePanel('cv')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activePanel === 'cv' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Your CV
            </button>
            <button
              onClick={() => setActivePanel('analysis')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activePanel === 'analysis' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Match Analysis
            </button>
            <button
              onClick={() => setActivePanel('jd')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activePanel === 'jd' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Job Description
            </button>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-primary/5 border-b-2 border-primary/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-secondary">Your CV</h3>
              </div>
            </div>
            <div className="p-6 h-[600px] overflow-y-auto">
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {analysis.cv_text.substring(0, 1500)}
                    {analysis.cv_text.length > 1500 && '...'}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Total words: {analysis.cv_text.split(/\s+/).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-primary/5 border-b-2 border-primary/10 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-secondary">Match Analysis</h3>
              <button
                onClick={handleDownloadReport}
                className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download Report
              </button>
            </div>
            <div className="p-6 h-[600px] overflow-y-auto">
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={matchScore >= 76 ? '#10B981' : matchScore >= 61 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - matchScore / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-black ${getMatchColor(matchScore)}`}>{matchScore}%</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-secondary font-semibold mb-2">{getMatchLabel(matchScore)}</p>
                <p className="text-center text-sm text-gray-600">Follow recommendations below to improve</p>
              </div>

              <div className="space-y-4">
                <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                  <div className="flex items-center justify-between w-full text-left mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <h4 className="font-bold text-secondary">Matched Keywords ({matchedKeywords.length})</h4>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {matchedKeywords.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <span className="text-gray-700">{item.keyword}</span>
                        <span className="text-xs text-gray-500">CV: {item.cvCount}x, JD: {item.jdCount}x</span>
                      </div>
                    ))}
                    {matchedKeywords.length > 5 && (
                      <p className="text-xs text-gray-500">+ {matchedKeywords.length - 5} more</p>
                    )}
                  </div>
                </div>

                {missingKeywords.length > 0 && (
                  <div className="bg-error/5 rounded-lg p-4 border border-error/20">
                    <div className="flex items-center justify-between w-full text-left mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-error" />
                        <h4 className="font-bold text-secondary">Missing Keywords ({missingKeywords.length})</h4>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      {missingKeywords.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-error/20">
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-gray-900">{item.keyword}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${item.priority === 'High' ? 'bg-error text-white' : 'bg-warning text-white'}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">JD mentions {item.jdCount} times</p>
                          <p className="text-xs text-gray-700 mb-1">{item.suggestion}</p>
                          <p className="text-xs text-primary italic">"{item.example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {partialMatches.length > 0 && (
                  <div className="bg-warning/5 rounded-lg p-4 border border-warning/20">
                    <div className="flex items-center justify-between w-full text-left mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <h4 className="font-bold text-secondary">Keywords to Strengthen ({partialMatches.length})</h4>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {partialMatches.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-warning/20">
                          <p className="text-xs text-gray-600 mb-1">Your CV: "{item.cvText}"</p>
                          <p className="text-xs text-gray-600 mb-1">JD says: "{item.jdText}"</p>
                          <p className="text-xs text-warning font-semibold">→ {item.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                  <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-error/5 rounded-lg p-4 border border-error/20">
                  <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-error" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h4 className="font-bold text-secondary mb-3">Action Items</h4>
                  <div className="space-y-3 text-sm">
                    {actionItems.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-primary/20">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-gray-900">{idx + 1}. {item.action}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${item.priority === 'HIGH' ? 'bg-error text-white' : item.priority === 'MEDIUM' ? 'bg-warning text-white' : 'bg-gray-400 text-white'}`}>
                            {item.priority}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">Impact:</span>
                            <span className="font-semibold text-success ml-1">{item.impact}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold text-gray-900 ml-1">{item.time}</span>
                          </div>
                        </div>
                        {item.suggestion && (
                          <p className="text-xs text-primary italic">Suggested: "{item.suggestion}"</p>
                        )}
                      </div>
                    ))}
                    <div className="bg-primary text-white p-3 rounded text-center">
                      <p className="font-bold">TOTAL POTENTIAL: +{totalImpact}% match score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-primary/5 border-b-2 border-primary/10 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-secondary">Job Description</h3>
            </div>
            <div className="p-6 h-[600px] overflow-y-auto">
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {analysis.jd_text}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Total words: {analysis.jd_text.split(/\s+/).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          {activePanel === 'cv' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {analysis.cv_text}
                  </p>
                </div>
              </div>
            </div>
          )}
          {activePanel === 'analysis' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={matchScore >= 76 ? '#10B981' : matchScore >= 61 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - matchScore / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-4xl font-black ${getMatchColor(matchScore)}`}>{matchScore}%</div>
                  </div>
                </div>
                <p className="text-center text-secondary font-semibold">{getMatchLabel(matchScore)}</p>
              </div>
              <div className="space-y-4 text-sm">
                <p className="text-gray-700">
                  {matchedKeywords.length} keywords matched • {missingKeywords.length} keywords missing
                </p>
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold"
                >
                  Download Full Report
                </button>
              </div>
            </div>
          )}
          {activePanel === 'jd' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {analysis.jd_text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-black ${getMatchColor(matchScore)}`}>{matchScore}%</div>
              <div className="text-sm">
                <p className="text-gray-600">{matchedKeywords.length} keywords matched</p>
                <p className="text-gray-600">Follow {actionItems.length} actions to improve +{totalImpact}%</p>
              </div>
            </div>
            <button
              onClick={handleDownloadReport}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
            >
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
