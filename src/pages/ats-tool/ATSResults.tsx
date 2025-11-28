import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Share2, RefreshCw, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { supabase } from '../../lib/supabase';
import ScoreGauge from '../../components/ats-tool/ScoreGauge';
import CriticalIssues from '../../components/ats-tool/CriticalIssues';
import Warnings from '../../components/ats-tool/Warnings';
import PassedChecks from '../../components/ats-tool/PassedChecks';
import ATSSplitPanel from '../../components/ats-tool/ATSSplitPanel';
import SectionBreakdown from '../../components/ats-tool/SectionBreakdown';
import ActionPlan from '../../components/ats-tool/ActionPlan';
import DownloadOptions from '../../components/ats-tool/DownloadOptions';
import NextSteps from '../../components/ats-tool/NextSteps';

interface AnalysisResult {
  id: string;
  cv_upload_id: string;
  overall_score: number;
  critical_issues: any[];
  warnings: any[];
  passed_checks: string[];
  ats_text_extraction: string;
  section_scores: any;
  created_at: string;
  cv_name?: string;
  is_sample?: boolean;
}

export default function ATSResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { data: dashboardData } = useDashboardData();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (analysisId) {
      fetchAnalysisResults();
    }
  }, [analysisId]);

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ats_analyses')
        .select(`
          *,
          cv_uploads!ats_analyses_cv_upload_id_fkey (file_name)
        `)
        .eq('id', analysisId)
        .single();

      if (error) throw error;

      setAnalysis({
        ...data,
        cv_name: data.cv_uploads?.file_name || 'CV',
        is_sample: data.is_sample || false,
      });
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-error mb-4">{error || 'Analysis not found'}</p>
          <button
            onClick={() => navigate('/ats-tool')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const totalUsageToday = dashboardData.usageToday.atsAnalyzer.used + dashboardData.usageToday.jdMatch.used + dashboardData.usageToday.cvEnhancer.used;
  const totalLimit = dashboardData.usageToday.atsAnalyzer.limit + dashboardData.usageToday.jdMatch.limit + dashboardData.usageToday.cvEnhancer.limit;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        user={dashboardData.user}
        usageToday={dashboardData.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
      />

      <main className="flex-1 ml-60">
        {analysis.is_sample && (
          <div className="bg-blue-50 border-b-2 border-blue-200 px-8 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-900 font-semibold text-base">
                    Sample Results - Demo Mode
                  </p>
                  <p className="text-blue-700 text-sm">
                    This is a demo using sample data. Upload your own CV to get personalized results.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/ats-tool')}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Analyze My CV →
              </button>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <Link to="/ats-tool" className="text-gray-600 text-sm hover:text-primary">
                ATS Analyzer
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-secondary text-sm font-medium">Results</span>
              <div className="text-secondary font-semibold mt-1">
                {analysis.cv_name}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
              <button
                onClick={() => navigate('/ats-tool')}
                className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another CV
              </button>
              <button className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-10">
          <ScoreGauge
            score={analysis.overall_score}
            criticalCount={analysis.critical_issues.length}
            warningCount={analysis.warnings.length}
            passedCount={analysis.passed_checks.length}
          />

          <CriticalIssues issues={analysis.critical_issues} />

          <Warnings warnings={analysis.warnings} />

          <PassedChecks checks={analysis.passed_checks} />

          <ATSSplitPanel
            atsText={analysis.ats_text_extraction}
            cvName={analysis.cv_name || 'CV'}
          />

          <SectionBreakdown sections={analysis.section_scores} />

          <ActionPlan
            currentScore={analysis.overall_score}
            criticalIssues={analysis.critical_issues}
            warnings={analysis.warnings}
          />

          <DownloadOptions analysisId={analysis.id} cvName={analysis.cv_name || 'CV'} />

          <NextSteps />
        </div>
      </main>
    </div>
  );
}
