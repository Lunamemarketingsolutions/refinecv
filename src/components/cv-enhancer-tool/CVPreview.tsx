import { useState } from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

interface Section {
  id: string;
  section_name: string;
  rating_after: number;
}

interface Bullet {
  id: string;
  section_id: string;
  current_text: string;
  is_enhanced: boolean;
}

interface Props {
  sections: Section[];
  bullets: Bullet[];
}

export default function CVPreview({ sections, bullets }: Props) {
  const [zoom, setZoom] = useState(100);

  const getSectionBullets = (sectionId: string) => {
    return bullets.filter(b => b.section_id === sectionId);
  };

  return (
    <div className="w-1/2 h-full flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-semibold text-secondary">Live CV Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-1 text-gray-600 hover:text-primary disabled:opacity-30"
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-1 text-gray-600 hover:text-primary disabled:opacity-30"
            disabled={zoom >= 150}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="ml-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center gap-1">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div
          className="bg-white mx-auto shadow-2xl"
          style={{
            width: `${(210 * zoom) / 100}mm`,
            minHeight: `${(297 * zoom) / 100}mm`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            padding: '40px'
          }}
        >
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
            <h1 className="text-2xl font-bold text-secondary mb-2">YOUR NAME</h1>
            <p className="text-sm text-gray-600">
              email@example.com | +91 00000 00000 | linkedin.com/in/yourname
            </p>
          </div>

          {sections.map((section) => {
            const sectionBullets = getSectionBullets(section.id);
            if (sectionBullets.length === 0) return null;

            return (
              <div key={section.id} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-secondary uppercase">
                    {section.section_name}
                  </h2>
                  <span className="text-xs">{'⭐'.repeat(section.rating_after)}</span>
                </div>

                <div className="space-y-3">
                  {sectionBullets.map((bullet) => (
                    <div
                      key={bullet.id}
                      data-bullet-id={bullet.id}
                      className={`text-sm leading-relaxed ${
                        bullet.is_enhanced ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}
                    >
                      <p className="flex items-start gap-2">
                        <span>•</span>
                        <span>{bullet.current_text}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
