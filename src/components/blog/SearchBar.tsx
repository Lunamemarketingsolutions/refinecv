import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles... (e.g., 'ATS tips', 'interview questions')"
          className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-[#2762ea] focus:outline-none transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2762ea]" />
      </div>
    </div>
  );
}
