import { API_URL } from '@/lib/config';

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  }
};
