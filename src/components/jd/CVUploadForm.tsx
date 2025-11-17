import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadCV, analyzeCV } from '../../services/cvAnalysisService';
import { CVAnalysis } from '../../lib/supabase';

interface CVUploadFormProps {
  onAnalysisComplete: (analysis: CVAnalysis) => void;
}

export default function CVUploadForm({ onAnalysisComplete }: CVUploadFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      setError('Please upload your CV');
      return;
    }

    if (!jdText.trim()) {
      setError('Please paste the job description');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const uploadResult = await uploadCV(cvFile);

      if (!uploadResult.success || !uploadResult.data) {
        setError(uploadResult.error || 'Failed to upload CV');
        setIsProcessing(false);
        return;
      }

      const cvText = uploadResult.data.extracted_text || '';

      const analysisResult = await analyzeCV(cvText, jdText, uploadResult.data.id);

      if (!analysisResult.success || !analysisResult.data) {
        setError(analysisResult.error || 'Failed to analyze CV');
        setIsProcessing(false);
        return;
      }

      onAnalysisComplete(analysisResult.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
      <h3 className="text-2xl font-black text-secondary mb-6">Upload Your CV & Paste Job Description</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-secondary mb-3">
            1. Upload Your CV (PDF)
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : cvFile
                ? 'border-success bg-success/5'
                : 'border-gray-300 hover:border-primary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="cv-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            {cvFile ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div className="text-left">
                  <p className="font-semibold text-secondary">{cvFile.name}</p>
                  <p className="text-sm text-gray-600">{(cvFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-secondary font-semibold mb-1">Drop your CV here or click to browse</p>
                <p className="text-sm text-gray-600">PDF format, max 10MB</p>
              </div>
            )}
          </div>
          {cvFile && (
            <button
              onClick={() => setCvFile(null)}
              className="mt-2 text-sm text-error hover:underline"
              disabled={isProcessing}
            >
              Remove file
            </button>
          )}
        </div>

        <div>
          <label htmlFor="jd-text" className="block text-sm font-semibold text-secondary mb-3">
            2. Paste Job Description
          </label>
          <textarea
            id="jd-text"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the complete job description here..."
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none resize-none"
            disabled={isProcessing}
          />
          <p className="mt-2 text-sm text-gray-600">
            {jdText.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isProcessing || !cvFile || !jdText.trim()}
          className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing Your CV...
            </>
          ) : (
            <>
              <FileText className="w-6 h-6" />
              Analyze Match Score
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Analysis takes 5-10 seconds • Your data is secure and private
        </p>
      </div>
    </div>
  );
}
