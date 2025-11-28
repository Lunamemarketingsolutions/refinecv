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
  { id: 1, name: 'Processing CV & JD', duration: 6000, message: 'Uploading CV and parsing job description...', metric: 'CV: 1,847 words | JD: 482 words' },
  { id: 2, name: 'Extracting Keywords from JD', duration: 8000, message: 'Identifying required skills, qualifications, and experience...', metric: '25 key requirements detected' },
  { id: 3, name: 'Analyzing CV Content', duration: 8000, message: 'Extracting skills, experiences, and achievements from your CV...', metric: '32 relevant keywords found in CV' },
  { id: 4, name: 'Matching Keywords', duration: 10000, message: 'Comparing JD requirements to CV content...', metric: '18 matches | 5 partial | 7 missing' },
  { id: 5, name: 'Detecting Role Type', duration: 6000, message: 'Identifying if role is consulting, PM, marketing, banking, etc...', metric: 'Role detected: Product Management' },
  { id: 6, name: 'Identifying Strengths', duration: 8000, message: 'Finding which CV sections align well with JD requirements...', metric: '5 strong matches identified' },
  { id: 7, name: 'Finding Gaps & Weaknesses', duration: 8000, message: 'Detecting missing keywords and experience gaps...', metric: '7 improvement opportunities found' },
  { id: 8, name: 'Generating Tailoring Recommendations', duration: 6000, message: 'Creating prioritized action items to improve match score...', metric: '8 action items ready' },
];

export default function JDMatchAnalyzing() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const totalDuration = analysisSteps.reduce((acc, step) => acc + step.duration, 0);

  useEffect(() => {
    if (!matchId || !user) {
      navigate('/jd-match-tool');
      return;
    }

    runAnalysis();
  }, [matchId, user, navigate]);

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
        const overallProgress = ((timeElapsed + (Date.now() - stepStartTime)) / totalDuration) * 100;
        setProgress(Math.min(overallProgress, 100));
      }

      timeElapsed += step.duration;
      setCompletedSteps(prev => [...prev, i]);
      setProgress(Math.min((timeElapsed / totalDuration) * 100, 100));
    }

    setAnalysisComplete(true);

    const mockMatchResults = await createMockMatch();

    setTimeout(() => {
      navigate(`/jd-match-tool/results/${mockMatchResults.id}`);
    }, 2000);
  };

  const createMockMatch = async () => {
    if (!user || !matchId) throw new Error('User or match ID missing');

    const { data, error } = await supabase
      .from('jd_matches')
      .update({
        overall_score: 78,
        matched_keywords: [
          { name: 'Python', jdFrequency: 5, cvFrequency: 3, status: 'matched' },
          { name: 'Team Leadership', jdFrequency: 3, cvFrequency: 2, status: 'matched' },
          { name: 'Product Analytics', jdFrequency: 4, cvFrequency: 1, status: 'under-represented' },
          { name: 'React', jdFrequency: 3, cvFrequency: 2, status: 'matched' },
          { name: 'Data Analysis', jdFrequency: 2, cvFrequency: 3, status: 'matched' },
        ],
        missing_keywords: [
          { name: 'Machine Learning', jdFrequency: 4, priority: 'CRITICAL', impact: 6 },
          { name: 'Stakeholder Management', jdFrequency: 3, priority: 'HIGH', impact: 4 },
          { name: 'User Research', jdFrequency: 3, priority: 'HIGH', impact: 4 },
          { name: 'Roadmap Planning', jdFrequency: 2, priority: 'MEDIUM', impact: 3 },
          { name: 'A/B Testing', jdFrequency: 2, priority: 'MEDIUM', impact: 2 },
          { name: 'Product Analytics', jdFrequency: 2, priority: 'MEDIUM', impact: 2 },
          { name: 'Cross-functional', jdFrequency: 1, priority: 'LOW', impact: 1 },
        ],
        partial_matches: [
          { cvPhrase: 'Managed team', jdPrefers: 'Led cross-functional team', impact: 3 },
          { cvPhrase: 'Worked on features', jdPrefers: 'Owned product roadmap', impact: 3 },
          { cvPhrase: 'Analyzed data', jdPrefers: 'Conducted user research', impact: 3 },
          { cvPhrase: 'Improved process', jdPrefers: 'Implemented Agile methodologies', impact: 2 },
          { cvPhrase: 'Sales growth', jdPrefers: 'Revenue optimization', impact: 1 },
        ],
        strengths: [
          { title: 'Strong Technical Skills Alignment', match: 95, details: 'Python, React, SQL, AWS all match' },
          { title: 'Directly Relevant Experience', match: 88, details: 'Amazon and Walmart internships relevant' },
          { title: 'Education Matches Requirements', match: 100, details: 'ME exceeds requirements' },
          { title: 'Relevant Projects Demonstrated', match: 82, details: '3 projects show initiative' },
          { title: 'Strong Use of Metrics', match: 85, details: 'Quantified achievements throughout' },
        ],
        weaknesses: [
          { title: 'Missing PM-Specific Language', impact: 'MEDIUM', fix: 'Reframe engineering bullets to PM language' },
          { title: 'Limited User Research Emphasis', impact: 'MEDIUM', fix: 'Add user research context to projects' },
          { title: 'No Mention of Roadmap Planning', impact: 'MEDIUM', fix: 'Add roadmap language to work experience' },
          { title: 'Stakeholder Management Understated', impact: 'MEDIUM', fix: 'Replace "team" with "cross-functional stakeholders"' },
          { title: 'Missing Business Context in Projects', impact: 'LOW', fix: 'Explain business problem solved' },
        ],
        action_items: {
          high: [
            { task: 'Add 7 missing keywords', time: 35, impact: 12 },
            { task: 'Reframe 5-7 bullets for PM language', time: 10, impact: 8 },
          ],
          medium: [
            { task: 'Strengthen 5 partial matches', time: 15, impact: 5 },
            { task: 'Add quantified metrics', time: 5, impact: 3 },
          ],
          low: [
            { task: 'Enhance strengths', time: 10, impact: 2 },
            { task: 'Optimize CV structure', time: 5, impact: 2 },
          ],
        },
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('usage_tracking').insert({
      user_id: user.id,
      tool_type: 'jd_matcher',
      analysis_id: data.id,
    });

    return data;
  };

  return (
    <div className="min-h-screen bg-success/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">
            Analyzing Your CV-JD Match...
          </h1>
          <p className="text-gray-600 text-sm">
            Comparing your CV to the job description | Approx. 60 seconds
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-success">{Math.round(progress)}%</span>
            <span className="text-sm text-gray-500">
              Elapsed: {elapsedTime}s / 60s
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-success transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {analysisSteps.map((step, index) => {
            const isComplete = completedSteps.includes(index);
            const isActive = currentStep === index;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isComplete ? 'border-success bg-success/5' :
                  isActive ? 'border-success bg-success/5' :
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
                      <Loader2 className="w-6 h-6 text-success animate-spin" />
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
              Match Score: 78% | Redirecting to results...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
