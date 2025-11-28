import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Target, List, CheckSquare, TrendingUp, X, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type JDInputMode = 'paste' | 'upload';

export default function JDMatchUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useDashboardData();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvUploadId, setCvUploadId] = useState<string | null>(null);

  const [jdMode, setJDMode] = useState<JDInputMode>('paste');
  const [jdText, setJDText] = useState('');
  const [jdFile, setJDFile] = useState<File | null>(null);
  const [jdUploading, setJDUploading] = useState(false);
  const [jdError, setJDError] = useState<string | null>(null);
  const [jdMetadata, setJDMetadata] = useState<any>(null);

  const [showExamples, setShowExamples] = useState(false);

  const onDropCV = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setCvError('File size must be under 5MB');
      return;
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setCvError('Only PDF and DOCX files are supported');
      return;
    }

    try {
      setCvUploading(true);
      setCvError(null);

      if (!user) {
        setCvError('Please log in to use this feature');
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

      setCvFile(file);
      setCvUploadId(cvUpload.id);
    } catch (err) {
      console.error('Upload error:', err);
      setCvError('Failed to upload file. Please try again.');
    } finally {
      setCvUploading(false);
    }
  }, [user]);

  const { getRootProps: getCVRootProps, getInputProps: getCVInputProps, isDragActive: isCVDragActive } = useDropzone({
    onDrop: onDropCV,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: cvUploading || !!cvFile,
  });

  const handleJDTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJDText(text);

    if (text.length >= 100) {
      const words = text.trim().split(/\s+/).length;
      setJDMetadata({
        wordCount: words,
        detectedRole: 'Product Management',
        detectedCompany: 'Google',
        requirements: 25,
      });
    } else {
      setJDMetadata(null);
    }
  };

  const onDropJD = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setJDError('File size must be under 10MB');
      return;
    }

    try {
      setJDUploading(true);
      setJDError(null);

      setJDFile(file);

      setTimeout(() => {
        const mockText = `Product Manager - Google\n\nWe're looking for a Product Manager to lead cross-functional teams...\n\nResponsibilities:\n- Define product roadmap based on user research\n- Lead cross-functional teams\n- Apply machine learning insights\n\nRequirements:\n- 2+ years experience in product development\n- Proficiency in Python, SQL\n- Strong stakeholder management skills`;

        setJDText(mockText);
        setJDMetadata({
          wordCount: 512,
          detectedRole: 'Product Management',
          detectedCompany: 'Google',
          requirements: 28,
          fileName: file.name,
        });
        setJDUploading(false);
      }, 2000);
    } catch (err) {
      console.error('JD upload error:', err);
      setJDError('Failed to process file. Please try again.');
      setJDUploading(false);
    }
  }, []);

  const { getRootProps: getJDRootProps, getInputProps: getJDInputProps, isDragActive: isJDDragActive } = useDropzone({
    onDrop: onDropJD,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: jdUploading || !!jdFile,
  });

  const handleModeSwitch = (newMode: JDInputMode) => {
    if ((jdMode === 'paste' && jdText) || (jdMode === 'upload' && jdFile)) {
      if (!confirm('Switching will clear current JD input. Continue?')) {
        return;
      }
    }
    setJDMode(newMode);
    setJDText('');
    setJDFile(null);
    setJDMetadata(null);
    setJDError(null);
  };

  const handleAnalyze = async () => {
    if (!cvUploadId || !jdText) return;

    try {
      const { data: matchData, error } = await supabase
        .from('jd_matches')
        .insert({
          user_id: user!.id,
          cv_upload_id: cvUploadId,
          jd_text: jdText,
          jd_source: jdMode === 'paste' ? 'paste' : jdFile?.type.includes('pdf') ? 'pdf' : jdFile?.type.includes('doc') ? 'docx' : jdFile?.type.includes('image') ? 'image' : 'txt',
          jd_metadata: jdMetadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/jd-match-tool/analyzing/${matchData.id}`);
    } catch (err) {
      console.error('Analysis creation error:', err);
      alert('Failed to start analysis. Please try again.');
    }
  };

  const canAnalyze = !!cvFile && !!jdText && jdText.length >= 100;
  const statusText = !cvFile ? 'Upload CV and add JD to begin analysis' :
                     !jdText ? 'Add job description to continue' :
                     jdText.length < 100 ? 'Job description too short (min 100 words)' :
                     '✓ Ready to analyze!';

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard" className="text-gray-600 text-sm hover:text-primary">
              Dashboard
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-secondary text-sm font-medium">JD CV Match Analyzer</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-secondary mb-3">
              JD CV Match Analyzer
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your CV and add any job description to see instant match analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              {...(cvFile ? {} : getCVRootProps())}
              className={`bg-white border-2 border-dashed rounded-2xl p-10 min-h-[350px] relative transition-all ${
                isCVDragActive ? 'border-primary bg-primary/5 border-solid' : 'border-primary'
              } ${cvFile ? 'border-solid' : 'hover:scale-[1.02] cursor-pointer'} ${cvUploading ? 'opacity-50' : ''}`}
            >
              {!cvFile && <input {...getCVInputProps()} />}

              <div className="absolute top-4 left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>

              {!cvFile ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    Upload Your CV
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {isCVDragActive ? 'Drop your CV here' : 'Drag and drop your CV here'}
                  </p>
                  <div className="text-gray-400 text-xs my-2">— OR —</div>
                  <button
                    type="button"
                    className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={cvUploading}
                  >
                    {cvUploading ? 'Uploading...' : 'Browse Files'}
                  </button>
                  <p className="text-gray-500 text-xs italic mt-3">
                    PDF, DOCX (Max 5MB)
                  </p>
                  {cvError && (
                    <div className="mt-4 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm w-full">
                      {cvError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-success" />
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-success font-semibold mb-1">✓ {cvFile.name}</p>
                    <p className="text-gray-600 text-sm">
                      {Math.round(cvFile.size / 1024)}KB | 2 pages
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCvFile(null);
                      setCvUploadId(null);
                    }}
                    className="text-error hover:text-error/80 text-sm font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-dashed border-success rounded-2xl p-10 min-h-[350px] relative">
              <div className="absolute top-4 left-4 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-12 h-12 text-success" />
                  <h3 className="text-lg font-semibold text-secondary">
                    Add Job Description
                  </h3>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleModeSwitch('paste')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      jdMode === 'paste'
                        ? 'bg-success text-white'
                        : 'bg-white text-gray-700 border border-success hover:bg-success/5'
                    }`}
                  >
                    Paste JD
                  </button>
                  <button
                    onClick={() => handleModeSwitch('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      jdMode === 'upload'
                        ? 'bg-success text-white'
                        : 'bg-white text-gray-700 border border-success hover:bg-success/5'
                    }`}
                  >
                    Upload JD File
                  </button>
                </div>

                {jdMode === 'paste' ? (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={jdText}
                      onChange={handleJDTextChange}
                      placeholder="Paste the complete job description here...

Example:
Product Manager - Google
Responsibilities:
- Define product roadmap...
- Conduct user research...

Requirements:
- 2+ years experience...
- Bachelor's in CS..."
                      className="flex-1 w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:border-success focus:outline-none focus:ring-2 focus:ring-success/20"
                      maxLength={10000}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500 italic">
                        Tip: Copy entire job posting from LinkedIn, Naukri, or company website
                      </p>
                      <span className="text-xs text-gray-500">
                        {jdText.length} / 10,000
                      </span>
                    </div>
                    {jdMetadata && (
                      <div className="mt-3 bg-success/10 border border-success/20 rounded-lg p-3 text-sm">
                        <p className="text-success font-medium mb-1">✓ Job description detected</p>
                        <p className="text-gray-700">{jdMetadata.wordCount} words | {jdMetadata.requirements} key requirements identified</p>
                        <p className="text-gray-700">Detected role: {jdMetadata.detectedRole}</p>
                        <p className="text-gray-700">Company: {jdMetadata.detectedCompany}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  !jdFile ? (
                    <div
                      {...getJDRootProps()}
                      className={`flex-1 border-2 border-dashed border-success rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isJDDragActive ? 'border-solid bg-success/5' : 'hover:border-solid hover:scale-[1.02]'
                      } ${jdUploading ? 'opacity-50' : ''}`}
                    >
                      <input {...getJDInputProps()} />
                      <Upload className="w-12 h-12 text-success mb-3" />
                      <p className="text-base font-semibold text-secondary mb-1">
                        {isJDDragActive ? 'Drop JD file here' : 'Drop JD file here'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">or click to browse</p>
                      <div className="text-gray-400 text-xs my-2">— OR —</div>
                      <button
                        type="button"
                        className="bg-success text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-success/90 transition-colors"
                      >
                        Browse Files
                      </button>
                      <p className="text-xs text-gray-500 italic mt-3">
                        PDF, DOCX, TXT, Images (JPG, PNG) - Max 10MB
                      </p>
                      <p className="text-xs text-gray-500 italic mt-1">
                        Tip: Upload JD as PDF, screenshot, or Word document
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-full bg-success/10 border border-success rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-success" />
                            <div>
                              <p className="font-semibold text-secondary">{jdFile.name}</p>
                              <p className="text-sm text-gray-600">2 pages | 512 words</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setJDFile(null);
                              setJDText('');
                              setJDMetadata(null);
                            }}
                            className="text-error hover:text-error/80"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      {jdMetadata && (
                        <div className="w-full bg-success/10 border border-success/20 rounded-lg p-3 text-sm">
                          <p className="text-success font-medium mb-1">✓ Job description extracted successfully</p>
                          <p className="text-gray-700">{jdMetadata.wordCount} words | {jdMetadata.requirements} key requirements identified</p>
                          <p className="text-gray-700">Detected role: {jdMetadata.detectedRole}</p>
                          <p className="text-gray-700">Company: {jdMetadata.detectedCompany}</p>
                        </div>
                      )}
                    </div>
                  )
                )}

                {jdError && (
                  <div className="mt-3 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
                    {jdError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`px-12 py-4 rounded-lg text-base font-bold transition-all ${
                canAnalyze
                  ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105 shadow-lg'
                  : 'bg-gray-400 text-white cursor-not-allowed opacity-50'
              }`}
            >
              Analyze CV-JD Match →
            </button>
            <p className={`mt-3 text-sm font-medium ${
              canAnalyze ? 'text-success' : jdText && jdText.length < 100 ? 'text-amber-600' : 'text-gray-600'
            }`}>
              {statusText}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-secondary mb-6">
              What the JD CV Match Analyzer Does
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Overall Match %</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Calculates how well your CV aligns with the JD based on keywords, skills, experience, and qualifications
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <List className="w-8 h-8 text-success" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Keyword Gaps</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Identifies which keywords from the JD are present, missing, or partially matched in your CV
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-medium text-secondary mb-2">What's Strong/Weak</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shows exactly what aspects of your CV match the role well and where improvements are needed
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckSquare className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-medium text-secondary mb-2">Tailoring Recommendations</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get specific, prioritized suggestions on which experiences to emphasize and keywords to add
                </p>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-600 text-sm">
              Analysis takes approximately 60 seconds
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-medium text-primary">
                See Example Match Scenarios
              </span>
              {showExamples ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {showExamples && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <div className="border-l-4 border-success bg-success/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-black text-success">87%</span>
                      <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded">Excellent Match</span>
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">Strong match for Product Management role</h4>
                    <p className="text-sm text-gray-600">
                      CV has 22/25 keywords, product experience matches JD requirements, education aligns perfectly. Minor tailoring needed.
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-500 bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-black text-amber-600">62%</span>
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Fair Match</span>
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">Fair match for Consulting role</h4>
                    <p className="text-sm text-gray-600">
                      CV has 15/25 keywords, missing 'structured problem-solving' language, needs case study examples. With tailoring: 85%+.
                    </p>
                  </div>
                  <div className="border-l-4 border-error bg-error/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-black text-error">43%</span>
                      <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded">Needs Work</span>
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">Weak match for Investment Banking role</h4>
                    <p className="text-sm text-gray-600">
                      CV has 8/25 keywords, no finance background mentioned, missing quantitative analysis skills. Significant tailoring required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
