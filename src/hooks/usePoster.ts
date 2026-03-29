import { useEffect, useState } from 'react';
import { fetchPosterUrl } from '../services/tmdb';

export function usePoster(imdbId: string): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    // Synchronously seed from cache on first render to avoid flash
    try {
      const cache = JSON.parse(localStorage.getItem('cinematch-posters') ?? '{}');
      return cache[imdbId] || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    fetchPosterUrl(imdbId).then((result) => {
      if (!cancelled) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [imdbId]);

  return url;
}
