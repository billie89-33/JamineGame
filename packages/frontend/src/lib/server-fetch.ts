import { API_URL } from './config';

interface ServerFetchOptions {
  revalidate?: number | false;
  cache?: RequestCache;
  timeoutMs?: number;
}

/**
 * Fetch JSON from the backend API in Next.js Server Components with a bounded
 * timeout and safe fallback so slow/sleeping backends do not trigger Vercel 504s.
 */
export async function serverFetchJson<T>(
  path: string,
  { revalidate = 60, cache, timeoutMs = 5000 }: ServerFetchOptions = {},
): Promise<T | null> {
  try {
    const fetchOptions: RequestInit & { next?: { revalidate: number | false } } = {
      signal: AbortSignal.timeout(timeoutMs),
    };

    if (cache) {
      fetchOptions.cache = cache;
    } else {
      fetchOptions.next = { revalidate };
    }

    const res = await fetch(`${API_URL}${path}`, fetchOptions);
    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      throw error;
    }
    console.error(`Server fetch failed for ${path}:`, error);
    return null;
  }
}
