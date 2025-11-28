import { Shield, Check } from 'lucide-react';

export default function TrustBanner() {
  const commitments = [
    'Sell your data to third parties',
    'Use your CV for marketing purposes',
    'Share your information without your consent',
    'Store your data longer than necessary',
  ];

  return (
    <div className="bg-primary/5 border-2 border-primary rounded-xl p-6 lg:p-8 my-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
            <span>🔒</span> Your Privacy is Our Priority
          </h3>

          <p className="text-secondary mb-4 leading-relaxed">
            At RefineCV, we're committed to protecting your personal information. We will NEVER:
          </p>

          <ul className="space-y-2 mb-4">
            {commitments.map((commitment, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-secondary">{commitment}</span>
              </li>
            ))}
          </ul>

          <p className="text-secondary font-medium mb-4">
            Your CV data is used ONLY to provide our analysis services.
          </p>

          <a
            href="mailto:support.refinecv@gmail.com"
            className="text-primary hover:text-primary/80 font-semibold underline transition-colors"
          >
            Questions? Contact us at support.refinecv@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
