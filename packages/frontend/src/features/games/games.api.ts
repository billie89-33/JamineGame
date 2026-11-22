import { API_URL } from '@/lib/config';
import { triggerRevalidate } from '@/lib/revalidate';
import { getAuthHeaders } from '../auth/auth.api';
import { GameResponseDto, CreateGameDto, UpdateGameDto, PaginatedResponseDto } from '@shared/dto';

export const gamesApi = {
  getGames: async (page = 1, limit = 10, search?: string, category?: string, isFeatured?: boolean): Promise<PaginatedResponseDto<GameResponseDto>> => {
    let url = `${API_URL}/games?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (isFeatured !== undefined) url += `&isFeatured=${isFeatured}`;
    
    const response = await fetch(url, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch games');
    return response.json();
  },

  getGameById: async (id: string): Promise<GameResponseDto> => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch game details');
    return response.json();
  },

  createGame: async (data: CreateGameDto): Promise<GameResponseDto> => {
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
    const result = await response.json();
    triggerRevalidate(['/', '/games', '/sitemap.xml']);
    return result;
  },

  updateGame: async (id: string, data: UpdateGameDto): Promise<GameResponseDto> => {
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
    const result = await response.json();
    triggerRevalidate(['/', '/games', `/games/${id}`, '/sitemap.xml']);
    return result;
  },

  deleteGame: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/games/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete game');
    triggerRevalidate(['/', '/games', `/games/${id}`, '/sitemap.xml']);
  }
};
