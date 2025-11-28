import { Link } from 'react-router-dom';

interface UsageStatisticsProps {
  usageToday: {
    atsAnalyzer: { used: number; limit: number };
    jdMatch: { used: number; limit: number };
    cvEnhancer: { used: number; limit: number };
  };
}

export default function UsageStatistics({ usageToday }: UsageStatisticsProps) {
  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 66) return 'bg-amber-500';
    return 'bg-success';
  };

  const getStatusColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 100) return 'text-error';
    if (percentage >= 66) return 'text-amber-600';
    return 'text-success';
  };

  const totalUsed = usageToday.atsAnalyzer.used + usageToday.jdMatch.used + usageToday.cvEnhancer.used;
  const totalLimit = usageToday.atsAnalyzer.limit + usageToday.jdMatch.limit + usageToday.cvEnhancer.limit;
  const totalPercentage = (totalUsed / totalLimit) * 100;

  const tools = [
    {
      name: 'ATS Analyzer',
      used: usageToday.atsAnalyzer.used,
      limit: usageToday.atsAnalyzer.limit,
    },
    {
      name: 'JD CV Match',
      used: usageToday.jdMatch.used,
      limit: usageToday.jdMatch.limit,
    },
    {
      name: 'CV Enhancer',
      used: usageToday.cvEnhancer.used,
      limit: usageToday.cvEnhancer.limit,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black text-secondary mb-6">Your Usage Today</h2>
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-5 gap-8 p-8">
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-lg font-bold text-secondary mb-4">Usage Breakdown</h3>
            {tools.map((tool) => {
              const percentage = (tool.used / tool.limit) * 100;
              const remaining = tool.limit - tool.used;

              return (
                <div key={tool.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-secondary">{tool.name}</span>
                    <span className={`text-sm font-bold ${getStatusColor(tool.used, tool.limit)}`}>
                      {tool.used}/{tool.limit} used
                      {remaining > 0 && ` • ${remaining} left`}
                      {remaining === 0 && ' • Limit reached'}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(tool.used, tool.limit)} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-secondary">Total Daily Usage</span>
                <span className={`text-base font-black ${getStatusColor(totalUsed, totalLimit)}`}>
                  {totalUsed}/{totalLimit} analyses
                </span>
              </div>
              <div className="relative">
                <svg className="w-32 h-32 mx-auto" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={totalPercentage >= 100 ? 'text-error' : totalPercentage >= 66 ? 'text-amber-500' : 'text-success'}
                    strokeWidth="3"
                    strokeDasharray={`${totalPercentage}, 100`}
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text
                    x="18"
                    y="20.5"
                    className="text-secondary font-black"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {Math.round(totalPercentage)}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white">
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-xl font-black mb-2">Unlock Unlimited Access</h3>
            <p className="text-white/90 text-sm mb-6">
              Premium users get unlimited analyses, advanced features, and priority support.
            </p>

            <div className="space-y-2 mb-6">
              {[
                'Unlimited ATS analyses',
                'Unlimited JD matching',
                'Unlimited CV enhancements',
                'Export reports (PDF)',
                'Priority support',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-white font-bold">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/pricing"
              className="block w-full bg-white text-primary text-center px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors"
            >
              Upgrade to Premium - ₹499/month
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
