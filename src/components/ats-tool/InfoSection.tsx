import { BookOpen, CheckCircle2 } from 'lucide-react';

export default function InfoSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary mb-2">
              What is an ATS?
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              An Applicant Tracking System (ATS) is software used by employers to filter and rank resumes.
              Over 90% of large companies use ATS to screen candidates before a human ever sees your resume.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Use standard section headers</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Avoid tables and text boxes</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Use simple, clean formatting</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Include keywords from job description</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

