import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StickyCTABanner from '../components/blog/StickyCTABanner';
import BlogHero from '../components/blog/BlogHero';
import FeaturedArticle from '../components/blog/FeaturedArticle';
import FilterBar from '../components/blog/FilterBar';
import SearchBar from '../components/blog/SearchBar';
import ArticleCard from '../components/blog/ArticleCard';
import CTACard from '../components/blog/CTACard';
import NewsletterSignup from '../components/blog/NewsletterSignup';
import PopularPosts from '../components/blog/PopularPosts';
import CategoriesList from '../components/blog/CategoriesList';
import ToolsCTA from '../components/blog/ToolsCTA';
import Pagination from '../components/blog/Pagination';
import FooterCTA from '../components/blog/FooterCTA';
import ExitIntentPopup from '../components/blog/ExitIntentPopup';
import { blogService } from '../services/blogService';
import type { BlogArticle, BlogCategory } from '../types/blog';

export default function Blog() {
  const [featuredArticle, setFeaturedArticle] = useState<BlogArticle | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<BlogArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExitPopup, setShowExitPopup] = useState(false);

  const pageSize = 9;

  useEffect(() => {
    loadFeaturedArticle();
    loadPopularArticles();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [currentPage, activeCategory, searchTerm]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        const popupShown = sessionStorage.getItem('exit-popup-shown');
        if (!popupShown) {
          setShowExitPopup(true);
          sessionStorage.setItem('exit-popup-shown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const loadFeaturedArticle = async () => {
    const article = await blogService.fetchFeaturedArticle();
    setFeaturedArticle(article);
  };

  const loadArticles = async () => {
    setLoading(true);
    const { articles: fetchedArticles, totalCount } = await blogService.fetchArticles(
      currentPage,
      pageSize,
      activeCategory,
      searchTerm
    );
    setArticles(fetchedArticles);
    setTotalArticles(totalCount);
    setTotalPages(Math.ceil(totalCount / pageSize));
    setLoading(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadPopularArticles = async () => {
    const popular = await blogService.fetchPopularArticles(5);
    setPopularArticles(popular);
  };

  const handleCategoryChange = (category: BlogCategory | 'all') => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderArticleGrid = () => {
    const items: JSX.Element[] = [];

    articles.forEach((article, index) => {
      items.push(
        <ArticleCard key={article.id} article={article} />
      );

      if ((index + 1) % 3 === 0 && index < articles.length - 1) {
        if (index === 2) {
          items.push(
            <CTACard key={`cta-lead-magnet-${index}`} type="lead-magnet" />
          );
        } else if (index === 5) {
          items.push(
            <CTACard key={`cta-jd-match-${index}`} type="jd-match" />
          );
        } else if (index === 8) {
          items.push(
            <CTACard key={`cta-interview-${index}`} type="interview-ai" />
          );
        }
      }
    });

    return items;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <StickyCTABanner />

      <main>
        <BlogHero />

        {featuredArticle && <FeaturedArticle article={featuredArticle} />}

        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FilterBar
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1C2A]">
                    Latest Articles
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing {articles.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0}-
                    {Math.min(currentPage * pageSize, totalArticles)} of {totalArticles} articles
                  </p>
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-xl mb-4" />
                        <div className="bg-gray-200 h-4 rounded mb-2" />
                        <div className="bg-gray-200 h-4 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      No articles found. Try adjusting your filters or search term.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                      {renderArticleGrid()}
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </div>

              <aside className="lg:col-span-4 mt-12 lg:mt-0">
                <div className="sticky top-24 space-y-8">
                  <NewsletterSignup source="sidebar" />
                  <PopularPosts articles={popularArticles} />
                  <CategoriesList onCategoryClick={handleCategoryChange} />
                  <ToolsCTA />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <FooterCTA />
      </main>

      <Footer />

      <ExitIntentPopup
        isOpen={showExitPopup}
        onClose={() => setShowExitPopup(false)}
      />
    </div>
  );
}
