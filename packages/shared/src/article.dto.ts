export enum ArticleType {
  NEWS = 'NEWS',
  GAME = 'GAME',
}

export class CreateArticleDto {
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string;
  heroImage?: string;
  videoUrl?: string;
  categoryId?: string;
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
  category?: {
    id: string;
    name: string;
    slug: string;
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
