import { Link } from 'react-router-dom';
import { Rocket, Check } from 'lucide-react';

export default function ToolsCTA() {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Rocket className="w-5 h-5 text-[#2762ea]" />
        <h3 className="text-lg font-bold text-[#0F1C2A]">Ready to Optimize Your CV?</h3>
      </div>

      <p className="text-gray-700 text-sm mb-4">
        Try RefineCV's AI-powered tools:
      </p>

      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-2 text-gray-700 text-sm">
          <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          <span>ATS Analyzer</span>
        </li>
        <li className="flex items-center gap-2 text-gray-700 text-sm">
          <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          <span>JD CV Match</span>
        </li>
        <li className="flex items-center gap-2 text-gray-700 text-sm">
          <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          <span>CV Enhancer</span>
        </li>
        <li className="flex items-center gap-2 text-gray-700 text-sm">
          <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
          <span>Interview Me AI</span>
        </li>
      </ul>

      <Link
        to="/signup"
        className="block w-full bg-[#2762ea] text-white text-center font-semibold px-4 py-3 rounded-lg hover:bg-[#1e4fc4] transition-colors"
      >
        Get Started Free →
      </Link>
    </div>
  );
}
