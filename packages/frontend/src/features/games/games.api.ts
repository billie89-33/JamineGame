import { API_URL } from '@/lib/config';

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

  getGameById: async (slug: string) => {
    const response = await fetch(`${API_URL}/games/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch game');
    return response.json();
  },

  createGame: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create game');
    return response.json();
  },

  updateGame: async (id: string, data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update game');
    return response.json();
  },

  deleteGame: async (id: string) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json();
  }
};
