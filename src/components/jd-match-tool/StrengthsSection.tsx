import { Code, Briefcase, GraduationCap, Folder, TrendingUp } from 'lucide-react';

interface StrengthsSectionProps {
  strengths: any[];
}

const icons = [Code, Briefcase, GraduationCap, Folder, TrendingUp];

export default function StrengthsSection({ strengths }: StrengthsSectionProps) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-success">
          Your Strengths for This Role
        </h2>
        <p className="text-gray-600 mt-2">
          These CV sections align excellently with the JD requirements
        </p>
      </div>

      <div className="space-y-6">
        {strengths.map((strength, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border-l-4 border-success p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary">{strength.title}</h3>
                    <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded">
                      {strength.match}% overlap
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold">What's Strong:</span> {strength.details}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-success">
                      <span className="font-semibold">How to Leverage This:</span> Keep this section prominent. This is a major competitive advantage for this role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
