import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { supabase } from '../../lib/supabase';
import { extractTextFromFile } from '../../utils/fileExtractor';

export default function EnhancerUpload() {
  const navigate = useNavigate();
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setCVFile(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleStartEnhancement = async () => {
    if (!cvFile) return;

    setUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please log in to continue');
        navigate('/login');
        return;
      }

      const extractionResult = await extractTextFromFile(cvFile);
      if (!extractionResult.success) {
        setError(extractionResult.error || 'Failed to extract text from file');
        setUploading(false);
        return;
      }

      const filePath = `${user.id}/${Date.now()}_${cvFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, cvFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        if (uploadError.message?.includes('row-level security')) {
          setError('Permission denied. Please ensure you are logged in.');
        } else if (uploadError.message?.includes('payload')) {
          setError('File too large. Maximum size is 5MB.');
        } else {
          setError('Failed to upload file to storage. Please try again.');
        }
        setUploading(false);
        return;
      }

      const { data: cvUpload, error: cvError } = await supabase
        .from('cv_uploads')
        .insert({
          user_id: user.id,
          file_name: cvFile.name,
          file_path: filePath,
          file_size: cvFile.size,
          extracted_text: extractionResult.text
        })
        .select()
        .maybeSingle();

      if (cvError) {
        console.error('Database insert error:', cvError);
        setError('Failed to save CV information. Please try again.');
        setUploading(false);
        return;
      }

      if (!cvUpload) {
        setError('Failed to create CV record. Please try again.');
        setUploading(false);
        return;
      }

      const { data: enhancement, error: enhancementError } = await supabase
        .from('cv_enhancements')
        .insert({
          user_id: user.id,
          cv_upload_id: cvUpload.id,
          original_text: extractionResult.text,
          status: 'analyzing'
        })
        .select()
        .maybeSingle();

      if (enhancementError) {
        console.error('Enhancement creation error:', enhancementError);
        setError('Failed to create enhancement record. Please try again.');
        setUploading(false);
        return;
      }

      if (!enhancement) {
        setError('Failed to create enhancement. Please try again.');
        setUploading(false);
        return;
      }

      navigate(`/cv-enhancer/analyzing/${enhancement.id}`);
    } catch (error) {
      console.error('Error uploading CV:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={{ name: 'User', plan: 'free' }} />

      <main className="flex-1 ml-60">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">
              <span className="hover:text-primary cursor-pointer">Dashboard</span>
              <span className="mx-2">&gt;</span>
              <span>Instant CV Enhancer</span>
            </p>

            <h1 className="text-4xl font-bold text-secondary mb-3 text-center">
              Instant CV Enhancer
            </h1>
            <p className="text-lg text-gray-600 text-center">
              Transform weak bullets into powerful, achievement-focused statements with AI
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div
              {...getRootProps()}
              className={`bg-white rounded-2xl p-12 border-2 border-dashed ${
                isDragActive ? 'border-purple-600 border-solid bg-purple-50' : 'border-purple-400'
              } transition-all hover:border-solid hover:scale-[1.02] cursor-pointer shadow-lg`}
            >
              <input {...getInputProps()} />

              {!cvFile ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary mb-2">
                    Upload Your CV to Enhance
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your CV here
                  </p>
                  <div className="text-gray-400 text-sm my-3">— OR —</div>
                  <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Browse Files
                  </button>
                  <p className="text-xs text-gray-500 italic mt-4">
                    PDF, DOCX (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-success" />
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-success font-semibold mb-1">{cvFile.name}</p>
                    <p className="text-gray-600 text-sm">
                      {Math.round(cvFile.size / 1024)}KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCVFile(null);
                    }}
                    className="text-error hover:text-error/80 text-sm font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm text-center">
                {error}
              </div>
            )}

            {cvFile && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleStartEnhancement}
                  disabled={uploading}
                  className="bg-purple-600 text-white px-12 py-4 rounded-lg text-lg font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {uploading ? 'Uploading...' : 'Start Enhancement →'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-secondary mb-6">
              How Instant CV Enhancer Works
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⭐</span>
                </div>
                <h4 className="font-medium text-secondary mb-2">1-5 Star Rating</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Each CV section gets rated. See exactly which sections need improvement.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">AI-Powered Suggestions</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get 3-5 enhanced versions with stronger verbs, metrics, and impact framing.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-medium text-secondary mb-2">Choose Best Version</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pick the one that sounds most authentic to you. Maintain your voice.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👁️</span>
                </div>
                <h4 className="font-medium text-secondary mb-2">See Changes Live</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Watch your CV transform in real-time with instant preview updates.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-600 text-sm">
              Analysis takes approximately 30 seconds | Enhancement: 15-30 min
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-medium text-primary">
                What CV Sections Get Enhanced?
              </span>
              {showExamples ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showExamples && (
              <div className="px-6 pb-6 grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Work Experience', icon: '💼', issues: 'Weak verbs → Action verbs, No metrics → Quantified impact' },
                  { title: 'Education', icon: '🎓', issues: 'Just degree → Add GPA, coursework, achievements' },
                  { title: 'Projects', icon: '📁', issues: 'Technical only → Add user impact, business context' },
                  { title: 'Skills', icon: '💻', issues: 'Simple list → Add proficiency levels, years of experience' },
                  { title: 'Leadership', icon: '👥', issues: 'Title only → Add team size, impact, outcomes' },
                  { title: 'Certifications', icon: '🏆', issues: 'Just listed → Add relevance, skills demonstrated' }
                ].map((section, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{section.icon}</span>
                      <h4 className="font-semibold text-secondary">{section.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{section.issues}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
