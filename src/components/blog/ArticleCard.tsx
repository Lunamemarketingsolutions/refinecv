import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import type { BlogArticle } from '../../types/blog';

interface ArticleCardProps {
  article: BlogArticle;
}

const categoryLabels: Record<string, string> = {
  'interview-tips': 'INTERVIEW TIPS',
  'cv-writing': 'CV WRITING',
  'career-advice': 'CAREER ADVICE',
  'success-stories': 'SUCCESS STORIES',
  'tools': 'TOOLS & FEATURES',
  'mba-resources': 'MBA RESOURCES',
};

const categoryColors: Record<string, string> = {
  'interview-tips': 'bg-[#2762ea]',
  'cv-writing': 'bg-[#10B981]',
  'career-advice': 'bg-[#8B5CF6]',
  'success-stories': 'bg-[#F59E0B]',
  'tools': 'bg-[#2762ea]',
  'mba-resources': 'bg-[#0F1C2A]',
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      <Link to={`/blog/${article.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <div
            className="w-full h-full bg-gradient-to-br from-[#2762ea] to-[#1e4fc4] group-hover:opacity-90 transition-opacity"
            style={{
              backgroundImage: article.featured_image_url ? `url(${article.featured_image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={`absolute top-3 left-3 ${categoryColors[article.category]} text-white text-xs font-bold uppercase px-3 py-1 rounded`}>
            {categoryLabels[article.category]}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.published_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{article.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.read_time} min read</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#0F1C2A] mb-3 leading-tight group-hover:text-[#2762ea] transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#f0f4ff] text-[#2762ea] text-xs px-2.5 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center text-[#2762ea] font-medium group-hover:gap-2 transition-all">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
}
