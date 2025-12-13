import { useEffect, useState } from 'react';
import { Clock, FileText, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { getAllResumes, deleteResume } from '../../services/ats/resumeService';

interface ResumeHistoryProps {
  onResumeSelect: (resume: any) => void;
  onClose: () => void;
  userId: string;
}

export default function ResumeHistory({ onResumeSelect, onClose, userId }: ResumeHistoryProps) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, [userId]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllResumes(userId, 50, 0);
      setResumes(data);
    } catch (err) {
      setError('Failed to load resume history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, storagePath?: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteResume(id, userId, storagePath);
      setResumes(resumes.filter(r => r.cvUpload.id !== id));
    } catch (err) {
      alert('Failed to delete resume');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number | null) => {
    if (!score) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Resume History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No resumes found</p>
              <p className="text-gray-400 text-sm mt-2">Upload a resume to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.cvUpload.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => onResumeSelect(resume)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${getScoreBgColor(resume.analysis?.overall_score || null)}`}>
                          {resume.analysis?.overall_score !== null && resume.analysis?.overall_score !== undefined ? (
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(resume.analysis.overall_score)}`}>
                                {resume.analysis.overall_score}
                              </div>
                              <div className="text-xs text-gray-600">ATS</div>
                            </div>
                          ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {resume.cvUpload.file_name}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(resume.cvUpload.created_at)}</span>
                            </div>
                            <span>{formatFileSize(resume.cvUpload.file_size)}</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleDelete(resume.cvUpload.id, resume.cvUpload.file_path)}
                      disabled={deletingId === resume.cvUpload.id}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete resume"
                    >
                      {deletingId === resume.cvUpload.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
