import { Save, Download, X } from 'lucide-react';

interface Section {
  id: string;
  section_name: string;
  rating_after: number;
  is_complete: boolean;
}

interface Props {
  sections: Section[];
  currentSectionIndex: number;
  overallScore: number;
  onSectionChange: (index: number) => void;
}

export default function SectionProgressBar({ sections, currentSectionIndex, overallScore, onSectionChange }: Props) {
  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-md sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex items-center gap-4 overflow-x-auto">
            {sections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all ${
                  idx === currentSectionIndex
                    ? 'bg-purple-100 border-purple-600 border-t-4'
                    : section.is_complete
                    ? 'bg-success/10 border-success'
                    : 'bg-gray-50 border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-secondary truncate max-w-32">
                      {section.section_name}
                    </div>
                    <div className="text-xs">
                      {'⭐'.repeat(section.rating_after).substring(0, 5)}
                    </div>
                  </div>
                  {section.is_complete && <span className="text-success text-sm">✓</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-6">
            <div className="bg-gradient-to-r from-purple-600 to-primary text-white px-6 py-2 rounded-lg">
              <div className="text-xs">CV Score</div>
              <div className="text-2xl font-black">{overallScore}%</div>
            </div>
            <button className="p-2 text-gray-600 hover:text-primary" title="Save"><Save className="w-5 h-5" /></button>
            <button className="p-2 text-gray-600 hover:text-success" title="Download"><Download className="w-5 h-5" /></button>
            <button className="p-2 text-gray-600 hover:text-error" title="Exit"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success to-primary transition-all duration-500"
            style={{ width: `${(sections.filter(s => s.is_complete).length / sections.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
