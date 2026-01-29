import { useState, useEffect } from 'react';
import { X, Download, Check, AlertCircle } from 'lucide-react';
import { blogService } from '../../services/blogService';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitIntentPopup({ isOpen, onClose }: ExitIntentPopupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setStatus('idle');
      setMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    const result = await blogService.subscribeToNewsletter(email, 'exit-intent');

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 3000);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 sm:p-12 animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-[#2762ea]/10 rounded-full mx-auto mb-6">
          <Download className="w-8 h-8 text-[#2762ea]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1C2A] text-center mb-4">
          Wait! Before You Go...
        </h2>

        <p className="text-xl text-gray-700 text-center mb-6">
          Download Our Free CV Template
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
            <span>ATS-optimized format</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
            <span>Used by 5,000+ MBA students</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
            <span>Includes cover letter template</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
            <span>Instant download (no signup required)</span>
          </li>
        </ul>

        {status === 'success' ? (
          <div className="bg-[#10B981]/10 border border-[#10B981] rounded-lg p-4 flex items-start gap-3">
            <Check className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#10B981] font-semibold mb-1">Success!</p>
              <p className="text-gray-700 text-sm">{message}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2762ea] focus:outline-none transition-colors"
              disabled={status === 'loading'}
            />

            {status === 'error' && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#2762ea] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1e4fc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Processing...' : 'Download Free Template →'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
