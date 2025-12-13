import { CheckCircle2, AlertTriangle, XCircle, FileText, AlertCircle } from 'lucide-react';
import type { ATSAnalysis } from '../../types/ats';

interface ATSViewProps {
  analysis: ATSAnalysis;
}

export default function ATSView({
  analysis
}: ATSViewProps) {
  const sections = analysis.detectedSections || [];
  const extractedSectionsCount = sections.filter(s => s.wasExtracted).length;
  const missingSectionsCount = sections.filter(s => !s.wasExtracted).length;

  return (
    <div className="flex flex-col">
      <div className="bg-gray-800 text-white px-3 py-1.5 rounded-t-lg">
        <span className="text-xs font-medium">ATS View</span>
      </div>
      <div className="bg-white shadow-lg">
        <div className="space-y-0">
          <div className="p-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-gray-900">Resume Structure Analysis</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] font-medium text-gray-700">{extractedSectionsCount} extracted</span>
                </div>
                {missingSectionsCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-red-600" />
                    <span className="text-[10px] font-medium text-gray-700">{missingSectionsCount} missing</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-600">
              These are the sections detected in your resume and what ATS systems were able to extract
            </p>
          </div>

          {sections.length > 0 ? (
            <div className="p-3 space-y-2">
              {sections.map((section, index) => {
                const isExtracted = section.wasExtracted;

                return (
                  <div
                    key={`${section.normalizedKey}-${index}`}
                    className={`rounded-md border transition-all ${
                      isExtracted
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="p-2">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <div className={isExtracted ? 'text-green-600' : 'text-red-400'}>
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{section.headerText}</h4>
                            <p className="text-[10px] text-gray-500">Line {section.lineNumber}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isExtracted ? (
                            <div className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-green-100 border border-green-300 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5 text-green-700" />
                              <span className="text-[10px] font-semibold text-green-700">Extracted</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-red-100 border border-red-300 rounded">
                              <XCircle className="w-2.5 h-2.5 text-red-700" />
                              <span className="text-[10px] font-semibold text-red-700">Issue Found</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {isExtracted ? (
                        <div className="mt-2 p-2 bg-white rounded border border-green-200">
                          <pre className="text-[10px] text-gray-800 whitespace-pre-wrap font-sans leading-snug">
                            {section.extractedContent}
                          </pre>
                        </div>
                      ) : (
                        <div className="mt-2 p-2 bg-white rounded border border-red-200">
                          <div className="flex items-start space-x-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-semibold text-gray-900 mb-0.5">
                                ATS could not extract this section
                              </p>
                              <p className="text-[10px] text-gray-700">
                                {section.issueReason || 'This section header was detected but no content could be extracted. Use the "Fix with AI" button on the PDF to resolve this issue.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">No clear sections detected</h4>
                  <p className="text-[10px] text-gray-700">
                    Your resume does not appear to have clearly formatted section headers. ATS systems work best
                    with resumes that have distinct sections like "Experience", "Education", "Skills", etc.
                    Consider adding clear section headers to improve ATS readability.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
