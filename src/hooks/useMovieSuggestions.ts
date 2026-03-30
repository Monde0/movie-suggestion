import { useMemo } from 'react';
import { movies as staticMovies } from '../data/movies';
import { useAppStore } from '../store/useAppStore';
import type { ScoredMovie } from '../types';
import { buildWeightMap, scoreMovie } from '../utils/preferenceEngine';

/** Merges the static 100-film seed with any movies fetched from Wikidata, deduplicating by id. */
export function useAllMovies() {
  const dynamicMovies = useAppStore((s) => s.dynamicMovies);
  return useMemo(() => {
    const seen = new Set(staticMovies.map((m) => m.id));
    const extra = dynamicMovies.filter((m) => !seen.has(m.id));
    return [...staticMovies, ...extra];
  }, [dynamicMovies]);
}

export function useMovieSuggestions(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);
  const allMovies = useAllMovies();

  return useMemo(() => {
    const weightMap = buildWeightMap(preferences.genreWeights);
    return allMovies
      .filter((m) =>
        !preferences.dislikedMovieIds.includes(m.id) &&
        !preferences.likedMovieIds.includes(m.id)
      )
      .map((m) => ({ ...m, score: scoreMovie(m, weightMap, preferences) }))
      .sort((a, b) => b.score - a.score);
  }, [preferences, allMovies]);
}

export function useWatchLaterMovies(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);
  const allMovies = useAllMovies();

  return useMemo(
    () => allMovies
      .filter((m) => preferences.watchLaterIds.includes(m.id))
      .map((m) => ({ ...m, score: 0 })),
    [preferences.watchLaterIds, allMovies]
  );
}

export function useLikedMovies(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);
  const allMovies = useAllMovies();

  return useMemo(
    () => allMovies
      .filter((m) => preferences.likedMovieIds.includes(m.id))
      .map((m) => ({ ...m, score: 0 })),
    [preferences.likedMovieIds, allMovies]
  );
}

export function useSimilarLikedMovies(movieId: string): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);
  const allMovies = useAllMovies();

  return useMemo(() => {
    const current = allMovies.find((m) => m.id === movieId);
    if (!current || preferences.likedMovieIds.length === 0) return [];

    return allMovies
      .filter((m) => preferences.likedMovieIds.includes(m.id))
      .map((m) => {
        const sharedGenres = m.genres.filter((g) => current.genres.includes(g)).length;
        return { ...m, score: sharedGenres };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, 3);
  }, [movieId, preferences.likedMovieIds, allMovies]);
}
