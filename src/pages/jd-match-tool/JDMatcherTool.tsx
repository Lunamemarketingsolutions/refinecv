import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import FileUpload from '../../components/jd-matcher-tool/FileUpload';
import AnalysisProgress from '../../components/jd-matcher-tool/AnalysisProgress';
import ResumeTailoring from '../../components/jd-matcher-tool/ResumeTailoring';
import ResumePreview from '../../components/jd-matcher-tool/ResumePreview';
import { analyzeResumeWithAI } from '../../services/jd-matcher/aiService';
import { saveJDMatchAnalysis, updateJDMatchAnalysis } from '../../services/jd-matcher/jdMatchService';
import type { ResumeData, Recommendation, JDMatchAnalysis } from '../../types/jdMatcher';

type ViewState = 'upload' | 'analyzing' | 'tailoring' | 'preview';

export default function JDMatcherTool() {
  const { user } = useAuth();
  const { data } = useDashboardData();
  const [view, setView] = useState<ViewState>('upload');
  const [cvText, setCvText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [cvUploadId, setCvUploadId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<JDMatchAnalysis | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  const handleFilesReady = useCallback(async (cv: string, jd: string) => {
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    setCvText(cv);
    setJdText(jd);
    setError(null);
    setView('analyzing');

    try {
      // Save CV upload to database if needed
      let uploadId = cvUploadId;
      if (!uploadId) {
        // Create a cv_upload record
        const { data: cvUpload, error: cvError } = await supabase
          .from('cv_uploads')
          .insert({
            user_id: user.id,
            session_id: user.id,
            file_name: 'resume.txt',
            file_path: '',
            file_size: cv.length,
            extracted_text: cv,
          })
          .select()
          .single();

        if (cvError) {
          console.error('CV upload error:', cvError);
          // Continue anyway, we can still analyze
        } else {
          uploadId = cvUpload.id;
          setCvUploadId(uploadId);
        }
      }

      // Analyze with AI
      const analysisResult = await analyzeResumeWithAI(cv, jd);
      setAnalysis(analysisResult);
      setResumeData(analysisResult.resumeData);
      setRecommendations(analysisResult.recommendations);

      // Save to database
      try {
        const savedMatch = await saveJDMatchAnalysis({
          userId: user.id,
          cvUploadId: uploadId,
          jdText: jd,
          jdSource: 'paste',
          jdMetadata: {},
          analysis: analysisResult,
        });
        setMatchId(savedMatch.id);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue anyway, user can still use the feature
      }

      // Move to tailoring view if there are recommendations
      if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
        setView('tailoring');
      } else {
        // No recommendations, go straight to preview
        setView('preview');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.');
      setView('upload');
    }
  }, [user, cvUploadId]);

  const handleTailoringComplete = useCallback(async (
    updatedData: ResumeData,
    appliedIds: string[]
  ) => {
    setResumeData(updatedData);

    // Update database with applied recommendations
    if (matchId && user) {
      try {
        await updateJDMatchAnalysis(matchId, user.id, {
          resumeData: updatedData,
          appliedRecommendations: appliedIds,
        });
      } catch (err) {
        console.error('Failed to update match:', err);
        // Continue anyway
      }
    }

    setView('preview');
  }, [matchId, user]);

  const handleBackToTailoring = useCallback(() => {
    setView('tailoring');
  }, []);

  if (!data) {
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

      <main className="flex-1 ml-60">
        {view === 'upload' && (
          <div className="p-8 lg:p-10">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary">
                  Dashboard
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-secondary text-sm font-semibold">JD CV Matcher</span>
              </div>

              {error && (
                <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4 text-error text-sm">
                  {error}
                </div>
              )}

              <FileUpload
                onFilesReady={handleFilesReady}
                onError={setError}
              />
            </div>
          </div>
        )}

        {view === 'analyzing' && (
          <AnalysisProgress message="Analyzing your resume and job description with AI..." />
        )}

        {view === 'tailoring' && analysis && resumeData && (
          <ResumeTailoring
            resumeData={resumeData}
            recommendations={recommendations}
            onComplete={handleTailoringComplete}
          />
        )}

        {view === 'preview' && resumeData && (
          <ResumePreview
            data={resumeData}
            onBack={recommendations.length > 0 ? handleBackToTailoring : undefined}
          />
        )}
      </main>
    </div>
  );
}

