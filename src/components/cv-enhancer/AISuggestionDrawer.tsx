import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Send, Loader2, Sparkles } from 'lucide-react';
import { generateBulletSuggestions } from '../../services/bulletEnhancementService';

interface Suggestion {
  text: string;
  rating: number;
  improvements: string[];
  type?: string;
  reasoning?: string;
}

interface AISuggestionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bulletText: string;
  section: string;
  onApplySuggestion: (suggestion: string) => void;
}

export default function AISuggestionDrawer({
  isOpen,
  onClose,
  bulletText,
  section,
  onApplySuggestion,
}: AISuggestionDrawerProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  
  // Track previous bulletText and section to detect changes
  const prevBulletTextRef = useRef<string>('');
  const prevSectionRef = useRef<string>('');

  // Reset drawer state when bulletText or section changes (new CV point selected)
  useEffect(() => {
    if (isOpen && (bulletText !== prevBulletTextRef.current || section !== prevSectionRef.current)) {
      // Reset all state for the new bullet point
      setSuggestions([]);
      setChatMessages([]);
      setChatInput('');
      setCurrentSuggestionIndex(0);
      setIsGenerating(false);
      setIsChatLoading(false);
      
      // Update refs
      prevBulletTextRef.current = bulletText;
      prevSectionRef.current = section;
    }
  }, [isOpen, bulletText, section]);

  // Also reset when drawer closes
  useEffect(() => {
    if (!isOpen) {
      // Reset state when drawer closes
      setSuggestions([]);
      setChatMessages([]);
      setChatInput('');
      setCurrentSuggestionIndex(0);
      setIsGenerating(false);
      setIsChatLoading(false);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!bulletText.trim()) {
      alert('Please enter some text to generate suggestions');
      return;
    }
    setIsGenerating(true);
    try {
      console.log('Generating suggestions for:', { bulletText, section });
      const result = await generateBulletSuggestions(bulletText, section);
      console.log('Suggestions received:', result);
      setSuggestions(result.suggestions || []);
      setCurrentSuggestionIndex(0);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions. Please try again.';
      console.error('Full error details:', error);
      alert(`Failed to generate suggestions: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Call AI with user prompt
      console.log('Chat request:', { bulletText, section, userMessage });
      const result = await generateBulletSuggestions(bulletText, section, userMessage);
      console.log('Chat response:', result);
      const aiResponse = result.suggestions?.[0]?.text || 'I can help you improve this bullet point.';
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Full error details:', error);
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Sorry, I encountered an error: ${errorMessage}. Please check the console for details.` 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#0F1C2A]" style={{ fontFamily: 'Lato, sans-serif' }}>
              AI Suggestions
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {bulletText && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-1">Current CV Point ({section}):</p>
              <p className="text-sm text-gray-700 line-clamp-2">{bulletText}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Generate Button */}
          {suggestions.length === 0 && !isGenerating && (
            <div className="text-center py-8">
              <button
                onClick={handleGenerate}
                className="bg-[#2782EA] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e6bc7] transition-colors flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                Generate Suggestions
              </button>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#2782EA] mx-auto mb-4" />
              <p className="text-gray-600">Generating AI suggestions...</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0F1C2A]">
                  Suggestion {currentSuggestionIndex + 1} of {suggestions.length}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentSuggestionIndex(Math.max(0, currentSuggestionIndex - 1))}
                    disabled={currentSuggestionIndex === 0}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentSuggestionIndex(Math.min(suggestions.length - 1, currentSuggestionIndex + 1))}
                    disabled={currentSuggestionIndex >= suggestions.length - 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>

              {suggestions[currentSuggestionIndex] && (
                <div className="bg-blue-50 border-2 border-[#2782EA] rounded-xl p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        Strong & High-Impact
                      </span>
                      {suggestions[currentSuggestionIndex].type && (
                        <p className="text-sm text-gray-600 mt-1">
                          {suggestions[currentSuggestionIndex].type}
                        </p>
                      )}
                    </div>
                    <div className="text-2xl">
                      {'⭐'.repeat(suggestions[currentSuggestionIndex].rating)}
                    </div>
                  </div>
                  
                  <p className="text-[#0F1C2A] mb-4 leading-relaxed">
                    {suggestions[currentSuggestionIndex].text}
                  </p>

                  {suggestions[currentSuggestionIndex].reasoning && (
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Why this is better:</p>
                      <p className="text-sm text-gray-600">
                        {suggestions[currentSuggestionIndex].reasoning}
                      </p>
                    </div>
                  )}

                  {suggestions[currentSuggestionIndex].improvements && suggestions[currentSuggestionIndex].improvements.length > 0 && (
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Improvements:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {suggestions[currentSuggestionIndex].improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => onApplySuggestion(suggestions[currentSuggestionIndex].text)}
                    className="w-full bg-[#2782EA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e6bc7] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Insert This Suggestion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-[#0F1C2A] mb-4">Chat with AI</h3>
            
            {/* Chat Messages */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-[#2782EA] text-white'
                        : 'bg-gray-100 text-[#0F1C2A]'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2782EA]" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tell me what you want to improve..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2782EA]"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-[#2782EA] text-white px-6 py-2 rounded-lg hover:bg-[#1e6bc7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

