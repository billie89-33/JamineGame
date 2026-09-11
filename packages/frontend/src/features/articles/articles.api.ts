import { API_URL } from '@/lib/config';
import { CreateArticleDto } from '@shared/dto';
import { getAuthHeaders } from '../auth/auth.api';
import { Article } from './types';

export type { Article };

export const articlesApi = {
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload/media`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.message || 'Media upload failed');
    }
    return response.json();
  },

  createArticle: async (data: CreateArticleDto) => {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },
  
  getArticles: async (
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    heroImage?: string,
    articleType?: string,
  ) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (heroImage) params.append('heroImage', heroImage);
    if (articleType) params.append('type', articleType);

    const query = params.toString();
    const url = `${API_URL}/articles${query ? `?${query}` : ''}`;
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  deleteArticle: async (id: string) => {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  }
};
