import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Bullet {
  id: string;
  current_text: string;
  rating_before: number;
  issues: string[];
  suggestions: any[];
  is_enhanced: boolean;
}

interface Props {
  bullet: Bullet;
  onUpdate: (updates: Partial<Bullet>) => void;
}

export default function BulletEditor({ bullet, onUpdate }: Props) {
  const [generating, setGenerating] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
      const mockSuggestions = [
        {
          text: `Led development of 3 mobile applications (2 Android, 1 iOS) serving 10,000+ users; architected reusable Java codebase improving code efficiency by 30%; managed cross-functional team of 5 developers; achieved 4.6/5 App Store rating with 95% crash-free rate`,
          rating: 5,
          improvements: ['Strong action verb: "Led"', 'Quantified impact: 10,000+ users, 30% efficiency', 'Added specifics: Team size (5), platforms', 'Clear outcome: App Store rating, crash-free rate']
        },
        {
          text: `Designed and built 3 high-performing mobile applications (2 Android, 1 iOS) with 10,000+ downloads; led team of 5 in implementing reusable Java architecture; optimized app performance achieving 4.6/5 rating and 95% crash-free sessions`,
          rating: 5,
          improvements: ['"high-performing" emphasis', 'Downloads metric', 'Performance optimization highlighted', 'Production stability metrics']
        },
        {
          text: `Spearheaded mobile app development initiative delivering 3 applications to 10,000+ users across Android and iOS platforms; established reusable Java framework reducing development time by 30%; coordinated 5-member team`,
          rating: 5,
          improvements: ['Executive-level verb: "Spearheaded"', 'Initiative framing shows leadership', 'Framework establishment', 'Team coordination emphasized']
        }
      ];
      onUpdate({ suggestions: mockSuggestions });
      setShowSuggestions(true);
      setGenerating(false);
    }, 2000);
  };

  const handleApply = () => {
    if (bullet.suggestions?.[currentSuggestionIndex]) {
      const selected = bullet.suggestions[currentSuggestionIndex];
      onUpdate({
        current_text: selected.text,
        rating_after: selected.rating,
        is_enhanced: true
      });
      setShowSuggestions(false);
    }
  };

  if (bullet.is_enhanced) {
    return (
      <div className="rounded-lg border-2 p-5 bg-success/5 border-success">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success" />
            <span className="text-success font-semibold">Enhanced</span>
          </div>
          <span className="text-lg text-success">⭐⭐⭐⭐⭐</span>
        </div>
        <p className="text-gray-800 leading-relaxed">{bullet.current_text}</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onUpdate({ is_enhanced: false })}
            className="text-sm text-gray-600 hover:text-primary"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 p-5 bg-gray-50 border-gray-200">
      <textarea
        value={bullet.current_text}
        onChange={(e) => onUpdate({ current_text: e.target.value })}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:border-purple-600 focus:outline-none mb-3"
        rows={3}
      />

      <div className="mb-4">
        <span className="text-lg font-semibold text-amber-600">
          {'⭐'.repeat(bullet.rating_before)}{'☆'.repeat(5 - bullet.rating_before)} ({bullet.rating_before}/5)
        </span>
      </div>

      {bullet.issues?.length > 0 && (
        <div className="bg-error/10 border-l-4 border-error rounded p-3 mb-4">
          <p className="text-sm font-semibold text-error mb-2">Issues:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            {bullet.issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-error">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!showSuggestions ? (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {generating ? 'Generating...' : 'Generate with AI'}
        </button>
      ) : (
        <div className="bg-success/10 border-2 border-success rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Suggestion {currentSuggestionIndex + 1} of {bullet.suggestions?.length || 0}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentSuggestionIndex(Math.max(0, currentSuggestionIndex - 1))}
                disabled={currentSuggestionIndex === 0}
                className="p-1 text-gray-600 hover:text-primary disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSuggestionIndex(Math.min((bullet.suggestions?.length || 1) - 1, currentSuggestionIndex + 1))}
                disabled={currentSuggestionIndex >= (bullet.suggestions?.length || 1) - 1}
                className="p-1 text-gray-600 hover:text-primary disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {bullet.suggestions?.[currentSuggestionIndex] && (
            <>
              <div className="bg-white rounded-lg p-4 mb-3 border border-success">
                <p className="text-gray-800 leading-relaxed">{bullet.suggestions[currentSuggestionIndex].text}</p>
              </div>

              <div className="mb-3">
                <span className="text-lg font-semibold text-success">⭐⭐⭐⭐⭐ (5/5)</span>
              </div>

              <div className="bg-white rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-success mb-2">Improvements:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {bullet.suggestions[currentSuggestionIndex].improvements.map((imp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-success flex-shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-success text-white px-4 py-2 rounded-lg font-semibold hover:bg-success/90"
                >
                  Apply This Version
                </button>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Keep Original
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
