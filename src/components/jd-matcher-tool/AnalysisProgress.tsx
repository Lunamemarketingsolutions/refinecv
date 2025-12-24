import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  message?: string;
}

export default function AnalysisProgress({ message = 'Analyzing your resume with AI...' }: AnalysisProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-black text-secondary mb-2">Processing Your Resume</h3>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-4">This may take 30-60 seconds...</p>
      </div>
    </div>
  );
}

