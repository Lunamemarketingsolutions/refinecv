import { Sparkles, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { ATSSuggestion } from '../../types/ats';

interface SuggestionMarkerProps {
  suggestion: ATSSuggestion;
  onApply: () => void;
  onDismiss: () => void;
  scale: number;
}

export default function SuggestionMarker({
  suggestion,
  onApply,
  onDismiss,
  scale
}: SuggestionMarkerProps) {
  const [showTemplate, setShowTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = async () => {
    await navigator.clipboard.writeText(suggestion.suggestedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!suggestion.coordinates) {
    return (
      <div className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <p className="font-semibold">{suggestion.sectionName}</p>
            </div>
            <p className="text-sm opacity-90">ATS cannot read this section</p>
            <p className="text-xs opacity-75 mt-1">{suggestion.suggestionReason}</p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            title="Dismiss suggestion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showTemplate ? (
          <button
            onClick={() => setShowTemplate(true)}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>View ATS-Friendly Template (+{suggestion.estimatedScoreImprovement} pts)</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 text-gray-900 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">ATS-Friendly Template:</h4>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {suggestion.suggestedContent}
              </pre>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onApply}
                className="flex-1 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition-all"
              >
                Mark as Done
              </button>
              <button
                onClick={() => setShowTemplate(false)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-medium transition-colors"
              >
                Hide
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const { x, y, width, height } = suggestion.coordinates;
  const scaledX = x * scale;
  const scaledY = y * scale;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${scaledX}px`,
        top: `${scaledY}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 border-2 border-red-500 bg-red-100/20 rounded pointer-events-none"></div>

        <div className="absolute -top-1 -right-1 pointer-events-auto">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg p-2 min-w-[200px]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">{suggestion.sectionName}</p>
                <p className="text-[10px] opacity-90">ATS cannot read this section</p>
              </div>
              <button
                onClick={onDismiss}
                className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                title="Dismiss suggestion"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onApply}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fix with AI (+{suggestion.estimatedScoreImprovement} pts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
