import { useState } from 'react';
import { ArrowRight, Check, X, AlertCircle, Wand2 } from 'lucide-react';
import type { ResumeData, Recommendation } from '../../types/jdMatcher';

interface ResumeTailoringProps {
  resumeData: ResumeData;
  recommendations: Recommendation[];
  onComplete: (updatedData: ResumeData, appliedIds: string[]) => void;
}

export default function ResumeTailoring({ resumeData: initialData, recommendations, onComplete }: ResumeTailoringProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (rec: Recommendation) => {
    const newData: ResumeData = { ...resumeData };

    if (rec.type === 'summary') {
      newData.professionalSummary = rec.suggested;
    } else if (rec.type === 'skill') {
      if (!newData.skills.includes(rec.suggested)) {
        newData.skills = [...newData.skills, rec.suggested];
      }
    } else if (rec.type === 'experience') {
      newData.experience = newData.experience.map((exp) => ({
        ...exp,
        description: exp.description.replace(rec.current, rec.suggested)
      }));
    } else if (rec.type === 'education') {
      newData.education = newData.education.map((edu) => ({
        ...edu,
        degree: edu.degree.replace(rec.current, rec.suggested),
        institution: edu.institution.replace(rec.current, rec.suggested)
      }));
    } else if (rec.type === 'certification') {
      const newCert = { name: rec.suggested, issuer: 'Pending', year: '2024' };
      newData.certifications = [...(newData.certifications || []), newCert];
    } else if (rec.type === 'project') {
      newData.projects = (newData.projects || []).map((proj) => ({
        ...proj,
        description: proj.description.replace(rec.current, rec.suggested)
      }));
    }

    setResumeData(newData);
    markAsProcessed(rec.id);
    setAppliedIds(prev => new Set([...prev, rec.id]));
  };

  const handleIgnore = (id: string) => {
    markAsProcessed(id);
  };

  const markAsProcessed = (id: string) => {
    const newSet = new Set(processedIds);
    newSet.add(id);
    setProcessedIds(newSet);
  };

  const activeRecommendations = recommendations.filter(rec => !processedIds.has(rec.id));

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-secondary">Resume Tailoring</h1>
            <p className="text-gray-600 mt-1">Review and apply AI suggestions based on the Job Description</p>
          </div>
          <button
            onClick={() => onComplete(resumeData, Array.from(appliedIds))}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors shadow-sm"
          >
            Save & Preview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Summary Section */}
          {activeRecommendations.some(r => r.type === 'summary') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex items-center gap-3">
                <Wand2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-secondary">Summary Optimization</h2>
              </div>
              <div className="p-6">
                {activeRecommendations.filter(r => r.type === 'summary').map(rec => (
                  <div key={rec.id} className="flex gap-6">
                    <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Current</span>
                      <p className="text-gray-700 text-sm">{rec.current || resumeData.professionalSummary}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 p-4 bg-success/10 rounded-lg border border-success/20">
                      <span className="text-xs font-bold text-success uppercase tracking-wide mb-2 block">Suggested</span>
                      <p className="text-gray-800 text-sm">{rec.suggested}</p>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleApply(rec)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success text-white rounded-md text-sm hover:bg-success/90 transition-colors font-medium"
                        >
                          <Check className="w-4 h-4" /> Apply Change
                        </button>
                        <button
                          onClick={() => handleIgnore(rec.id)}
                          className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-xs text-success italic">
                        Reason: {rec.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Skills */}
          {activeRecommendations.some(r => r.type === 'skill') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-secondary">Recommended Skills</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRecommendations.filter(r => r.type === 'skill').map(rec => (
                    <div key={rec.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-secondary">{rec.suggested}</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">New</span>
                        </div>
                        <p className="text-sm text-gray-600">{rec.reason}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApply(rec)}
                          className="p-1.5 bg-success/10 text-success rounded-md hover:bg-success/20 transition-colors"
                          title="Add Skill"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleIgnore(rec.id)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-md transition-colors"
                          title="Ignore"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Recommendations */}
          {activeRecommendations.some(r => !['summary', 'skill'].includes(r.type)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-warning/10 px-6 py-4 border-b border-warning/20 flex items-center gap-3">
                <Wand2 className="w-5 h-5 text-warning" />
                <h2 className="font-semibold text-secondary">Content Improvements</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {activeRecommendations.filter(r => !['summary', 'skill'].includes(r.type)).map(rec => (
                  <div key={rec.id} className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${
                          rec.type === 'experience' ? 'bg-primary/10 text-primary' :
                          rec.type === 'project' ? 'bg-primary/10 text-primary' :
                          rec.type === 'education' ? 'bg-warning/10 text-warning' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {rec.type}
                        </span>
                        <p className="mt-2 text-sm text-gray-600">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-xs text-error font-medium">Original:</span>
                          <p className="text-sm text-gray-500 line-through decoration-error/50">{rec.current || '(New Item)'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-success font-medium">Suggested:</span>
                          <p className="text-sm text-secondary font-medium">{rec.suggested}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleApply(rec)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors font-medium"
                        >
                          <Check className="w-3 h-3" /> Apply
                        </button>
                        <button
                          onClick={() => handleIgnore(rec.id)}
                          className="px-3 py-1.5 text-gray-500 text-xs hover:text-gray-900 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!activeRecommendations.length && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-secondary">All Suggestions Reviewed!</h3>
              <p className="text-gray-600 mt-2 mb-6">Your resume is optimized and ready for preview.</p>
              <button
                onClick={() => onComplete(resumeData, Array.from(appliedIds))}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors shadow-sm"
              >
                View Final Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

