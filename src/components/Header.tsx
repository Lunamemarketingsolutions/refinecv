import { useState, useEffect, useRef } from 'react';
import { Menu, X, FileText, ChevronDown, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const closeTimeoutRef = useRef<number | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsFeaturesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsFeaturesOpen(false);
    }, 200);
  };

  return (
    <header className={`fixed top-0 w-full z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-2xl font-black text-secondary">RefineCV</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={`text-secondary hover:text-primary transition-colors font-semibold ${location.pathname === '/' ? 'border-b-2 border-primary' : ''}`}>Home</Link>
            <Link to="/about" className={`text-secondary hover:text-primary transition-colors font-semibold ${location.pathname === '/about' ? 'border-b-2 border-primary' : ''}`}>About Us</Link>
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-secondary hover:text-primary transition-colors font-semibold"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Features <ChevronDown className="w-4 h-4" />
              </button>
              {isFeaturesOpen && (
                <div
                  className="absolute top-full left-0 pt-2 -mt-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="w-56 bg-white rounded-lg shadow-lg py-2">
                    <Link to="/features/ats-analyzer" className="block px-4 py-2 text-secondary hover:bg-background hover:text-primary transition-colors">ATS Analyzer</Link>
                    <Link to="/features/jd-matcher" className="block px-4 py-2 text-secondary hover:bg-background hover:text-primary transition-colors">JD CV Match Analyzer</Link>
                    <Link to="/features/cv-enhancer" className="block px-4 py-2 text-secondary hover:bg-background hover:text-primary transition-colors">Instant CV Enhancer</Link>
                    <Link to="/features/interview-ai" className="block px-4 py-2 text-secondary hover:bg-background hover:text-primary transition-colors">Interview Me AI</Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/pricing" className={`text-secondary hover:text-primary transition-colors font-semibold ${location.pathname === '/pricing' ? 'border-b-2 border-primary' : ''}`}>Pricing</Link>
            <Link to="/contact" className={`text-secondary hover:text-primary transition-colors font-semibold ${location.pathname === '/contact' ? 'border-b-2 border-primary' : ''}`}>Contact Us</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors font-semibold">Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-secondary hover:text-primary transition-colors font-semibold">Login</Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:scale-105 hover:shadow-lg transition-all"
                  data-cta="header-get-started"
                >
                  {location.pathname === '/features/ats-analyzer' ? 'Analyze My CV' : location.pathname === '/features/jd-matcher' ? 'Match My CV' : location.pathname === '/features/cv-enhancer' ? 'Enhance My CV' : location.pathname === '/features/interview-ai' ? 'Start Practicing' : 'Get Started'}
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-3">
            <Link to="/" className={`block text-secondary hover:text-primary font-semibold ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
            <Link to="/about" className={`block text-secondary hover:text-primary font-semibold ${location.pathname === '/about' ? 'text-primary' : ''}`}>About Us</Link>
            <div className="space-y-2">
              <button
                className="flex items-center justify-between w-full text-secondary hover:text-primary font-semibold"
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
              >
                Features <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFeaturesOpen && (
                <div className="pl-4 space-y-2">
                  <Link to="/features/ats-analyzer" className="block text-secondary hover:text-primary">ATS Analyzer</Link>
                  <Link to="/features/jd-matcher" className="block text-secondary hover:text-primary">JD CV Match Analyzer</Link>
                  <Link to="/features/cv-enhancer" className="block text-secondary hover:text-primary">Instant CV Enhancer</Link>
                  <Link to="/features/interview-ai" className="block text-secondary hover:text-primary">Interview Me AI</Link>
                </div>
              )}
            </div>
            <Link to="/pricing" className={`block text-secondary hover:text-primary font-semibold ${location.pathname === '/pricing' ? 'text-primary' : ''}`}>Pricing</Link>
            <Link to="/contact" className={`block text-secondary hover:text-primary font-semibold ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact Us</Link>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-secondary hover:text-primary font-semibold">Dashboard</Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-secondary hover:text-primary font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-secondary hover:text-primary font-semibold">Login</Link>
                  <Link
                    to="/signup"
                    className="block bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-center"
                    data-cta="mobile-header-get-started"
                  >
                    {location.pathname === '/features/ats-analyzer' ? 'Analyze My CV' : location.pathname === '/features/jd-matcher' ? 'Match My CV' : location.pathname === '/features/cv-enhancer' ? 'Enhance My CV' : location.pathname === '/features/interview-ai' ? 'Start Practicing' : 'Get Started'}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
