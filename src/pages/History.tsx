import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function History() {
  const { data, loading } = useDashboardData();

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalUsageToday = data.usageToday.atsAnalyzer.used + data.usageToday.jdMatch.used + data.usageToday.cvEnhancer.used;
  const totalLimit = data.usageToday.atsAnalyzer.limit + data.usageToday.jdMatch.limit + data.usageToday.cvEnhancer.limit;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        user={data.user}
        usageToday={data.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
      />

      <main className="flex-1 ml-60 p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-3xl lg:text-4xl font-black text-secondary">
              Analysis History
            </h1>
          </div>

          {data.recentActivity.length > 0 ? (
            <RecentActivity activities={data.recentActivity} />
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-gray-100 text-center">
              <Clock className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-secondary mb-3">
                No History Yet
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start analyzing your CV to build your history
              </p>
              <Link
                to="/features/ats-analyzer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Your First Analysis
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
