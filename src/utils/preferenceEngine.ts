import type { Genre, GenreWeight, Movie, UserPreferences } from '../types';
import { ALL_GENRES } from '../types';

const GENRE_MATCH_BONUS = 1.5;
const SEEN_PENALTY = 0.5;
const LIKE_DELTA = 0.15;
const DISLIKE_DELTA = 0.10;
const WEIGHT_MAX = 2.0;
const WEIGHT_MIN = 0.0;

export function buildInitialWeights(selectedGenres: Genre[]): GenreWeight[] {
  return ALL_GENRES.map((genre) => ({
    genre,
    weight: selectedGenres.includes(genre) ? 1.4 : 1.0,
  }));
}

export function buildWeightMap(weights: GenreWeight[]): Record<Genre, number> {
  return Object.fromEntries(weights.map((w) => [w.genre, w.weight])) as Record<Genre, number>;
}

export function scoreMovie(
  movie: Movie,
  weightMap: Record<Genre, number>,
  prefs: UserPreferences
): number {
  const genreScore = movie.genres.reduce(
    (sum, g) => sum + (weightMap[g] ?? 1.0) * GENRE_MATCH_BONUS,
    0
  );
  const seenPenalty = prefs.likedMovieIds.includes(movie.id) ? SEEN_PENALTY : 0;
  return movie.rating + genreScore - seenPenalty;
}

export function applyLike(weights: GenreWeight[], movie: Movie): GenreWeight[] {
  return weights.map((w) =>
    movie.genres.includes(w.genre)
      ? { ...w, weight: Math.min(WEIGHT_MAX, w.weight + LIKE_DELTA) }
      : w
  );
}

export function applyDislike(weights: GenreWeight[], movie: Movie): GenreWeight[] {
  return weights.map((w) =>
    movie.genres.includes(w.genre)
      ? { ...w, weight: Math.max(WEIGHT_MIN, w.weight - DISLIKE_DELTA) }
      : w
  );
}
