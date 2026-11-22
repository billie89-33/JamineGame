/**
 * Trigger Next.js on-demand ISR cache invalidation after admin mutations.
 * Runs best-effort in the browser so mutations never fail if revalidation is unavailable.
 */
export function triggerRevalidate(paths: string[]): void {
  if (typeof window === 'undefined' || paths.length === 0) {
    return;
  }

  fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths }),
  }).catch(() => {
    // Best-effort cache purge; ISR TTL will still refresh automatically
  });
}
