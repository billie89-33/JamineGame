export interface GameResponseDto {
  id: string;
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: Date | string;
  platforms?: string[];
  downloadLinks?: string;
  systemRequirements?: string;
  rating?: number;
  categoryId?: string;
  category?: { id: string; name: string; slug: string };
  tags: string[];
  authorId: string;
  author?: { id: string; username: string };
  isFeatured: boolean;
  publishedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateGameDto {
  title: string;
  description?: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: Date | string;
  platforms?: string[];
  downloadLinks?: string;
  systemRequirements?: string;
  rating?: number;
  categoryId?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface UpdateGameDto extends Partial<CreateGameDto> {}
