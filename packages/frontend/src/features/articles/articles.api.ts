import { API_URL } from '@/lib/config';
import { CreateArticleDto } from '@shared/dto';

export const articlesApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Image upload failed');
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
  
  getArticles: async () => {
    const response = await fetch(`${API_URL}/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  getArticleById: async (id: string) => {
    const response = await fetch(`${API_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  }
};
