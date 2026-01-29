export type BlogCategory =
  | 'interview-tips'
  | 'cv-writing'
  | 'career-advice'
  | 'success-stories'
  | 'tools'
  | 'mba-resources';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: BlogCategory;
  author_name: string;
  author_avatar_url?: string;
  published_date: string;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_popular: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryData {
  id: string;
  name: string;
  slug: string;
  article_count: number;
  display_order: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  source: 'sidebar' | 'footer' | 'exit-intent';
  subscribed_at?: string;
  is_active?: boolean;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalArticles: number;
}

export interface FilterState {
  category: BlogCategory | 'all';
  searchTerm: string;
}
