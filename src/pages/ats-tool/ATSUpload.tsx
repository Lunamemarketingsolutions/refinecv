import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, User, Layout, List, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ATSUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useDashboardData();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Only PDF and DOCX files are supported');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      if (!user) {
        setError('Please log in to use this feature');
        return;
      }

      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: cvUpload, error: cvError } = await supabase
        .from('cv_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
        })
        .select()
        .single();

      if (cvError) throw cvError;

      navigate(`/ats-tool/analyzing/${cvUpload.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [user, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary">
              Dashboard
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-secondary text-sm font-medium">ATS Analyzer</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-secondary mb-3">
              ATS Analyzer
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your CV and see exactly what ATS systems read
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`max-w-2xl mx-auto bg-white border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all hover:scale-[1.02] hover:border-solid shadow-lg mb-8 ${
              isDragActive ? 'border-primary bg-primary/5 border-solid' : 'border-primary'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />

            <div className="mb-6">
              <Upload className="w-16 h-16 text-primary mx-auto" />
            </div>

            <h2 className="text-xl font-semibold text-secondary mb-2">
              {isDragActive ? 'Drop your CV here' : 'Drag and drop your CV here'}
            </h2>

            <div className="my-4 text-gray-400 text-sm font-medium">
              — OR —
            </div>

            <button
              type="button"
              className="bg-primary text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Browse Files'}
            </button>

            <p className="text-gray-500 text-xs italic mt-4">
              Supported formats: PDF, DOCX (Max 5MB)
            </p>

            {error && (
              <div className="mt-4 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
              <span>🔍</span> What the ATS Analyzer Checks
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Contact Parsing</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Checks if ATS can read your name, email, phone, LinkedIn from header/footer or body
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layout className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Format Compatibility</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Detects tables, graphics, special fonts, and headers/footers that break ATS parsing
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <List className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Section Detection</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Verifies ATS can identify Work Experience, Education, Skills, and other key sections
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm flex items-center justify-center gap-2">
              <span>⏱️</span>
              <span>Analysis takes approximately 45 seconds</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowSample(!showSample)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-medium text-primary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                See Sample ATS Report
              </span>
              {showSample ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showSample && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="mt-4 bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <FileText className="w-20 h-20 mx-auto mb-3 opacity-50" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Example: ATS analysis showing overall score, critical issues, and recommendations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
