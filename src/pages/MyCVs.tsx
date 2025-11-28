import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';

export default function MyCVs() {
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

          <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-8">
            My CVs
          </h1>

          <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-gray-100 text-center">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-secondary mb-3">
              CV Library Coming Soon
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Manage all your CVs in one place. View, download, and track different versions.
            </p>
            <Link
              to="/features/ats-analyzer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Upload a CV to Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
