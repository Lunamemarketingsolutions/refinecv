import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function EnhancerAnalyzing() {
  const { enhancementId } = useParams<{ enhancementId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const steps = [
    { section: 'Personal Information', rating: 5, issues: 0, details: 'Contact info clear, email professional' },
    { section: 'Work Experience', rating: 3, issues: 8, details: '5 weak verbs, 3 bullets missing metrics' },
    { section: 'Education', rating: 4, issues: 2, details: 'Add relevant coursework, highlight GPA' },
    { section: 'Projects', rating: 2, issues: 6, details: 'No user impact, missing scale/metrics' },
    { section: 'Skills', rating: 3, issues: 3, details: 'Add proficiency levels, years of experience' },
    { section: 'Positions of Responsibility', rating: 4, issues: 2, details: 'Add team sizes, quantify impact' }
  ];

  const [analysisSteps, setAnalysisSteps] = useState(steps.map(s => ({ ...s, status: 'pending' as const })));

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 30000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      setElapsedTime(Math.floor(elapsed / 1000));

      const stepIndex = Math.floor((elapsed / totalDuration) * steps.length);
      setAnalysisSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < stepIndex ? 'complete' : idx === stepIndex ? 'analyzing' : 'pending'
      })));

      if (newProgress >= 100) {
        clearInterval(interval);
        setShowScore(true);
        setTimeout(() => createMockData(), 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const createMockData = async () => {
    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const { data: section } = await supabase
          .from('cv_enhancement_sections')
          .insert({
            enhancement_id: enhancementId,
            section_name: step.section,
            section_order: i + 1,
            rating_before: step.rating,
            rating_after: step.rating,
            total_bullets: Math.max(step.issues, 1),
            enhanced_bullets: 0
          })
          .select()
          .maybeSingle();

        if (section) {
          const bulletCount = Math.max(step.issues, 1);
          for (let j = 0; j < bulletCount; j++) {
            await supabase.from('cv_bullets').insert({
              section_id: section.id,
              original_text: `Sample bullet point ${j + 1} for ${step.section}`,
              current_text: `Sample bullet point ${j + 1} for ${step.section}`,
              bullet_order: j + 1,
              rating_before: step.rating,
              issues: JSON.stringify(['Passive verb', 'No metrics', 'Too vague'])
            });
          }
        }
      }

      await supabase.from('cv_enhancements').update({
        overall_score_before: 72,
        overall_score_after: 72,
        status: 'editing'
      }).eq('id', enhancementId);

      navigate(`/cv-enhancer/editor/${enhancementId}`);
    } catch (error) {
      console.error('Error creating mock data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-3">
            Analyzing Your CV Sections...
          </h1>
          <p className="text-gray-600">
            Rating each section and identifying improvement opportunities
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Elapsed: {elapsedTime}s / 30s
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {analysisSteps.map((step, idx) => (
            <div
              key={idx}
              className={`border-2 rounded-lg p-4 transition-all ${
                step.status === 'complete'
                  ? 'border-success bg-success/5'
                  : step.status === 'analyzing'
                  ? 'border-purple-600 bg-purple-50 animate-pulse'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'complete' ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : step.status === 'analyzing' ? (
                    <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-secondary">{step.section}</h3>
                    {step.status === 'complete' && (
                      <span className="text-lg">
                        {'⭐'.repeat(step.rating)}{'☆'.repeat(5 - step.rating)}
                      </span>
                    )}
                  </div>
                  {step.status === 'complete' && (
                    <>
                      <p className="text-sm text-gray-600">{step.details}</p>
                      <p className="text-xs font-medium text-gray-700 mt-1">
                        {step.issues > 0 ? `${step.issues} bullets can be enhanced` : 'No issues found'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showScore && (
          <div className="text-center p-8 bg-gradient-to-r from-purple-100 to-primary/10 rounded-2xl border-2 border-purple-200">
            <div className="text-6xl font-black text-purple-600 mb-2">72%</div>
            <div className="text-2xl text-amber-600 mb-3">⭐⭐⭐☆☆</div>
            <p className="text-lg font-semibold text-secondary mb-4">Your CV Score</p>
            <div className="bg-success/10 border-2 border-success rounded-lg p-4 mb-4">
              <p className="font-semibold text-success mb-1">Potential Score: 92% ⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-gray-700">+20% improvement possible</p>
            </div>
            <div className="text-lg font-bold text-success flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Analysis Complete!
            </div>
            <p className="text-gray-600 mt-2">21 enhancement opportunities found</p>
          </div>
        )}
      </div>
    </div>
  );
}
