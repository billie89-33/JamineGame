export class CreateArticleDto {
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string;
  categoryId?: string;
  tags!: string[];
}

export class ArticleResponseDto {
  id!: string;
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string | null;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags!: string[];
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
