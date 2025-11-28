import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import Sidebar from '../components/dashboard/Sidebar';
import QuickStats from '../components/dashboard/QuickStats';
import FeatureCards from '../components/dashboard/FeatureCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import UsageStatistics from '../components/dashboard/UsageStatistics';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data, loading: dataLoading, error } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-error mb-4">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalUsageToday = data.usageToday.atsAnalyzer.used + data.usageToday.jdMatch.used + data.usageToday.cvEnhancer.used;
  const totalLimit = data.usageToday.atsAnalyzer.limit + data.usageToday.jdMatch.limit + data.usageToday.cvEnhancer.limit;

  const firstName = data.user.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        user={data.user}
        usageToday={data.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
      />

      <main className="flex-1 ml-60 p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-2">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your CVs today
            </p>
          </div>

          <QuickStats stats={data.stats} />

          <FeatureCards featureUsage={data.featureUsage} />

          <RecentActivity activities={data.recentActivity} />

          {data.user.plan === 'free' && (
            <UsageStatistics usageToday={data.usageToday} />
          )}
        </div>
      </main>
    </div>
  );
}
