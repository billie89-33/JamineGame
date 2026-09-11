export enum ArticleType {
  NEWS = 'NEWS',
  REVIEW = 'REVIEW',
  GUIDE = 'GUIDE',
  FEATURE = 'FEATURE',
}

export class CreateArticleDto {
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string;
  heroImage?: string;
  videoUrl?: string;
  categoryId?: string;
  gameId?: string;
  tags!: string[];
  articleType?: ArticleType;
  isFeatured?: boolean;
}

export class ArticleResponseDto {
  id!: string;
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string | null;
  heroImage?: string | null;
  videoUrl?: string | null;
  categoryId?: string | null;
  gameId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  game?: {
    id: string;
    title: string;
  } | null;
  tags!: string[];
  articleType!: ArticleType;
  isFeatured!: boolean;
  authorId!: string;
  publishedAt!: Date | string;
  readTime?: string | null;
  commentsCount!: number;
  createdAt!: Date | string;
  updatedAt!: Date | string;
  author?: {
    username: string;
  };
}
