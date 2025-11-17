import { Check, X, Flag, Eye, Shield, Zap } from 'lucide-react';

export default function FeatureDifferentiation() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            What Makes RefineCV's ATS Analyzer Different?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Built specifically for Indian MBA students navigating IIM/ISB placement systems
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="text-left p-4 font-bold">Feature</th>
                  <th className="text-center p-4 font-bold">Generic ATS Checkers</th>
                  <th className="text-center p-4 font-bold bg-primary">RefineCV ATS Analyzer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">ATS Pass Score</td>
                  <td className="p-4 text-center text-gray-600">Single number, no context</td>
                  <td className="p-4 text-center font-semibold bg-primary/5">Detailed breakdown by section</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Visual Comparison</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm">Side-by-side CV vs ATS view</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Issue Explanation</td>
                  <td className="p-4 text-center text-gray-600">Vague ("improve formatting")</td>
                  <td className="p-4 text-center font-semibold bg-primary/5">Specific (move contact info from header to body)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Fix Suggestions</td>
                  <td className="p-4 text-center text-gray-600">Generic tips</td>
                  <td className="p-4 text-center font-semibold bg-primary/5">One-click auto-fix for each issue</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">India-Specific</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                    <div className="text-sm text-gray-600">Built for US market</div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm font-semibold">Built for IIM/ISB placements</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Verification Awareness</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm">Flags potentially unverifiable claims</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">One-Page Optimization</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm">Suggests what to cut/keep for 1-page</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Keyword Optimization</td>
                  <td className="p-4 text-center text-gray-600">Basic keyword matching</td>
                  <td className="p-4 text-center font-semibold bg-primary/5">Natural keyword integration (no stuffing)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">Multiple Versions</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm">Track and compare CV versions</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-secondary">JD Integration</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <X className="w-5 h-5 text-error" />
                    </div>
                    <div className="text-sm text-gray-600">Separate tool</div>
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    <div className="flex justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm font-semibold">Combined ATS + JD matching</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Flag className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-secondary text-lg mb-2">Built for IIM Placements</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trained on 600+ successful CVs from IIM/ISB students. Understands consulting vs banking vs PM format differences. Knows what placement committees verify.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-secondary text-lg mb-2">See What ATS Sees</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              First tool to show side-by-side comparison. No guessing. No conflicting scores. Just clarity on exactly what's working and what's broken.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-secondary text-lg mb-2">Verification-Safe Suggestions</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Flags achievements that might be hard to verify. Suggests authentic rephrasing. Helps you avoid the verification hell during placements.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-secondary text-lg mb-2">One-Click Fixes</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Don't just identify problems—fix them. One click converts skill bars to text, moves contact info, standardizes dates, removes tables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
