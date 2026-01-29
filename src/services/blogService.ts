import { supabase } from '../lib/supabase';
import type { BlogArticle, BlogCategoryData, NewsletterSubscriber, BlogCategory } from '../types/blog';

export const blogService = {
  async fetchFeaturedArticle(): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('is_featured', true)
      .order('published_date', { ascending: false })
      .maybeSingle();

    if (error) {
      console.error('Error fetching featured article:', error);
      return null;
    }

    return data;
  },

  async fetchArticles(
    page: number = 1,
    pageSize: number = 9,
    category?: BlogCategory | 'all',
    searchTerm?: string
  ): Promise<{ articles: BlogArticle[]; totalCount: number }> {
    let query = supabase
      .from('blog_articles')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (searchTerm && searchTerm.trim()) {
      query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,tags.cs.{"${searchTerm}"}`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return { articles: [], totalCount: 0 };
    }

    return {
      articles: data || [],
      totalCount: count || 0,
    };
  },

  async fetchPopularArticles(limit: number = 5): Promise<BlogArticle[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('is_popular', true)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular articles:', error);
      return [];
    }

    return data || [];
  },

  async fetchCategories(): Promise<BlogCategoryData[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  async incrementViewCount(articleId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_article_views', {
      article_id: articleId,
    });

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  },

  async subscribeToNewsletter(
    email: string,
    source: 'sidebar' | 'footer' | 'exit-intent'
  ): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source,
      });

    if (error) {
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
        };
      }
      console.error('Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for the free CV template.',
    };
  },

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }

    return data;
  },
};
