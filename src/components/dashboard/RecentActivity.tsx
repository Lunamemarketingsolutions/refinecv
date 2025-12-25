import { Link, useNavigate } from 'react-router-dom';

interface ActivityItem {
  id: string;
  cvName: string;
  toolUsed: 'ats_analyzer' | 'jd_matcher' | 'cv_enhancer';
  date: string;
  score: number | string;
  scoreType: 'ats' | 'match' | 'rating';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const navigate = useNavigate();

  const getToolBadge = (tool: string) => {
    const config = {
      ats_analyzer: {
        label: 'ATS Analyzer',
        bg: 'bg-primary',
      },
      jd_matcher: {
        label: 'JD Match',
        bg: 'bg-success',
      },
      cv_enhancer: {
        label: 'CV Enhancer',
        bg: 'bg-purple-600',
      },
    };

    const { label, bg } = config[tool as keyof typeof config] || config.ats_analyzer;

    return (
      <span className={`${bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {label}
      </span>
    );
  };

  const getScoreDisplay = (score: number | string, type: string) => {
    if (type === 'ats' || type === 'match') {
      const numScore = typeof score === 'number' ? score : parseInt(score);
      const color = numScore >= 80 ? 'text-success' : numScore >= 60 ? 'text-amber-600' : 'text-error';
      return (
        <span className={`${color} font-bold flex items-center gap-1`}>
          {numScore >= 80 && <span>✓</span>}
          {numScore}%{type === 'match' ? ' Match' : ''}
        </span>
      );
    }

    return (
      <span className="text-amber-600 font-bold">
        ★★★★☆ {score}/5
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (activities.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-black text-secondary mb-6">Recent Activity</h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-secondary mb-2">No activity yet</h3>
          <p className="text-gray-600 mb-6">
            Start analyzing your CV to see your activity here
          </p>
          <Link
            to="/ats-tool"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Your First Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black text-secondary mb-6">Recent Activity</h2>
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CV Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tool Used
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score/Result
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.slice(0, 5).map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-secondary">
                      {activity.cvName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getToolBadge(activity.toolUsed)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(activity.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {getScoreDisplay(activity.score, activity.scoreType)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (activity.toolUsed === 'ats_analyzer') {
                            navigate(`/ats-tool/results/${activity.id}`);
                          } else if (activity.toolUsed === 'jd_matcher') {
                            navigate(`/jd-match-tool/results/${activity.id}`);
                          } else if (activity.toolUsed === 'cv_enhancer') {
                            // Navigate to CV Enhancer
                            navigate('/cv-enhancer');
                          }
                        }}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        View Report
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => {
                          console.log('Downloading report for:', activity.id);
                        }}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-right">
          <Link to="/history" className="text-primary hover:underline text-sm font-semibold">
            View All History →
          </Link>
        </div>
      </div>
    </div>
  );
}
