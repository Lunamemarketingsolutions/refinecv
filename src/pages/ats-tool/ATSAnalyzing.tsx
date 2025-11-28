import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AnalysisStep {
  id: number;
  name: string;
  duration: number;
  message: string;
  metric?: string;
}

const analysisSteps: AnalysisStep[] = [
  { id: 1, name: 'Uploading CV', duration: 5000, message: 'Securely uploading your document...' },
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
    let timeElapsed = 0;

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);

      const step = analysisSteps[i];
      const stepStartTime = Date.now();

      while (Date.now() - stepStartTime < step.duration) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const stepProgress = ((Date.now() - stepStartTime) / step.duration) * 100;
        const overallProgress = ((timeElapsed + (Date.now() - stepStartTime)) / totalDuration) * 100;
        setProgress(Math.min(overallProgress, 100));
      }

      timeElapsed += step.duration;
      setCompletedSteps(prev => [...prev, i]);
      setProgress(Math.min((timeElapsed / totalDuration) * 100, 100));
    }

    setAnalysisComplete(true);

    if (!isSample) {
      await createMockAnalysis();
    }

    setTimeout(() => {
      navigate(`/ats-tool/results/${uploadId}`);
    }, 2000);
  };

  const createMockAnalysis = async () => {
    if (!user || !uploadId) throw new Error('User or upload ID missing');

    const { data, error } = await supabase
      .from('ats_analyses')
      .insert({
        user_id: user.id,
        cv_upload_id: uploadId,
        overall_score: 78,
        critical_issues: [
          {
            title: 'Contact Information Not Detected',
            impact: 'Critical',
            impactScore: -15,
            problem: 'ATS cannot detect your name, phone number, or LinkedIn URL. These fields appear in your header/footer, which most ATS systems cannot parse.',
            location: 'Header (top of page, inside a text box)',
            atsView: '[No name detected]\n[No phone detected]\nEmail: naveen@example.com (✓ detected)\nLinkedIn: [Not detected]',
            solution: '1. Move all contact information from header/footer to the main body of your CV\n2. Place contact info at the very top of the page in plain text (not in text boxes)\n3. Format as follows:\n   Naveen Kumar\n   Phone: +91 98765 43210\n   Email: naveen@example.com\n   LinkedIn: linkedin.com/in/naveenkumar',
            timeToFix: '5 minutes',
            scoreImpact: '+15%',
          },
          {
            title: 'Skills Section Using Graphics',
            impact: 'Critical',
            impactScore: -10,
            problem: 'Your skills are displayed as visual bar charts/graphics. ATS cannot read images or graphics, so it thinks you have ZERO skills listed.',
            location: 'Skills section (page 1, right column)',
            atsView: 'SKILLS:\n[Unable to parse graphic content]\n[No skills detected]',
            solution: '1. Remove all skill bar charts, progress bars, or visual representations\n2. Convert to plain text list format\n3. Add proficiency levels in text\n\nExample Format:\nTECHNICAL SKILLS:\n- Python: Advanced (5 years, data analysis, ML models)\n- SQL: Intermediate (3 years, complex queries, optimization)',
            timeToFix: '10 minutes',
            scoreImpact: '+10%',
          },
          {
            title: 'Two-Column Layout Detected',
            impact: 'Critical',
            impactScore: -8,
            problem: 'Your CV uses a two-column table layout. ATS reads left-to-right across the entire page, which mixes content from both columns incorrectly.',
            location: 'Entire CV (Education in left column, Work Experience in right column)',
            atsView: 'IIM Bangalore... Worked at Amazon... MBA degree... Led team of 5... Graduated 2022... Increased sales...\n\n(Content is jumbled, chronology is broken, ATS cannot build proper timeline)',
            solution: '1. Remove all table-based layouts\n2. Convert to single-column format\n3. Use clear section headings with proper spacing',
            timeToFix: '20 minutes',
            scoreImpact: '+8%',
          },
        ],
        warnings: [
          { title: 'Inconsistent Date Formatting', impactScore: -3, problem: 'Mixed date formats used', fix: 'Use consistent format: "Month YYYY - Month YYYY"', timeToFix: '5 minutes' },
          { title: 'Section Heading Not Standard', impactScore: -2, problem: '"Relevant Experience" instead of "Work Experience"', fix: 'Use standard headings', timeToFix: '1 minute' },
          { title: 'Special Characters Detected', impactScore: -2, problem: 'Bullets use non-standard symbols (►, ●, ◆)', fix: 'Use standard bullet points (•)', timeToFix: '3 minutes' },
          { title: 'Custom Font Detected', impactScore: -2, problem: 'Using "Montserrat" font (not ATS-safe)', fix: 'Use Arial, Calibri, or Times New Roman', timeToFix: '2 minutes' },
          { title: 'Hyperlinks Not Properly Formatted', impactScore: -1, problem: 'LinkedIn URL is hyperlinked', fix: 'Display as plain text', timeToFix: '1 minute' },
        ],
        passed_checks: [
          'Email address detected correctly',
          'Work experience section identified',
          'Education section identified',
          'Bullet points parsed correctly',
          'Company names detected',
          'Job titles detected',
          'Degrees and institutions identified',
          'Graduation years parsed',
          'File format compatible (PDF)',
          'File size under 5MB',
          'No password protection',
          'No embedded images in text',
          'Standard page margins',
          'Readable font size (11pt)',
          'Consistent spacing',
          'Section breaks clear',
          'No overlapping text',
          'Content within page boundaries',
        ],
        ats_text_extraction: `========================================
EXTRACTED CONTENT (as ATS sees it)
========================================

[CONTACT INFORMATION]
Name: [NOT DETECTED]
Email: naveen@example.com
Phone: [NOT DETECTED]
LinkedIn: [NOT DETECTED]

----------------------------------------

[WORK EXPERIENCE SECTION - DETECTED ✓]

Software Engineer
Amazon India | Bangalore
August 2022 - Present
- Developed mobile applications
- Maintained Java codebase
- Led team of three persons

Software Engineer Intern
Walmart Global Tech | Bangalore
January 2022 - July 2022
- Built inventory management application

----------------------------------------

[EDUCATION SECTION - DETECTED ✓]

ME Software Systems
BITS Pilani | 8.33 CGPA | 2020 - 2022

B Tech Information Technology
Jaipur Engineering College | 8.1 CGPA | 2015 - 2019

----------------------------------------

[SKILLS SECTION - ERROR ✗]
[Unable to parse graphic content]
[No skills detected]

========================================`,
        section_scores: {
          contactInfo: { score: 40, detected: 'partial', issues: 'Name, phone, LinkedIn not detected' },
          workExperience: { score: 95, detected: 'yes', issues: 'All entries parsed correctly' },
          education: { score: 100, detected: 'yes', issues: 'Perfect parsing' },
          skills: { score: 0, detected: 'no', issues: 'Graphics not readable' },
          projects: { score: 90, detected: 'yes', issues: 'Minor date format inconsistency' },
        },
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('usage_tracking').insert({
      user_id: user.id,
      tool_type: 'ats_analyzer',
      analysis_id: data.id,
    });

    await supabase.from('cv_analyses').insert({
      user_id: user.id,
      cv_upload_id: uploadId,
      tool_type: 'ats_analyzer',
      ats_score: 78,
      cv_text: 'Sample CV text',
      jd_text: '',
    });

    return data;
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
