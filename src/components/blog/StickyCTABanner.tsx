import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StickyCTABanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('blog-cta-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('blog-cta-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-[#2762ea] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-white flex-shrink-0 hidden sm:block" />
            <p className="text-white text-sm sm:text-base font-medium truncate">
              Want a job-winning CV? Analyze yours for free with our AI-powered tools
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/signup"
              className="bg-white text-[#2762ea] px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Analyze My CV Free →
            </Link>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
