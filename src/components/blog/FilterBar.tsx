import type { BlogCategory } from '../../types/blog';

interface FilterBarProps {
  activeCategory: BlogCategory | 'all';
  onCategoryChange: (category: BlogCategory | 'all') => void;
}

const categories: { label: string; value: BlogCategory | 'all' }[] = [
  { label: 'All Articles', value: 'all' },
  { label: 'Interview Tips', value: 'interview-tips' },
  { label: 'CV Writing', value: 'cv-writing' },
  { label: 'Career Advice', value: 'career-advice' },
  { label: 'Success Stories', value: 'success-stories' },
  { label: 'Tools & Features', value: 'tools' },
  { label: 'MBA Resources', value: 'mba-resources' },
];

export default function FilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === category.value
                ? 'bg-[#2762ea] text-white shadow-md'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#2762ea] hover:text-[#2762ea]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
