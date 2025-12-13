import { useState } from 'react';
import { FileCheck2, Loader2, History, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import FileUpload from '../../components/ats-tool/FileUpload';
import PDFViewer from '../../components/ats-tool/PDFViewer';
import InfoSection from '../../components/ats-tool/InfoSection';
import ResumeHistory from '../../components/ats-tool/ResumeHistory';
import { analyzePDFForATS } from '../../services/ats/pdfProcessor';
import { uploadResumeToStorage } from '../../services/ats/storageService';
import { saveResumeAnalysis, getAllResumes, type StoredResume } from '../../services/ats/resumeService';
import { generateAllSuggestions, getSuggestionsForResume, updateSuggestionStatus } from '../../services/ats/aiSuggestionService';
import { applySuggestionEdit } from '../../services/ats/editWorkflowService';
import type { ATSAnalysis, ATSSuggestion } from '../../types/ats';

interface UploadProgress {
  stage: 'analyzing' | 'uploading' | 'saving' | 'complete';
  percentage: number;
  message: string;
}

export default function ATSTool() {
  const { user } = useAuth();
  const { data } = useDashboardData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [savedCvUploadId, setSavedCvUploadId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ATSSuggestion[]>([]);
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFileUrl(null);
    setIsAnalyzing(true);
    setSavedCvUploadId(null);
    setSuggestions([]);

    try {
      setUploadProgress({ stage: 'analyzing', percentage: 25, message: 'Analyzing PDF...' });
      const result = await analyzePDFForATS(file);
      setAnalysis(result);

      try {
        setUploadProgress({ stage: 'uploading', percentage: 50, message: 'Uploading to storage...' });
        const uploadResult = await uploadResumeToStorage(file, user.id);

        setUploadProgress({ stage: 'saving', percentage: 75, message: 'Saving to database...' });
        const savedResume = await saveResumeAnalysis({
          fileName: file.name,
          fileSize: file.size,
          fileUrl: uploadResult.publicUrl,
          storagePath: uploadResult.path,
          analysis: result,
          userId: user.id
        });

        setFileUrl(uploadResult.publicUrl);
        setSavedCvUploadId(savedResume.cvUpload.id);
        setUploadProgress({ stage: 'complete', percentage: 100, message: 'Resume saved successfully!' });

        if (result.detectedSections && result.detectedSections.length > 0) {
          const generatedSuggestions = await generateAllSuggestions(
            result.detectedSections,
            savedResume.cvUpload.id,
            user.id
          );
          setSuggestions(generatedSuggestions);
        }

        setTimeout(() => setUploadProgress(null), 3000);
      } catch (storageErr) {
        console.error('Storage/Database error:', storageErr);
        setUploadProgress(null);
        setError('Resume analyzed successfully, but failed to save to database. You can still view the results below.');
      }
    } catch (err) {
      setError('Failed to analyze PDF. Please make sure it\'s a valid PDF file.');
      setUploadProgress(null);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileUrl(null);
    setAnalysis(null);
    setError(null);
    setUploadProgress(null);
    setSavedCvUploadId(null);
    setSuggestions([]);
  };

  const handleReformatComplete = (newFileUrl: string, newAnalysis: ATSAnalysis, fileName: string) => {
    setSelectedFile(null);
    setFileUrl(newFileUrl);
    setAnalysis(newAnalysis);
    setUploadProgress({
      stage: 'complete',
      percentage: 100,
      message: 'Resume reformatted and saved successfully!'
    });
    setTimeout(() => setUploadProgress(null), 3000);
  };

  const handleResumeSelect = async (resume: StoredResume) => {
    if (!user) return;

    setShowHistory(false);
    setSelectedFile(null);
    
    const fileUrl = resume.cvUpload.file_path 
      ? (await import('../../lib/supabase')).supabase.storage
          .from('cv-uploads')
          .getPublicUrl(resume.cvUpload.file_path).data.publicUrl
      : null;
    
    setFileUrl(fileUrl);
    setSavedCvUploadId(resume.cvUpload.id);

    if (resume.analysis) {
      const analysis: ATSAnalysis = {
        score: resume.analysis.overall_score || 0,
        issues: [
          ...(resume.analysis.critical_issues || []),
          ...(resume.analysis.warnings || [])
        ],
        recommendations: resume.analysis.passed_checks || [],
        extractedText: resume.analysis.ats_text_extraction || '',
        detectedSections: resume.analysis.detected_sections || [],
        stats: {
          wordCount: resume.analysis.word_count || 0,
          characterCount: resume.analysis.character_count || 0,
          pageCount: resume.analysis.page_count || 1
        },
        detailedScore: undefined
      };
      setAnalysis(analysis);
    }

    const existingSuggestions = await getSuggestionsForResume(resume.cvUpload.id, user.id);
    setSuggestions(existingSuggestions);
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    if (!savedCvUploadId || !fileUrl || !user) {
      setError('Cannot apply suggestion: No saved resume found');
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
      const result = await applySuggestionEdit(suggestion, fileUrl, savedCvUploadId, user.id);

      if (result.success) {
        // Remove the applied suggestion from the UI
        setSuggestions(prevSuggestions =>
          prevSuggestions.filter(s => s.id !== suggestionId)
        );

        // Check if we have a new analysis (we won't for image-based resumes)
        if (result.newFileUrl && result.newAnalysis) {
          setFileUrl(result.newFileUrl);
          setAnalysis(result.newAnalysis);

          // Generate new suggestions for any remaining issues
          if (result.newAnalysis.detectedSections) {
            const newSuggestions = await generateAllSuggestions(
              result.newAnalysis.detectedSections,
              savedCvUploadId,
              user.id
            );

            // Only add truly new suggestions (not duplicates of what we already have)
            if (newSuggestions.length > 0) {
              setSuggestions(prevSuggestions => {
                const existingIds = new Set(prevSuggestions.map(s => s.id));
                const filteredNew = newSuggestions.filter(s => !existingIds.has(s.id));
                return [...prevSuggestions, ...filteredNew];
              });
            }
          }

          setUploadProgress({
            stage: 'complete',
            percentage: 100,
            message: 'Suggestion applied successfully! Your resume has been updated.'
          });
        } else {
          // Image-based resume - just show the template in the suggestion
          setUploadProgress({
            stage: 'complete',
            percentage: 100,
            message: 'Template displayed! For image-based resumes, manually recreate your resume using the ATS-friendly template shown above.'
          });
        }

        setTimeout(() => setUploadProgress(null), 5000);
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

      <main className="flex-1 ml-60 p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary">
              Dashboard
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-secondary text-sm font-medium">ATS Analyzer</span>
          </div>

          <header className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <FileCheck2 className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-black text-secondary">ATS Resume Viewer</h1>
            </div>
            <p className="text-lg text-gray-600">
              See how Applicant Tracking Systems read your resume
            </p>
            {user && (
              <button
                onClick={() => setShowHistory(true)}
                className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <History className="w-4 h-4" />
                <span>View History</span>
              </button>
            )}
          </header>

          <InfoSection />

          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                {uploadProgress.stage === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-blue-900 font-medium">{uploadProgress.message}</p>
                  <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your resume...</p>
              </div>
            </div>
          )}

          {analysis && (selectedFile || fileUrl) && !isAnalyzing && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <PDFViewer
                file={selectedFile || undefined}
                fileUrl={fileUrl || undefined}
                analysis={analysis}
                suggestions={suggestions}
                onApplySuggestion={handleApplySuggestion}
                onDismissSuggestion={handleDismissSuggestion}
                isApplyingEdit={isApplyingEdit}
                onReformatComplete={handleReformatComplete}
                currentFileName={selectedFile?.name || 'resume.pdf'}
              />
            </div>
          )}

          {showHistory && user && (
            <ResumeHistory
              onResumeSelect={handleResumeSelect}
              onClose={() => setShowHistory(false)}
              userId={user.id}
            />
          )}
        </div>
      </main>
    </div>
  );
}

