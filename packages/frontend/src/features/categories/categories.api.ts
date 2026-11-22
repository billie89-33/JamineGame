import { API_URL } from '@/lib/config';
import { triggerRevalidate } from '@/lib/revalidate';
import { getAuthHeaders } from '../auth/auth.api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/slug/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create category');
    const result = await response.json();
    triggerRevalidate(['/', '/games', '/news', '/sitemap.xml']);
    return result;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update category');
    const result = await response.json();
    triggerRevalidate(['/', '/games', '/news', '/sitemap.xml']);
    return result;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    triggerRevalidate(['/', '/games', '/news', '/sitemap.xml']);
  }
};
