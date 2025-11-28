export default function RoleFramingSection() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-primary">
          Reframe for Product Management Role
        </h2>
        <p className="text-gray-600 mt-2">
          This JD is for a Product Manager. Here's how to position your same experiences specifically for PM roles vs engineering roles.
        </p>
      </div>

      <div className="bg-primary/5 border-2 border-primary rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-secondary mb-3">Why This Matters:</h3>
        <div className="text-sm text-gray-700 leading-relaxed space-y-2">
          <p>Product Managers and Software Engineers do different things - even when working on the same project:</p>
          <p><span className="font-bold">Engineer Focus:</span> HOW to build (technical implementation)</p>
          <p><span className="font-bold">PM Focus:</span> WHAT to build and WHY (product decisions)</p>
          <p className="pt-2 border-t border-primary/20 mt-3">Your CV currently shows engineering work. For PM roles, reframe to show product thinking.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4 p-6">
            <div>
              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Engineering Framing</p>
                <p className="text-sm text-gray-700 font-mono leading-relaxed">
                  "Worked on three mobile applications including two Android and one iOS, designed, built and maintained reusable and reliable Java code"
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-error">★★☆☆☆</span>
                <span className="text-gray-600">(2/5 for PM role)</span>
              </div>
              <div className="mt-2 text-xs text-error space-y-1">
                <p>- Pure engineering focus</p>
                <p>- No product thinking</p>
                <p>- No user mention</p>
                <p>- Technical jargon</p>
              </div>
            </div>

            <div>
              <div className="bg-success/10 rounded-lg p-4 mb-3 border-2 border-success">
                <p className="text-xs font-semibold text-success uppercase mb-2">Product Management Framing</p>
                <p className="text-sm text-gray-800 font-mono leading-relaxed font-medium">
                  "Defined product requirements and roadmap for 3 mobile applications serving 10,000+ users; conducted user research (200+ surveys) to prioritize features; collaborated with engineering team of 5"
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-success">★★★★★</span>
                <span className="text-success">(5/5 for PM role)</span>
              </div>
              <div className="mt-2 text-xs text-success space-y-1">
                <p>✅ Product decisions</p>
                <p>✅ User research</p>
                <p>✅ Collaboration context</p>
                <p>✅ Business metrics</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <h4 className="font-semibold text-secondary mb-2">Key Changes:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• "Worked on" → "Defined requirements and roadmap"</p>
              <p>• "Built" → "Collaborated with engineering team"</p>
              <p>• "Java code" → User-focused outcomes</p>
              <p>• Added: User research, sprint cycles, ratings, active users</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border-2 border-primary rounded-2xl p-6">
          <h3 className="font-bold text-secondary mb-3">Product Management Language Pattern</h3>
          <div className="text-sm text-gray-700 leading-relaxed space-y-2">
            <p>For PM roles, structure every bullet to answer:</p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li><span className="font-semibold">WHAT</span> product/feature? (Scope and context)</li>
              <li><span className="font-semibold">WHY</span> did you build it? (User need or business goal)</li>
              <li><span className="font-semibold">WHO</span> did you work with? (Cross-functional collaboration)</li>
              <li><span className="font-semibold">HOW</span> did you decide? (Research, data, prioritization)</li>
              <li><span className="font-semibold">WHAT</span> was the impact? (Metrics, outcomes)</li>
            </ol>
            <p className="pt-3 border-t border-primary/20 mt-3 font-medium">
              Same Experience. Completely Different Story. Use PM framing for PM roles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
