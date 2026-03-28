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
      .filter((m) => !preferences.dislikedMovieIds.includes(m.id))
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
