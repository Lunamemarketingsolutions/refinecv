import { useState } from 'react';
import { Wand2, Download, Eye, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { ATSAnalysis, ReformatProgress, ExtractedResumeData } from '../../types/ats';
import { reformatFromExtractedText } from '../../services/ats/resumeReformatService';
import { uploadResumeToStorage } from '../../services/ats/storageService';
import { saveResumeAnalysis } from '../../services/ats/resumeService';
import { analyzePDFForATS } from '../../services/ats/pdfProcessor';

interface ReformatResumeButtonProps {
  analysis: ATSAnalysis;
  currentFileName: string;
  onReformatComplete: (newFileUrl: string, newAnalysis: ATSAnalysis, fileName: string) => void;
}

export function ReformatResumeButton({
  analysis,
  currentFileName,
  onReformatComplete,
}: ReformatResumeButtonProps) {
  const { user } = useAuth();
  const [isReformatting, setIsReformatting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState<ReformatProgress | null>(null);
  const [reformattedPDF, setReformattedPDF] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const shouldShowButton = analysis.score < 60 || analysis.detailedScore?.tier === 'poor';

  const handleReformat = async () => {
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    if (!analysis.extractedText) {
      setError('No text content available to reformat');
      return;
    }

    setIsReformatting(true);
    setError(null);
    setProgress({ stage: 'extracting', percentage: 0, message: 'Starting reformat...' });

    try {
      const result = await reformatFromExtractedText(
        analysis.extractedText,
        currentFileName,
        user.id,
        (prog) => setProgress(prog)
      );

      setReformattedPDF(result.pdfBytes);

      const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reformat resume');
      setProgress(null);
      console.error('Reformat error:', err);
    } finally {
      setIsReformatting(false);
    }
  };

  const handleDownload = () => {
    if (!reformattedPDF) return;

    const blob = new Blob([reformattedPDF], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reformatted_${currentFileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveVersion = async () => {
    if (!reformattedPDF || !user) return;

    try {
      setProgress({ stage: 'generating', percentage: 95, message: 'Saving new version...' });

      const blob = new Blob([reformattedPDF], { type: 'application/pdf' });
      const reformattedFileName = `reformatted_${currentFileName}`;
      const file = new File([blob], reformattedFileName, { type: 'application/pdf' });

      const uploadResult = await uploadResumeToStorage(file, user.id);

      const newAnalysis = await analyzePDFForATS(file);

      // Create cv_upload record
      const { data: cvUpload, error: cvError } = await (await import('../../lib/supabase')).supabase
        .from('cv_uploads')
        .insert({
          user_id: user.id,
          file_name: reformattedFileName,
          file_path: uploadResult.path,
          file_size: file.size,
          extracted_text: newAnalysis.extractedText,
        })
        .select()
        .single();

      if (cvError || !cvUpload) {
        throw new Error(`Failed to create cv_upload: ${cvError?.message || 'Unknown error'}`);
      }

      await saveResumeAnalysis({
        fileName: reformattedFileName,
        fileSize: file.size,
        fileUrl: uploadResult.publicUrl,
        storagePath: uploadResult.path,
        analysis: newAnalysis,
        userId: user.id,
        cvUploadId: cvUpload.id
      });

      setShowPreview(false);
      setProgress(null);
      onReformatComplete(uploadResult.publicUrl, newAnalysis, reformattedFileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resume');
      console.error('Save error:', err);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Improve Your Resume with AI
            </h3>
            <p className="text-gray-600 mb-4">
              Your resume has an ATS score of {analysis.score}%. Let our AI reformat it using a proven template that scores 85%+ with ATS systems.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-line">
                {error}
              </div>
            )}
            {progress && !showPreview && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{progress.message}</span>
                  <span className="text-sm font-medium text-blue-600">{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleReformat}
              disabled={isReformatting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isReformatting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Reformatting...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Reformat with AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reformatted Resume Preview</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your resume has been optimized for ATS systems
                </p>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{analysis.score}%</div>
                      <div className="text-xs text-gray-500">Before</div>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">85%+</div>
                      <div className="text-xs text-gray-500">Expected</div>
                    </div>
                  </div>
                </div>
              </div>

              <iframe
                src={previewUrl}
                className="w-full h-[600px] border border-gray-300 rounded-lg"
                title="Reformatted Resume Preview"
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleClosePreview}
                className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handleSaveVersion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Eye className="w-5 h-5" />
                Save as New Version
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

