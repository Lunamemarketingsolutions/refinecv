import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import HowItWorksSection from './HowItWorksSection';
import SectionsEnhanced from './SectionsEnhanced';

interface CVUploadSectionProps {
  onUploadComplete: (file: File) => void;
  onAnalyze: (file: File) => void;
}

export default function CVUploadSection({ onUploadComplete, onAnalyze }: CVUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    
    // Validate file type (check both MIME type and file extension)
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    // Get file extension as fallback (some browsers don't set MIME type correctly)
    const fileName = selectedFile.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const validExtensions = ['.pdf', '.docx', '.txt'];
    
    // Check if file type is valid (either by MIME type or extension)
    const isValidType = validTypes.includes(selectedFile.type) || 
                       validExtensions.includes(fileExtension) ||
                       (selectedFile.type === '' && fileExtension === '.pdf'); // Handle empty MIME type for PDFs
    
    if (!isValidType) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    setFile(selectedFile);
    onUploadComplete(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      await onAnalyze(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze CV');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FE] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0F1C2A] mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
            Upload Your CV
          </h1>
          <p className="text-lg text-gray-600">
            Upload PDF or Word resumes. We'll parse and organize your CV into editable sections.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-[#2782EA] bg-blue-50'
              : 'border-gray-300 bg-white hover:border-[#2782EA] hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-[#2782EA]" />
          <p className="text-xl font-semibold text-[#0F1C2A] mb-2">
            Drag and drop your CV here
          </p>
          <p className="text-gray-500 mb-6">or</p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="bg-[#2782EA] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#1e6bc7] transition-colors inline-block">
              Browse Files
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: PDF, DOCX, TXT (Max 10MB)
          </p>
        </div>

        {file && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-[#2782EA]" />
              <div className="flex-1">
                <p className="font-semibold text-[#0F1C2A]">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {file && !error && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="bg-[#2782EA] text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e6bc7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Analyze & Improvise CV'
              )}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          Your data is secure. We do not store resumes beyond your editing session.
        </p>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Sections Enhanced Section */}
        <SectionsEnhanced />
      </div>
    </div>
  );
}

