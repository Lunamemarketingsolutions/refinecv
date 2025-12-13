import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Share2, RefreshCw, ArrowLeft, Eye, History } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import PDFViewer from '../../components/ats-tool/PDFViewer';
import ResumeHistory from '../../components/ats-tool/ResumeHistory';
import type { ATSAnalysis, ATSSuggestion } from '../../types/ats';
import { getSuggestionsForResume, updateSuggestionStatus } from '../../services/ats/aiSuggestionService';
import { applySuggestionEdit } from '../../services/ats/editWorkflowService';
import { getResumeById, updateResumeAnalysis } from '../../services/ats/resumeService';
import { analyzePDFForATS } from '../../services/ats/pdfProcessor';

interface AnalysisResult {
  id: string;
  cv_upload_id: string;
  overall_score: number;
  critical_issues: any[];
  warnings: any[];
  passed_checks: string[];
  ats_text_extraction: string;
  section_scores: any;
  detected_sections: any;
  created_at: string;
  cv_name?: string;
  file_url?: string;
  is_sample?: boolean;
}

export default function ATSResults() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboardData } = useDashboardData();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ATSSuggestion[]>([]);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (analysisId && user) {
      fetchAnalysisResults();
    }
  }, [analysisId, user]);

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ats_analyses')
        .select(`
          *,
          cv_uploads!ats_analyses_cv_upload_id_fkey (
            file_name,
            file_path,
            file_size
          )
        `)
        .eq('id', analysisId)
        .single();

      if (error) throw error;

      const cvUpload = data.cv_uploads;
      const fileUrl = supabase.storage
        .from('cv-uploads')
        .getPublicUrl(cvUpload.file_path).data.publicUrl;

      setFileUrl(fileUrl);
      setAnalysis({
        ...data,
        cv_name: cvUpload?.file_name || 'CV',
        file_url: fileUrl,
        is_sample: data.is_sample || false,
      });

      // Convert database analysis to ATSAnalysis type
      const atsAnalysisData: ATSAnalysis = {
        score: data.overall_score,
        issues: [
          ...(data.critical_issues || []),
          ...(data.warnings || []),
        ],
        recommendations: [],
        extractedText: data.ats_text_extraction || '',
        sections: {},
        detectedSections: data.detected_sections || [],
        stats: {
          wordCount: 0,
          characterCount: data.ats_text_extraction?.length || 0,
          pageCount: 1,
        },
      };

      setAtsAnalysis(atsAnalysisData);

      // Load suggestions
      if (data.cv_upload_id && user) {
        const resumeSuggestions = await getSuggestionsForResume(data.cv_upload_id, user.id);
        setSuggestions(resumeSuggestions);
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    if (!user || !analysis || !fileUrl) {
      setError('Cannot apply suggestion: Missing required data');
      return;
    }

    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      setError('Suggestion not found');
      return;
    }

    setIsApplyingEdit(true);
    setError(null);

    try {
      const result = await applySuggestionEdit(
        suggestion,
        fileUrl,
        analysis.cv_upload_id,
        user.id
      );

      if (result.success) {
        // Remove the applied suggestion from the UI
        setSuggestions(prevSuggestions =>
          prevSuggestions.filter(s => s.id !== suggestionId)
        );

        // Update analysis if new one provided
        if (result.newFileUrl && result.newAnalysis) {
          setFileUrl(result.newFileUrl);
          setAtsAnalysis(result.newAnalysis);

          // Update database
          await updateResumeAnalysis(analysis.cv_upload_id, user.id, result.newAnalysis);

          // Generate new suggestions for any remaining issues
          if (result.newAnalysis.detectedSections && result.newAnalysis.detectedSections.length > 0) {
            const { generateAllSuggestions } = await import('../../services/ats/aiSuggestionService');
            const newSuggestions = await generateAllSuggestions(
              result.newAnalysis.detectedSections,
              analysis.cv_upload_id,
              user.id
            );

            // Only add truly new suggestions
            if (newSuggestions.length > 0) {
              setSuggestions(prevSuggestions => {
                const existingIds = new Set(prevSuggestions.map(s => s.id));
                const filteredNew = newSuggestions.filter(s => !existingIds.has(s.id));
                return [...prevSuggestions, ...filteredNew];
              });
            }
          }
        }
      } else {
        setError(result.error || 'Failed to apply suggestion');
      }
    } catch (err) {
      console.error('Error applying suggestion:', err);
      setError('An unexpected error occurred while applying the suggestion');
    } finally {
      setIsApplyingEdit(false);
    }
  };

  const handleDismissSuggestion = async (suggestionId: string) => {
    if (!user) return;
    await updateSuggestionStatus(suggestionId, user.id, 'rejected');
    setSuggestions(prevSuggestions =>
      prevSuggestions.filter(s => s.id !== suggestionId)
    );
  };

  const handleReformatComplete = async (newFileUrl: string, newAnalysis: ATSAnalysis, fileName: string) => {
    if (!user || !analysis) return;

    setFileUrl(newFileUrl);
    setAtsAnalysis(newAnalysis);
    await updateResumeAnalysis(analysis.cv_upload_id, user.id, newAnalysis);
  };

  const handleResumeSelect = async (resume: any) => {
    setShowHistory(false);
    // Navigate to the selected resume's analysis
    if (resume.analysis) {
      navigate(`/ats-tool/results/${resume.analysis.id}`);
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

  if (error && !analysis) {
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

  if (!dashboardData || !analysis || !atsAnalysis) return null;

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
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <History className="w-4 h-4" />
                History
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

        <div className="max-w-7xl mx-auto px-8 py-10">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {fileUrl && atsAnalysis && (
            <PDFViewer
              fileUrl={fileUrl}
              analysis={atsAnalysis}
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={handleDismissSuggestion}
              isApplyingEdit={isApplyingEdit}
              onReformatComplete={handleReformatComplete}
              currentFileName={analysis.cv_name || 'resume.pdf'}
            />
          )}
        </div>
      </main>

      {showHistory && user && (
        <ResumeHistory
          onResumeSelect={handleResumeSelect}
          onClose={() => setShowHistory(false)}
          userId={user.id}
        />
      )}
    </div>
  );
}
