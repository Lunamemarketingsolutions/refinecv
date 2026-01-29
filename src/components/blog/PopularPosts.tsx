import { Link } from 'react-router-dom';
import { Flame, Calendar, Clock } from 'lucide-react';
import type { BlogArticle } from '../../types/blog';

interface PopularPostsProps {
  articles: BlogArticle[];
}

export default function PopularPosts({ articles }: PopularPostsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[#F59E0B]" />
        <h3 className="text-lg font-bold text-[#0F1C2A]">Most Popular This Week</h3>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            to={`/blog/${article.slug}`}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
          >
            <div
              className="w-20 h-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#2762ea] to-[#1e4fc4]"
              style={{
                backgroundImage: article.featured_image_url ? `url(${article.featured_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#0F1C2A] text-sm leading-tight mb-2 line-clamp-2">
                {article.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.published_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.read_time} min</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
