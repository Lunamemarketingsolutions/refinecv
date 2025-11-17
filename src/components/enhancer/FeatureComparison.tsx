import { Check, X } from 'lucide-react';

export default function FeatureComparison() {
  const features = [
    { name: 'Time per CV', manual: '2-3 hours', chatgpt: '30-60 min', refinecv: '15 minutes' },
    { name: 'Bullet Rating', manual: 'Subjective', chatgpt: 'No rating', refinecv: '1-5 star rating' },
    { name: 'Multiple Versions', manual: false, chatgpt: '1 version', refinecv: '3-5 versions' },
    { name: 'Context Awareness', manual: false, chatgpt: 'Generic', refinecv: 'Role-specific' },
    { name: 'Live Preview', manual: false, chatgpt: false, refinecv: true },
    { name: 'Section-by-Section', manual: false, chatgpt: false, refinecv: true },
    { name: 'Verification Guidance', manual: false, chatgpt: false, refinecv: true },
    { name: 'Authenticity Check', manual: false, chatgpt: 'Suggests fake numbers', refinecv: 'Realistic metrics' },
    { name: 'Action Verb Library', manual: 'Google search', chatgpt: 'Generic verbs', refinecv: 'Role-specific' },
    { name: 'IIM/ISB Optimized', manual: false, chatgpt: false, refinecv: true },
    { name: 'Quantification Help', manual: 'Struggle alone', chatgpt: 'Random numbers', refinecv: 'Contextual metrics' },
    { name: 'Version History', manual: false, chatgpt: false, refinecv: true },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Why RefineCV's CV Enhancer is Different
          </h2>
          <p className="text-lg text-gray-600">
            Not just grammar checking—intelligent, context-aware bullet point transformation
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
            <thead>
              <tr className="bg-background">
                <th className="px-6 py-4 text-left font-black text-secondary border-b-2 border-gray-200">Feature</th>
                <th className="px-6 py-4 text-center font-black text-secondary border-b-2 border-gray-200">Manual Rewriting</th>
                <th className="px-6 py-4 text-center font-black text-secondary border-b-2 border-gray-200">ChatGPT/Generic AI</th>
                <th className="px-6 py-4 text-center font-black text-primary border-b-2 border-primary bg-primary/5">RefineCV Enhancer</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="px-6 py-4 font-semibold text-secondary border-b border-gray-200">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center border-b border-gray-200">
                    {typeof feature.manual === 'boolean' ? (
                      feature.manual ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-error mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{feature.manual}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center border-b border-gray-200">
                    {typeof feature.chatgpt === 'boolean' ? (
                      feature.chatgpt ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-error mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{feature.chatgpt}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center border-b border-primary bg-primary/5">
                    {typeof feature.refinecv === 'boolean' ? (
                      feature.refinecv ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-error mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-primary">{feature.refinecv}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
