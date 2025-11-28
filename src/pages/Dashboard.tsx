import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Target, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <span className="text-xl font-black text-secondary">RefineCV</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Logged in as: <span className="font-semibold">{user?.email}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-primary transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">ATS Analyzer</h3>
            <p className="text-gray-600 mb-4">
              See exactly what ATS systems read from your CV
            </p>
            <a
              href="/features/ats-analyzer"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Start Analysis →
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-primary transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">JD CV Matcher</h3>
            <p className="text-gray-600 mb-4">
              Match your CV against job descriptions
            </p>
            <a
              href="/features/jd-matcher"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Start Matching →
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-primary transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">CV Enhancer</h3>
            <p className="text-gray-600 mb-4">
              Transform weak bullets into 5-star achievements
            </p>
            <a
              href="/features/cv-enhancer"
              className="inline-flex items-center text-primary font-semibold hover:underline"
            >
              Start Enhancing →
            </a>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-3">Ready to transform your CV?</h2>
          <p className="text-white/90 mb-6">
            Choose a tool above to start analyzing and enhancing your CV for better job opportunities.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>5,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>90% ATS pass rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>30-second enhancements</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
