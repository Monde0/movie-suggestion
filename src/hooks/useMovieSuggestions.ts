import { useMemo } from 'react';
import { movies } from '../data/movies';
import { useAppStore } from '../store/useAppStore';
import type { ScoredMovie } from '../types';
import { buildWeightMap, scoreMovie } from '../utils/preferenceEngine';

export function useMovieSuggestions(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);

  return useMemo(() => {
    const weightMap = buildWeightMap(preferences.genreWeights);
    return movies
      .filter((m) =>
        !preferences.dislikedMovieIds.includes(m.id) &&
        !preferences.likedMovieIds.includes(m.id)
      )
      .map((m) => ({ ...m, score: scoreMovie(m, weightMap, preferences) }))
      .sort((a, b) => b.score - a.score);
  }, [preferences]);
}

export function useWatchLaterMovies(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);

  return useMemo(() => {
    return movies
      .filter((m) => preferences.watchLaterIds.includes(m.id))
      .map((m) => ({ ...m, score: 0 }));
  }, [preferences.watchLaterIds]);
}

export function useLikedMovies(): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);

  return useMemo(() => {
    return movies
      .filter((m) => preferences.likedMovieIds.includes(m.id))
      .map((m) => ({ ...m, score: 0 }));
  }, [preferences.likedMovieIds]);
}

export function useSimilarLikedMovies(movieId: string): ScoredMovie[] {
  const preferences = useAppStore((s) => s.preferences);

  return useMemo(() => {
    const current = movies.find((m) => m.id === movieId);
    if (!current || preferences.likedMovieIds.length === 0) return [];

    return movies
      .filter((m) => preferences.likedMovieIds.includes(m.id))
      .map((m) => {
        const sharedGenres = m.genres.filter((g) => current.genres.includes(g)).length;
        return { ...m, score: sharedGenres };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, 3);
  }, [movieId, preferences.likedMovieIds]);
}
