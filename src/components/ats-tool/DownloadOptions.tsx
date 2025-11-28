import { FileText, FileCheck, Mail } from 'lucide-react';

interface DownloadOptionsProps {
  analysisId: string;
  cvName: string;
}

export default function DownloadOptions({ analysisId, cvName }: DownloadOptionsProps) {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
        <h2 className="text-2xl font-black text-secondary mb-6 text-center">
          📥 Save Your Results
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">
              Full PDF Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete analysis with all issues, recommendations, and examples
            </p>
            <p className="text-xs text-gray-500 mb-4">~2.5 MB</p>
            <button className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              Download PDF
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">
              Action Plan Checklist
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Prioritized checklist of fixes to improve your ATS score
            </p>
            <p className="text-xs text-gray-500 mb-4">~500 KB</p>
            <button className="w-full border-2 border-success text-success px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-success/5 transition-colors">
              Download Checklist
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">
              Email Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Send complete analysis to your email for later review
            </p>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:border-primary focus:outline-none"
            />
            <button className="w-full border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              Email Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
