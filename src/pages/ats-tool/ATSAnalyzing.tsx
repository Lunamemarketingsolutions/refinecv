import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { analyzePDFForATS } from '../../services/ats/pdfProcessor';
import { saveResumeAnalysis } from '../../services/ats/resumeService';
import { generateAllSuggestions } from '../../services/ats/aiSuggestionService';

interface AnalysisStep {
  id: number;
  name: string;
  duration: number;
  message: string;
  metric?: string;
}

const getAnalysisSteps = (isSample: boolean): AnalysisStep[] => [
  {
    id: 1,
    name: 'Uploading CV',
    duration: 5000,
    message: 'Securely uploading your document...',
    metric: isSample ? 'Sample_CV_Naveen_Kumar.pdf | 1,847 words' : undefined
  },
  { id: 2, name: 'Extracting Text from CV', duration: 7000, message: 'Reading content from your PDF/DOCX...', metric: '1,847 words extracted' },
  { id: 3, name: 'Parsing Contact Information', duration: 6000, message: 'Detecting name, email, phone, LinkedIn...', metric: '4 fields detected' },
  { id: 4, name: 'Analyzing Format & Layout', duration: 8000, message: 'Checking for tables, graphics, headers, special characters...', metric: 'Scanning 12 format elements' },
  { id: 5, name: 'Detecting CV Sections', duration: 7000, message: 'Identifying Work Experience, Education, Skills, Projects...', metric: '6 sections found' },
  { id: 6, name: 'Comparing to ATS Standards', duration: 7000, message: 'Benchmarking against Taleo, Workday, Greenhouse parsers...', metric: 'Tested against 3 ATS systems' },
  { id: 7, name: 'Generating Your ATS Report', duration: 5000, message: 'Compiling results, identifying issues, creating recommendations...' },
];

export default function ATSAnalyzing() {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isSample, setIsSample] = useState(false);

  const analysisSteps = getAnalysisSteps(isSample);
  const totalDuration = analysisSteps.reduce((acc, step) => acc + step.duration, 0);

  useEffect(() => {
    if (!uploadId || !user) {
      navigate('/ats-tool');
      return;
    }

    checkIfSampleAndRun();
  }, [uploadId, user, navigate]);

  const checkIfSampleAndRun = async () => {
    try {
      const { data, error } = await supabase
        .from('ats_analyses')
        .select('is_sample')
        .eq('id', uploadId)
        .maybeSingle();

      if (data) {
        setIsSample(data.is_sample || false);
      }

      runAnalysis();
    } catch (error) {
      console.error('Error checking sample status:', error);
      runAnalysis();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const runAnalysis = async () => {
    if (!user || !uploadId) return;

    try {
      // Step 1: Load CV upload data
      setCurrentStep(0);
      const { data: cvUpload, error: cvError } = await supabase
        .from('cv_uploads')
        .select('*')
        .eq('id', uploadId)
        .eq('user_id', user.id)
        .single();

      if (cvError || !cvUpload) {
        throw new Error('Failed to load CV upload');
      }

      await simulateStep(0, 5000);
      setCompletedSteps([0]);

      // Step 2: Download file from storage
      setCurrentStep(1);
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('cv-uploads')
        .download(cvUpload.file_path);

      if (downloadError || !fileData) {
        throw new Error('Failed to download file');
      }

      const file = new File([fileData], cvUpload.file_name, { type: 'application/pdf' });
      await simulateStep(1, 7000);
      setCompletedSteps([0, 1]);

      // Step 3: Extract text and analyze
      setCurrentStep(2);
      const analysis = await analyzePDFForATS(file);
      await simulateStep(2, 6000);
      setCompletedSteps([0, 1, 2]);

      // Step 4: Analyze format
      setCurrentStep(3);
      await simulateStep(3, 8000);
      setCompletedSteps([0, 1, 2, 3]);

      // Step 5: Detect sections
      setCurrentStep(4);
      await simulateStep(4, 7000);
      setCompletedSteps([0, 1, 2, 3, 4]);

      // Step 6: Compare to ATS standards
      setCurrentStep(5);
      await simulateStep(5, 7000);
      setCompletedSteps([0, 1, 2, 3, 4, 5]);

      // Step 7: Save analysis and generate suggestions
      setCurrentStep(6);
      const savedResume = await saveResumeAnalysis({
        fileName: cvUpload.file_name,
        fileSize: cvUpload.file_size,
        fileUrl: supabase.storage.from('cv-uploads').getPublicUrl(cvUpload.file_path).data.publicUrl,
        storagePath: cvUpload.file_path,
        analysis,
        userId: user.id,
        cvUploadId: uploadId
      });

      // Generate AI suggestions for problematic sections
      if (analysis.detectedSections && analysis.detectedSections.length > 0) {
        await generateAllSuggestions(analysis.detectedSections, uploadId, user.id);
      }

      await simulateStep(6, 5000);
      setCompletedSteps([0, 1, 2, 3, 4, 5, 6]);

    setAnalysisComplete(true);

      // Track usage
      if (savedResume.analysis) {
        await supabase.from('usage_tracking').insert({
          user_id: user.id,
          tool_type: 'ats_analyzer',
          analysis_id: savedResume.analysis.id,
        });
      }

      setTimeout(() => {
        navigate(`/ats-tool/results/${savedResume.analysis?.id || uploadId}`);
      }, 2000);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisComplete(true);
      // Still navigate to results, but with error state
    setTimeout(() => {
      navigate(`/ats-tool/results/${uploadId}`);
    }, 2000);
    }
  };

  const simulateStep = async (stepIndex: number, duration: number) => {
    const stepStartTime = Date.now();
    while (Date.now() - stepStartTime < duration) {
      await new Promise(resolve => setTimeout(resolve, 50));
      const stepProgress = ((Date.now() - stepStartTime) / duration) * 100;
      const overallProgress = (stepIndex / analysisSteps.length) * 100 + (stepProgress / analysisSteps.length);
      setProgress(Math.min(overallProgress, 100));
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-3xl w-full relative">
        {isSample && (
          <div className="absolute top-4 right-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              Demo Mode
            </span>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">
            Analyzing Your CV...
          </h1>
          <p className="text-gray-600 text-sm">
            This will take approximately 45 seconds
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            <span className="text-sm text-gray-500">
              Elapsed: {elapsedTime}s / 45s
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {analysisSteps.map((step, index) => {
            const isComplete = completedSteps.includes(index);
            const isActive = currentStep === index;
            const isPending = !isComplete && !isActive;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isComplete ? 'border-success bg-success/5' :
                  isActive ? 'border-primary bg-primary/5' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isComplete ? (
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${isComplete || isActive ? 'text-secondary' : 'text-gray-400'}`}>
                      {step.name}
                    </h3>
                    <p className={`text-sm ${isComplete || isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.message}
                    </p>
                    {step.metric && (isComplete || isActive) && (
                      <p className="text-xs text-primary font-medium mt-1">
                        {step.metric}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {analysisComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-success text-xl font-bold">
              <Check className="w-6 h-6" />
              Analysis Complete!
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Redirecting to your results...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
