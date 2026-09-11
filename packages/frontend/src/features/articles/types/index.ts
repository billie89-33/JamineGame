import { ArticleType } from '@shared/dto';
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
  heroImage?: string;
  videoUrl?: string;
  articleType?: ArticleType;
  category?: string | ArticleCategory;
  categoryId?: string;
  gameId?: string;
  game?: any;
  tags?: string[];
  isFeatured?: boolean;
  author?: Author;
  authorId?: string;
  publishedAt?: string;
  readTime?: number | string;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
