import { Folder, ChevronRight } from 'lucide-react';
import type { BlogCategory } from '../../types/blog';

interface CategoriesListProps {
  onCategoryClick: (category: BlogCategory | 'all') => void;
}

const categories: { label: string; value: BlogCategory; count: number }[] = [
  { label: 'Interview Tips', value: 'interview-tips', count: 42 },
  { label: 'CV Writing', value: 'cv-writing', count: 38 },
  { label: 'Career Advice', value: 'career-advice', count: 31 },
  { label: 'Success Stories', value: 'success-stories', count: 24 },
  { label: 'Tools & Features', value: 'tools', count: 15 },
  { label: 'MBA Resources', value: 'mba-resources', count: 28 },
];

export default function CategoriesList({ onCategoryClick }: CategoriesListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Folder className="w-5 h-5 text-[#2762ea]" />
        <h3 className="text-lg font-bold text-[#0F1C2A]">Browse by Category</h3>
      </div>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.value}>
            <button
              onClick={() => onCategoryClick(category.value)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-gray-700 group-hover:text-[#2762ea] transition-colors">
                {category.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">({category.count})</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2762ea] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
