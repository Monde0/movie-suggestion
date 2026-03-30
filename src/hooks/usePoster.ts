import { useEffect, useState } from 'react';
import { fetchPosterUrl } from '../services/tmdb';
import type { Movie } from '../types';

export function usePoster(movie: Movie): string | null {
  const [url, setUrl] = useState<string | null>(() => {
    try {
      const cache = JSON.parse(localStorage.getItem('cinematch-posters') ?? '{}');
      return cache[movie.id] || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    fetchPosterUrl(movie.id, movie.title, movie.year).then((result) => {
      if (!cancelled) setUrl(result);
    });
    return () => { cancelled = true; };
  }, [movie.id, movie.title, movie.year]);

  return url;
}
