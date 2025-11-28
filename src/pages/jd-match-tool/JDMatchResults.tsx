import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, RefreshCw, Bookmark, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { supabase } from '../../lib/supabase';
import MatchScoreGauge from '../../components/jd-match-tool/MatchScoreGauge';
import KeywordVennDiagram from '../../components/jd-match-tool/KeywordVennDiagram';
import MatchedKeywords from '../../components/jd-match-tool/MatchedKeywords';
import MissingKeywords from '../../components/jd-match-tool/MissingKeywords';
import PartialMatches from '../../components/jd-match-tool/PartialMatches';
import StrengthsSection from '../../components/jd-match-tool/StrengthsSection';
import WeaknessesSection from '../../components/jd-match-tool/WeaknessesSection';
import RoleFramingSection from '../../components/jd-match-tool/RoleFramingSection';
import ActionPlanSection from '../../components/jd-match-tool/ActionPlanSection';
import DownloadSection from '../../components/jd-match-tool/DownloadSection';
import NextStepsSection from '../../components/jd-match-tool/NextStepsSection';

interface MatchResult {
  id: string;
  cv_upload_id: string;
  jd_text: string;
  jd_source: string;
  jd_metadata: any;
  overall_score: number;
  matched_keywords: any[];
  partial_matches: any[];
  missing_keywords: any[];
  strengths: any[];
  weaknesses: any[];
  action_items: any;
  created_at: string;
  cv_name?: string;
  role?: string;
  company?: string;
}

export default function JDMatchResults() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { data: dashboardData } = useDashboardData();
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchResults();
    }
  }, [matchId]);

  const fetchMatchResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jd_matches')
        .select(`
          *,
          cv_uploads!jd_matches_cv_upload_id_fkey (file_name)
        `)
        .eq('id', matchId)
        .single();

      if (error) throw error;

      setMatch({
        ...data,
        cv_name: data.cv_uploads?.file_name || 'CV',
        role: data.jd_metadata?.detectedRole || 'Product Manager',
        company: data.jd_metadata?.detectedCompany || 'Google',
      });
    } catch (err) {
      console.error('Error fetching match:', err);
      setError('Failed to load match results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-success border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-error mb-4">{error || 'Match not found'}</p>
          <button
            onClick={() => navigate('/jd-match-tool')}
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
        <div className="sticky top-0 z-10 bg-white shadow-md border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <Link to="/jd-match-tool" className="text-gray-600 text-sm hover:text-primary">
                JD CV Match Analyzer
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-secondary text-sm font-medium">Results</span>
              <div className="text-secondary font-semibold mt-1">
                {match.cv_name} vs {match.company} - {match.role}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
              <button
                onClick={() => navigate('/jd-match-tool')}
                className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another Match
              </button>
              <button className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-10">
          <MatchScoreGauge
            score={match.overall_score}
            matchedCount={match.matched_keywords.length}
            partialCount={match.partial_matches.length}
            missingCount={match.missing_keywords.length}
          />

          <KeywordVennDiagram
            cvKeywords={32}
            jdKeywords={25}
            matchedKeywords={18}
          />

          <MatchedKeywords keywords={match.matched_keywords} />

          <MissingKeywords keywords={match.missing_keywords} />

          <PartialMatches matches={match.partial_matches} />

          <StrengthsSection strengths={match.strengths} />

          <WeaknessesSection weaknesses={match.weaknesses} />

          <RoleFramingSection />

          <ActionPlanSection
            currentScore={match.overall_score}
            actionItems={match.action_items}
            missingKeywords={match.missing_keywords}
            partialMatches={match.partial_matches}
          />

          <DownloadSection matchId={match.id} cvName={match.cv_name || 'CV'} />

          <NextStepsSection />
        </div>
      </main>
    </div>
  );
}
