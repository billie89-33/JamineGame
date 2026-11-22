import { API_URL } from './config';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
}

/**
 * Shared client-side API request helper that attaches auth headers, cookies,
 * JSON serialization, timeout, and consistent error extraction.
 */
export async function apiRequest<T>(
  path: string,
  { body, headers, timeoutMs = 15000, ...rest }: ApiRequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const mergedHeaders: Record<string, string> = {
    ...getAuthHeaders(),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: mergedHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message;
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
