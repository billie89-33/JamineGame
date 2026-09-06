export interface Author {
  username?: string;
  name?: string;
  avatar?: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
  category?: string | ArticleCategory;
  categoryId?: string;
  tags?: string[];
  author?: Author;
  authorId?: string;
  publishedAt?: string;
  readTime?: number | string;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
