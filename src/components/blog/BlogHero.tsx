import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function BlogHero() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#2762ea] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1C2A] mb-4">
          Career Resources & CV Tips
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          Expert advice on CVs, interviews, and career growth for MBA students and professionals
        </p>
      </div>
    </section>
  );
}
