import { ChevronRight } from 'lucide-react';

interface SectionTabsProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function SectionTabs({ sections, activeSection, onSectionChange }: SectionTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-gray-200 mb-6">
      {sections.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionChange(section)}
          className={`px-6 py-3 rounded-t-lg font-semibold whitespace-nowrap transition-all ${
            activeSection === section
              ? 'bg-[#2782EA] text-white shadow-md'
              : 'bg-gray-100 text-[#0F1C2A] hover:bg-gray-200'
          }`}
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          {section}
        </button>
      ))}
    </div>
  );
}

