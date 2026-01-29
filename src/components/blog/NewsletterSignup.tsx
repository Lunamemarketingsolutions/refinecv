import { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { blogService } from '../../services/blogService';

interface NewsletterSignupProps {
  source: 'sidebar' | 'footer' | 'exit-intent';
}

export default function NewsletterSignup({ source }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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

    const result = await blogService.subscribeToNewsletter(email, source);

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.message);
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <div className="bg-[#2762ea] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-white" />
        <h3 className="text-lg font-bold text-white">Get Weekly CV & Career Tips</h3>
      </div>

      <p className="text-white/90 text-sm mb-4">Join 10,000+ MBA students</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2.5 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
          disabled={status === 'loading'}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-white text-[#2762ea] font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-3 flex items-start gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <p className="text-white text-sm">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 flex items-start gap-2 bg-red-500/20 backdrop-blur-sm rounded-lg p-3">
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <p className="text-white text-sm">{message}</p>
        </div>
      )}

      <ul className="mt-4 space-y-2 text-white/90 text-sm">
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Free CV template on signup</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Exclusive interview tips</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Unsubscribe anytime</span>
        </li>
      </ul>
    </div>
  );
}
