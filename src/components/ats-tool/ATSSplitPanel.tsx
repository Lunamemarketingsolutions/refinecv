import { Eye, FileText } from 'lucide-react';

interface ATSSplitPanelProps {
  atsText: string;
  cvName: string;
}

export default function ATSSplitPanel({ atsText, cvName }: ATSSplitPanelProps) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-secondary flex items-center gap-2">
          <Eye className="w-7 h-7" />
          What ATS Actually Sees
        </h2>
        <p className="text-gray-600 mt-2">
          Compare your formatted CV to what ATS systems extract. This is the exact text ATS parsers read.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-secondary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your CV
            </h3>
          </div>

          <div className="p-6">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">
                  {cvName}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  PDF preview would appear here
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success rounded border-2 border-success"></div>
                <span className="text-gray-600">Sections parsed correctly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-error rounded border-2 border-error"></div>
                <span className="text-gray-600">Sections not parsed or errors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded border-2 border-amber-500"></div>
                <span className="text-gray-600">Partially parsed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-secondary flex items-center gap-2">
              <Eye className="w-5 h-5" />
              ATS Extraction
            </h3>
          </div>

          <div className="p-6">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto h-96 leading-relaxed whitespace-pre-wrap">
{atsText}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          Key Differences:
        </h3>

        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 mt-0.5">1.</span>
            <span>Your formatted CV shows contact info in header → ATS sees: <span className="font-semibold text-error">[NOT DETECTED]</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 mt-0.5">2.</span>
            <span>Your CV has visual skill bars → ATS sees: <span className="font-semibold text-error">[No skills detected]</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-600 mt-0.5">3.</span>
            <span>Your CV has two-column layout → ATS reads left-to-right, mixing content</span>
          </li>
        </ul>

        <p className="text-gray-600 text-sm mt-4">
          These parsing errors explain your 78% ATS score.
        </p>
      </div>
    </section>
  );
}
