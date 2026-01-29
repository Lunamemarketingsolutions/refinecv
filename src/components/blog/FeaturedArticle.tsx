import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Sparkles } from 'lucide-react';
import type { BlogArticle } from '../../types/blog';

interface FeaturedArticleProps {
  article: BlogArticle;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="bg-[#F7F7FE] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <Link
            to={`/blog/${article.slug}`}
            className="lg:col-span-3 block group overflow-hidden rounded-xl"
          >
            <div
              className="h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-[#2762ea] to-[#1e4fc4] rounded-xl transition-transform duration-300 group-hover:scale-105 flex items-center justify-center"
              style={{
                backgroundImage: article.featured_image_url ? `url(${article.featured_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!article.featured_image_url && (
                <Sparkles className="w-24 h-24 text-white opacity-50" />
              )}
            </div>
          </Link>

          <div className="lg:col-span-2 bg-white rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B] text-white text-xs font-bold uppercase px-3 py-1 rounded mb-4">
              <Sparkles className="w-3 h-3" />
              Featured Article
            </div>

            <Link to={`/blog/${article.slug}`} className="group">
              <h2 className="text-2xl font-bold text-[#0F1C2A] mb-4 leading-tight group-hover:text-[#2762ea] transition-colors">
                {article.title}
              </h2>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.published_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min read</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {article.excerpt}
            </p>

            <Link
              to={`/blog/${article.slug}`}
              className="block w-full bg-[#2762ea] text-white text-center font-semibold px-8 py-3 rounded-lg hover:bg-[#1e4fc4] transition-colors"
            >
              Read Full Article →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
