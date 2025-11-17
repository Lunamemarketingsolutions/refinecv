import { CheckCircle, X } from 'lucide-react';

export default function FeatureComparison() {
  const features = [
    { feature: 'Time per CV', manual: '3-4 hours', generic: '1-2 hours', refineCV: '15 minutes' },
    { feature: 'Match % Accuracy', manual: 'Guesswork', generic: '50-60%', refineCV: '80-90%' },
    { feature: 'Keyword Gap Analysis', manual: false, generic: 'Basic list', refineCV: 'Visual Venn diagram + priority' },
    { feature: 'Role-Specific Framing', manual: false, generic: false, refineCV: 'Consulting vs Banking vs PM examples' },
    { feature: 'Action Items', manual: false, generic: 'Vague tips', refineCV: 'Specific, prioritized, time-estimated' },
    { feature: 'Strengths/Weaknesses', manual: false, generic: 'Basic list', refineCV: 'Detailed with context' },
    { feature: 'Reordering Suggestions', manual: false, generic: false, refineCV: true },
    { feature: 'Split-Panel View', manual: false, generic: false, refineCV: 'CV vs JD side-by-side' },
    { feature: 'India B-School Focus', manual: false, generic: false, refineCV: 'Built for IIM placements' },
    { feature: 'Multiple JD Versions', manual: 'Start from scratch each time', generic: false, refineCV: 'Save and compare versions' },
    { feature: 'One-Click Apply Fixes', manual: false, generic: false, refineCV: 'Auto-apply high priority changes' },
  ];

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="w-5 h-5 text-success mx-auto" />
      ) : (
        <X className="w-5 h-5 text-error mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Why RefineCV's JD Matcher is Different
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Not just keyword matching—intelligent tailoring for Indian MBA placements
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Manual Tailoring</th>
                  <th className="px-6 py-4 text-center font-bold">Generic CV Tools</th>
                  <th className="px-6 py-4 text-center font-bold bg-primary/90">RefineCV JD Matcher</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold text-secondary border-b border-gray-200">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-200">
                      {renderCell(row.manual)}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-200">
                      {renderCell(row.generic)}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-200 bg-success/5">
                      <div className="font-semibold text-success">
                        {renderCell(row.refineCV)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-primary/5 rounded-2xl p-6 lg:p-8 border-2 border-primary/20 text-center">
          <p className="text-xl font-bold text-secondary mb-4">
            RefineCV doesn't just find keywords—it helps you tell the right story for each role.
          </p>
          <p className="text-gray-700">
            Built specifically for Indian B-school placement season: Consulting, Banking, PM, Marketing—different keywords, different framing, same authentic you.
          </p>
        </div>
      </div>
    </section>
  );
}
