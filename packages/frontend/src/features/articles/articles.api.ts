import { API_URL } from '@/lib/config';
import { CreateArticleDto } from '@shared/dto';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  videoUrl?: string;
  category?: string;
  categoryId?: string;
  publishedAt?: string;
  tags?: string[];
}

export const articlesApi = {
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload/media`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Media upload failed');
    return response.json();
  },

  createArticle: async (data: CreateArticleDto) => {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },
  
  getArticles: async (page?: number, limit?: number) => {
    let url = `${API_URL}/articles`;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  getArticleById: async (id: string) => {
    const response = await fetch(`${API_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  },

  updateArticle: async (id: string, data: Partial<CreateArticleDto>) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  deleteArticle: async (id: string) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  }
};
