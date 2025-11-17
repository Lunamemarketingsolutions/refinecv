import { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ATSViewer() {
  const [activeTab, setActiveTab] = useState<'cv' | 'ats'>('cv');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const issues = {
    critical: [
      {
        id: 'contact',
        title: 'Contact Information Not Detected',
        problem: 'Name, phone, LinkedIn in header/footer',
        impact: 'ATS can\'t identify you or contact you',
        fix: 'Move all contact info to main body at top',
        score: 15,
      },
      {
        id: 'skills',
        title: 'Skills Section Not Parsed',
        problem: 'Visual skill bars/charts',
        impact: 'ATS thinks you have zero skills',
        fix: 'Convert to text list: "Python: Advanced (5 years)"',
        score: 10,
      },
    ],
    warnings: [
      {
        id: 'table',
        title: 'Table Layout Detected',
        problem: 'Two-column layout using tables',
        impact: 'ATS may read left-to-right, mixing content',
        fix: 'Use single-column layout with clear section breaks',
        score: 8,
      },
      {
        id: 'dates',
        title: 'Inconsistent Date Formatting',
        problem: 'Mixed formats (Jan 2023, 01/2023, 2023-01)',
        impact: 'ATS struggles to build timeline',
        fix: 'Use consistent format: "Month YYYY - Month YYYY"',
        score: 5,
      },
    ],
    passed: [
      {
        id: 'experience',
        title: 'Work Experience Section',
        status: 'All bullet points parsed correctly',
      },
      {
        id: 'education',
        title: 'Education Section',
        status: 'Degree, institution, dates detected',
      },
      {
        id: 'format',
        title: 'File Format',
        status: 'PDF is ATS-compatible',
      },
    ],
  };

  const criticalCount = issues.critical.length;
  const warningCount = issues.warnings.length;
  const passedCount = issues.passed.length;

  return (
    <section className="py-16 lg:py-24 bg-background" id="upload">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            See What ATS Actually Sees
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The first ATS viewer built specifically for Indian MBA students. Upload your CV and instantly see how it's being parsed—before you apply.
          </p>
        </div>

        <div className="lg:hidden mb-6">
          <div className="flex gap-2 bg-white rounded-xl p-2">
            <button
              onClick={() => setActiveTab('cv')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                activeTab === 'cv'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              Your CV
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                activeTab === 'ats'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              ATS View
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${activeTab === 'ats' ? 'hidden lg:block' : ''}`}>
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
              <span className="font-bold">Your CV</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 min-h-[500px] bg-gray-50">
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-secondary">Arjun Mehta</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <AlertCircle className="w-4 h-4 text-error" />
                      <span className="text-sm text-error">Contact info in header - not parsed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-success pl-4">
                    <h4 className="font-bold text-secondary mb-1 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      EDUCATION
                    </h4>
                    <p className="text-sm text-gray-600">Master of Business Administration</p>
                    <p className="text-sm text-gray-600">IIM Ahmedabad • 2022-2024</p>
                  </div>

                  <div className="border-l-4 border-success pl-4">
                    <h4 className="font-bold text-secondary mb-1 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      WORK EXPERIENCE
                    </h4>
                    <p className="text-sm font-semibold text-gray-700">Product Manager</p>
                    <p className="text-sm text-gray-600">TechCorp India • June 2022 - Present</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1">
                      <li>Led product strategy for B2B SaaS platform</li>
                      <li>Increased user engagement by 45%</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-error pl-4 bg-error/5 p-3 rounded">
                    <h4 className="font-bold text-secondary mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-error" />
                      SKILLS
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Python</span>
                      </div>
                      <p className="text-xs text-error">Visual charts not readable by ATS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${activeTab === 'cv' ? 'hidden lg:block' : ''}`}>
            <div className="bg-gradient-to-r from-secondary to-secondary/80 text-white p-4 flex items-center justify-between">
              <span className="font-bold">ATS View</span>
              <div className="flex items-center gap-2">
                <span className="bg-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                  78%
                </span>
                <button className="px-3 py-1 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-colors">
                  Improve Score
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 min-h-[500px] bg-gray-50 font-mono text-sm">
              <div className="bg-error/10 border-l-4 border-error p-3 rounded">
                <p className="text-error font-bold">[Parsed Content]</p>
              </div>

              <div className="space-y-2">
                <div className="bg-error/10 p-2 rounded">
                  <p className="text-error">Name: [Could not extract]</p>
                </div>
                <div className="bg-success/10 p-2 rounded">
                  <p className="text-success">Email: arjun.mehta@email.com</p>
                </div>
                <div className="bg-error/10 p-2 rounded">
                  <p className="text-error">Phone: [Could not extract]</p>
                </div>
                <div className="bg-error/10 p-2 rounded">
                  <p className="text-error">LinkedIn: [Could not extract]</p>
                </div>
              </div>

              <div className="bg-success/10 border-l-4 border-success p-3 rounded">
                <p className="font-bold text-success mb-2">EDUCATION:</p>
                <p className="text-secondary">- Master of Business Administration</p>
                <p className="text-secondary">  IIM Ahmedabad</p>
                <p className="text-secondary">  2022-2024</p>
              </div>

              <div className="bg-success/10 border-l-4 border-success p-3 rounded">
                <p className="font-bold text-success mb-2">WORK EXPERIENCE:</p>
                <p className="text-secondary">- Product Manager</p>
                <p className="text-secondary">  Company: TechCorp India</p>
                <p className="text-secondary">  Dates: June 2022 - Present</p>
                <p className="text-secondary">  • Led product strategy for B2B SaaS platform</p>
                <p className="text-secondary">  • Increased user engagement by 45%</p>
              </div>

              <div className="bg-error/10 border-l-4 border-error p-3 rounded">
                <p className="font-bold text-error mb-2">SKILLS:</p>
                <p className="text-error">[No skills detected - visual representation not parseable]</p>
              </div>

              <div className="bg-warning/10 p-3 rounded border border-warning">
                <p className="text-warning font-bold mb-1">FORMATTING ISSUES DETECTED: 7</p>
                <p className="text-warning">SECTIONS WITH ERRORS: 4</p>
                <p className="text-error font-bold">MISSING CRITICAL INFO: Name, Phone, LinkedIn, Skills</p>
              </div>
            </div>

            <div className="absolute top-20 right-6 bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <span>Critical: {criticalCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span>Warnings: {warningCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span>Passed: {passedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
          <h3 className="text-2xl font-black text-secondary mb-6">Issue Breakdown</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-error text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Critical Issues ({criticalCount})
              </h4>
              <div className="space-y-3">
                {issues.critical.map((issue) => (
                  <div key={issue.id} className="border-2 border-error/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                      className="w-full p-4 bg-error/5 hover:bg-error/10 transition-colors flex items-center justify-between"
                    >
                      <span className="font-bold text-secondary">{issue.title}</span>
                      {expandedIssue === issue.id ? (
                        <ChevronUp className="w-5 h-5 text-error" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-error" />
                      )}
                    </button>
                    {expandedIssue === issue.id && (
                      <div className="p-4 space-y-2 text-sm">
                        <div>
                          <span className="font-bold text-secondary">Problem:</span> {issue.problem}
                        </div>
                        <div>
                          <span className="font-bold text-secondary">Impact:</span> {issue.impact}
                        </div>
                        <div>
                          <span className="font-bold text-secondary">Fix:</span> {issue.fix}
                        </div>
                        <div className="pt-2 border-t">
                          <span className="font-bold text-primary">Estimated impact: +{issue.score}% ATS score</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-warning text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warnings ({warningCount})
              </h4>
              <div className="space-y-3">
                {issues.warnings.map((issue) => (
                  <div key={issue.id} className="border-2 border-warning/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                      className="w-full p-4 bg-warning/5 hover:bg-warning/10 transition-colors flex items-center justify-between"
                    >
                      <span className="font-bold text-secondary">{issue.title}</span>
                      {expandedIssue === issue.id ? (
                        <ChevronUp className="w-5 h-5 text-warning" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-warning" />
                      )}
                    </button>
                    {expandedIssue === issue.id && (
                      <div className="p-4 space-y-2 text-sm">
                        <div>
                          <span className="font-bold text-secondary">Problem:</span> {issue.problem}
                        </div>
                        <div>
                          <span className="font-bold text-secondary">Impact:</span> {issue.impact}
                        </div>
                        <div>
                          <span className="font-bold text-secondary">Fix:</span> {issue.fix}
                        </div>
                        <div className="pt-2 border-t">
                          <span className="font-bold text-primary">Estimated impact: +{issue.score}% ATS score</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-success text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Passed ({passedCount})
              </h4>
              <div className="space-y-2">
                {issues.passed.map((issue) => (
                  <div key={issue.id} className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="font-bold text-secondary">{issue.title}:</span>
                      <span className="text-gray-600">{issue.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all">
            Fix All Issues Automatically
          </button>
          <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/5 transition-all">
            Download Detailed Report (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}
