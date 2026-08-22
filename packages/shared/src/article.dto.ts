export class CreateArticleDto {
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string;
  category!: string;
  tags!: string[];
}

export class ArticleResponseDto {
  id!: string;
  title!: string;
  excerpt!: string;
  content!: string;
  coverImage?: string | null;
  category!: string;
  tags!: string[];
  authorId!: string;
  publishedAt!: Date | string;
  readTime?: string | null;
  commentsCount!: number;
  createdAt!: Date | string;
  updatedAt!: Date | string;
}
