export class CreateArticleDto {
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string;
  videoUrl?: string;
  categoryId?: string;
  gameId?: string;
  tags!: string[];
  isFeatured?: boolean;
}

export class ArticleResponseDto {
  id!: string;
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string | null;
  videoUrl?: string | null;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  gameId?: string | null;
  game?: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
  } | null;
  tags!: string[];
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
