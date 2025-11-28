import { AlertTriangle, MapPin, Eye, Wrench, Clock, TrendingUp } from 'lucide-react';

interface Issue {
  title: string;
  impact: string;
  impactScore: number;
  problem: string;
  location: string;
  atsView: string;
  solution: string;
  timeToFix: string;
  scoreImpact: string;
}

interface CriticalIssuesProps {
  issues: Issue[];
}

export default function CriticalIssues({ issues }: CriticalIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
          <span className="text-error">🔴</span>
          Critical Issues ({issues.length})
        </h2>
        <p className="text-gray-600 mt-2">
          These issues prevent ATS from reading your CV correctly. Fix these first for maximum impact.
        </p>
      </div>

      <div className="space-y-6">
        {issues.map((issue, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-error"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="w-6 h-6 text-error flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-error mb-1">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="inline-block bg-error text-white text-xs font-bold px-2 py-1 rounded">
                      {issue.impact}
                    </span>
                    <span className="text-error font-bold text-sm">
                      {issue.impactScore}% ATS Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-error/5 rounded-lg p-4 border border-error/20">
                <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <span className="text-error">❌</span>
                  What's Wrong:
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {issue.problem}
                </p>

                <h4 className="font-semibold text-secondary mt-4 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-error" />
                  Location in CV:
                </h4>
                <p className="text-gray-700">{issue.location}</p>

                <h4 className="font-semibold text-secondary mt-4 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-error" />
                  What ATS Sees:
                </h4>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
{issue.atsView}
                </pre>
              </div>

              <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-success" />
                  <span className="text-success">✅</span>
                  How to Fix:
                </h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                  {issue.solution}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Time to Fix: <span className="font-semibold">{issue.timeToFix}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-gray-600">
                      Impact: <span className="font-semibold text-success">{issue.scoreImpact}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-error/5 rounded-lg p-3 border border-error/20">
                  <div className="text-xs font-semibold text-gray-600 mb-2">❌ BEFORE (Not ATS-friendly)</div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`[Header - Not readable by ATS]
----------------------------------------
| Name: Naveen Kumar                   |
| Phone: +91 98765 43210              |
----------------------------------------`}
                  </pre>
                </div>

                <div className="bg-success/5 rounded-lg p-3 border border-success/20">
                  <div className="text-xs font-semibold text-gray-600 mb-2">✅ AFTER (ATS-optimized)</div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`Naveen Kumar
+91 98765 43210
naveen@example.com
linkedin.com/in/naveenkumar

WORK EXPERIENCE
...`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
