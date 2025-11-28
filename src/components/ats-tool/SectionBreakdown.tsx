import { useState } from 'react';
import { Check, X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  score: number;
  detected: string;
  issues: string;
}

interface SectionBreakdownProps {
  sections: Record<string, Section>;
}

export default function SectionBreakdown({ sections }: SectionBreakdownProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sectionNames: Record<string, string> = {
    contactInfo: 'Contact Information',
    workExperience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
  };

  const getDetectionIcon = (detected: string) => {
    if (detected === 'yes') return <Check className="w-5 h-5 text-success" />;
    if (detected === 'no') return <X className="w-5 h-5 text-error" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-amber-600';
    return 'text-error';
  };

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary">
          📊 Section-by-Section Breakdown
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Section
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Detected?
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Issues
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(sections).map(([key, section]) => (
                <>
                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-secondary">
                        {sectionNames[key] || key}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getDetectionIcon(section.detected)}
                        <span className="text-sm capitalize">{section.detected}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                        {section.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {section.issues}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                        className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
                      >
                        View Details
                        {expandedSection === key ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedSection === key && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                            {section.detected === 'yes' && <Check className="w-5 h-5 text-success" />}
                            {sectionNames[key]} Section Analysis
                          </h4>

                          <div className="text-sm space-y-2 text-gray-700">
                            <p><span className="font-medium">Detection Status:</span> {section.detected === 'yes' ? 'Successfully detected' : section.detected === 'partial' ? 'Partially detected' : 'Not detected'}</p>
                            <p><span className="font-medium">Issues:</span> {section.issues}</p>
                            <p><span className="font-medium">Overall Section Score:</span> <span className={`font-bold ${getScoreColor(section.score)}`}>{section.score}%</span></p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
