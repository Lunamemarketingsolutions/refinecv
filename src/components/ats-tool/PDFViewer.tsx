import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { ATSAnalysis, ATSSuggestion } from '../../types/ats';
import CompactATSScore from './CompactATSScore';
import ATSView from './ATSView';
import SuggestionMarker from './SuggestionMarker';
import { ReformatResumeButton } from './ReformatResumeButton';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  file?: File;
  fileUrl?: string;
  analysis: ATSAnalysis;
  suggestions?: ATSSuggestion[];
  onApplySuggestion?: (suggestionId: string) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
  isApplyingEdit?: boolean;
  onReformatComplete?: (newFileUrl: string, newAnalysis: ATSAnalysis, fileName: string) => void;
  currentFileName?: string;
}

export default function PDFViewer({
  file,
  fileUrl,
  analysis,
  suggestions = [],
  onApplySuggestion = () => {},
  onDismissSuggestion = () => {},
  isApplyingEdit = false,
  onReformatComplete = (_url, _analysis, _fileName) => {},
  currentFileName = 'resume.pdf'
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const pdfScale = 2.0;

  useEffect(() => {
    const loadAndRenderAllPages = async () => {
      setLoading(true);
      setCanvases([]);

      let arrayBuffer: ArrayBuffer;

      if (file) {
        arrayBuffer = await file.arrayBuffer();
      } else if (fileUrl) {
        const response = await fetch(fileUrl);
        arrayBuffer = await response.arrayBuffer();
      } else {
        setLoading(false);
        return;
      }

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const newCanvases: HTMLCanvasElement[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;
        newCanvases.push(canvas);
      }

      setCanvases(newCanvases);
      setLoading(false);
    };

    loadAndRenderAllPages();
  }, [file, fileUrl]);

  useEffect(() => {
    if (containerRef.current && canvases.length > 0) {
      containerRef.current.innerHTML = '';
      canvases.forEach((canvas) => {
        containerRef.current?.appendChild(canvas);
      });
    }
  }, [canvases]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  const shouldShowSuggestions = () => {
    const tier = analysis.detailedScore?.tier;
    const score = analysis.score;

    if (score < 60 || tier === 'poor') {
      return false;
    }

    if (score > 80 || tier === 'excellent' || tier === 'very-good') {
      return false;
    }

    return tier === 'fair' || tier === 'good' || (score >= 60 && score <= 80);
  };

  return (
    <div className="space-y-6">
      <CompactATSScore analysis={analysis} />

      <ReformatResumeButton
        analysis={analysis}
        currentFileName={currentFileName}
        onReformatComplete={onReformatComplete}
      />

      {isApplyingEdit && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-semibold text-blue-900">Applying changes to your resume...</p>
              <p className="text-sm text-blue-700">This may take a moment. Please wait.</p>
            </div>
          </div>
        </div>
      )}

      {shouldShowSuggestions() && pendingSuggestions.filter(s => !s.coordinates).map((suggestion) => (
        <SuggestionMarker
          key={suggestion.id}
          suggestion={suggestion}
          onApply={() => onApplySuggestion(suggestion.id)}
          onDismiss={() => onDismissSuggestion(suggestion.id)}
          scale={pdfScale}
        />
      ))}

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start overflow-y-auto max-h-[600px]">
          <div className="space-y-4">
            <div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg">
                <span className="text-sm font-medium">Original PDF ({canvases.length} {canvases.length === 1 ? 'page' : 'pages'})</span>
              </div>
              <div ref={pdfContainerRef} className="relative bg-white shadow-lg">
                <div
                  ref={containerRef}
                  className="flex flex-col space-y-4 p-4"
                >
                </div>

                {shouldShowSuggestions() && pendingSuggestions.filter(s => s.coordinates).map((suggestion) => (
                  <SuggestionMarker
                    key={suggestion.id}
                    suggestion={suggestion}
                    onApply={() => onApplySuggestion(suggestion.id)}
                    onDismiss={() => onDismissSuggestion(suggestion.id)}
                    scale={pdfScale}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ATSView analysis={analysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
