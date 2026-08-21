export interface Author {
  name: string;
  avatar: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTime: string;
  commentsCount: number;
}
