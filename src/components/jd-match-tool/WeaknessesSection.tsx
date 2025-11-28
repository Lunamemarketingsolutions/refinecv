import { MessageSquare, Users, Target, UserCheck, Briefcase } from 'lucide-react';

interface WeaknessesSectionProps {
  weaknesses: any[];
}

const icons = [MessageSquare, Users, Target, UserCheck, Briefcase];

export default function WeaknessesSection({ weaknesses }: WeaknessesSectionProps) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-amber-600">
          Improvement Opportunities
        </h2>
        <p className="text-gray-600 mt-2">
          Areas where your CV could better align with this specific JD
        </p>
      </div>

      <div className="space-y-6">
        {weaknesses.map((weakness, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border-l-4 border-amber-500 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary">{weakness.title}</h3>
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      {weakness.impact}
                    </span>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold">What's Weak:</span> {weakness.fix}
                    </p>
                  </div>
                  <div className="text-sm text-success">
                    <span className="font-semibold">How to Fix:</span> {weakness.fix}
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
