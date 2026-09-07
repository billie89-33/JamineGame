import { API_URL } from '@/lib/config';
import { getAuthHeaders } from '../auth/auth.api';

export interface Game {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  rating?: number;
  platforms?: string[];
  genres?: string[];
}

export interface FeaturedGameArticle {
  id: string;
  title: string;
  excerpt?: string;
  coverImage?: string | null;
  publishedAt?: string;
}

export interface FeaturedGame extends Game {
  articles: FeaturedGameArticle[];
}

interface GamesResponse<T> {
  success: boolean;
  data: T[];
}

export const gamesApi = {
  getGames: async (page?: number, limit?: number) => {
    let url = `${API_URL}/games`;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch games');
    return response.json();
  },

  getFeaturedGames: async (
    limit: number = 3,
    articlesLimit: number = 2,
  ): Promise<GamesResponse<FeaturedGame>> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      articlesLimit: articlesLimit.toString(),
    });
    const response = await fetch(`${API_URL}/games/featured?${params}`);
    if (!response.ok) throw new Error('Failed to fetch featured games');
    return response.json();
  },

  getGameById: async (slug: string) => {
    const response = await fetch(`${API_URL}/games/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch game');
    return response.json();
  },

  createGame: async (data: Partial<Game>) => {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create game');
    return response.json();
  },

  updateGame: async (id: string, data: Partial<Game>) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update game');
    return response.json();
  },

  deleteGame: async (id: string) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json();
  }
};
