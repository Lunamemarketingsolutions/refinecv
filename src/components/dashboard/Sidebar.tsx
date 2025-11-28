import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Eye, Target, Sparkles, FileText, Clock } from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    plan: 'free' | 'premium';
    email?: string;
  };
  usageToday?: {
    total: number;
    limit: number;
  };
}

export default function Sidebar({ user, usageToday }: SidebarProps) {
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Eye, label: 'ATS Analyzer', path: '/ats-tool' },
    { icon: Target, label: 'JD CV Match', path: '/jd-match-tool' },
    { icon: Sparkles, label: 'CV Enhancer', path: '/cv-enhancer' },
    { icon: FileText, label: 'My CVs', path: '/my-cvs', divider: true },
    { icon: Clock, label: 'History', path: '/history' },
  ];

  const isActive = (path: string) => {
    if (path === '/ats-tool') {
      return location.pathname.startsWith('/ats-tool');
    }
    if (path === '/jd-match-tool') {
      return location.pathname.startsWith('/jd-match-tool');
    }
    if (path === '/cv-enhancer') {
      return location.pathname.startsWith('/cv-enhancer');
    }
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-secondary flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <span className="text-xl font-black text-white">RefineCV</span>
        </Link>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{getInitials(user.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                  user.plan === 'premium'
                    ? 'bg-primary text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {user.plan === 'premium' ? 'Premium' : 'Free'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {navItems.map((item, index) => (
          <div key={item.path}>
            {item.divider && <div className="h-px bg-white/10 my-2" />}
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                isActive(item.path)
                  ? 'bg-primary text-white border-l-4 border-primary'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </div>
        ))}
      </nav>

      {usageToday && user.plan === 'free' && (
        <div className="p-4 m-4 bg-error/10 border-2 border-error/20 rounded-lg">
          <p className="text-white text-sm font-semibold mb-2">Daily Limit</p>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>{usageToday.total}/{usageToday.limit} analyses used</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-error transition-all"
                style={{ width: `${(usageToday.total / usageToday.limit) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-white/80 text-xs mb-3">
            {usageToday.limit - usageToday.total} remaining
          </p>
          <Link
            to="/pricing"
            className="block w-full bg-primary text-white text-center px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      {user.plan === 'premium' && (
        <div className="p-4 m-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
          <div className="text-2xl mb-2">👑</div>
          <p className="text-white text-sm font-semibold mb-1">Premium Active</p>
          <p className="text-white/80 text-xs">Unlimited analyses</p>
        </div>
      )}
    </aside>
  );
}
