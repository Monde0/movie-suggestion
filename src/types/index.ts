export type Genre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Horror'
  | 'Sci-Fi'
  | 'Thriller'
  | 'Romance'
  | 'Animation'
  | 'Documentary'
  | 'Fantasy'
  | 'Crime'
  | 'Adventure';

export const ALL_GENRES: Genre[] = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller',
  'Romance', 'Animation', 'Documentary', 'Fantasy', 'Crime', 'Adventure',
];

export interface Movie {
  id: string;
  title: string;
  year: number;
  genres: Genre[];
  director: string;
  mainActor: string;
  description: string;
  posterColor: string; // Tailwind gradient classes
  rating: number;
  studio?: string; // canonical studio name, undefined = unknown
}

export type SortOption = 'relevance' | 'newest' | 'oldest' | 'rating';

export interface GenreWeight {
  genre: Genre;
  weight: number; // 0.0–2.0, 1.0 = neutral
}

export interface UserPreferences {
  selectedGenres: Genre[];
  genreWeights: GenreWeight[];
  likedMovieIds: string[];
  dislikedMovieIds: string[];
  watchLaterIds: string[];
  hasCompletedOnboarding: boolean;
}

export type MovieAction = 'like' | 'dislike' | 'watch-later';

export interface ScoredMovie extends Movie {
  score: number;
}
