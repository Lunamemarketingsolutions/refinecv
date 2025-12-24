import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { extractTextFromFile } from '../../utils/fileExtractor';
import type { ExtractionResult } from '../../utils/fileExtractor';

interface FileUploadProps {
  onFilesReady: (cvText: string, jdText: string) => void;
  onError: (error: string) => void;
}

export default function FileUpload({ onFilesReady, onError }: FileUploadProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [cvExtracting, setCvExtracting] = useState(false);
  
  const [jdText, setJdText] = useState('');

  const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvExtracting(true);
      
      try {
        const result: ExtractionResult = await extractTextFromFile(file);
        if (result.success && result.text) {
          setCvText(result.text);
        } else {
          onError(result.error || 'Failed to extract text from CV file');
          setCvFile(null);
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to process CV file');
        setCvFile(null);
      } finally {
        setCvExtracting(false);
      }
    }
  };

  const handleAnalyze = () => {
    if (!cvText) {
      onError('Please upload a CV file');
      return;
    }
    if (!jdText || jdText.trim().length < 50) {
      onError('Please provide a job description (minimum 50 characters)');
      return;
    }
    onFilesReady(cvText, jdText);
  };

  const canAnalyze = cvText.length > 0 && jdText.trim().length >= 50;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-secondary mb-2">
          JD CV Matcher
        </h2>
        <p className="text-gray-600">
          Upload your CV and job description to get AI-powered tailoring recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CV Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-secondary">
            Resume File
          </label>
          <div className={`
            relative border-2 border-dashed rounded-xl p-6 transition-all text-center
            ${cvFile ? 'border-success bg-success/5' : 'border-primary hover:border-primary/70 hover:bg-primary/5'}
            ${cvExtracting ? 'opacity-50' : ''}
          `}>
            <input
              type="file"
              onChange={handleCVFileChange}
              accept=".pdf,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={cvExtracting}
            />

            {cvFile ? (
              <div className="flex flex-col items-center text-success">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm truncate max-w-full px-4">
                  {cvFile.name}
                </span>
                <span className="text-xs opacity-75 mt-1">
                  Click to change
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                {cvExtracting ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                    <span className="font-medium text-sm">Extracting text...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="font-medium text-sm">
                      Upload Resume
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF or DOCX
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* JD Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-secondary">
              Job Description
            </label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-32 p-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm placeholder:text-gray-400"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{jdText.length} characters</span>
              <span>Minimum 50 characters</span>
            </div>
          </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || cvExtracting}
          className={`
            px-8 py-3 rounded-lg font-bold text-white transition-all
            flex items-center justify-center gap-2 mx-auto
            ${canAnalyze && !cvExtracting
              ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          <FileText className="w-5 h-5" />
          Analyze CV-JD Match
        </button>
        {!canAnalyze && (
          <p className="mt-2 text-sm text-gray-500">
            {!cvText ? 'Upload a CV file' : 'Add a job description (min 50 characters)'}
          </p>
        )}
      </div>
    </div>
  );
}

