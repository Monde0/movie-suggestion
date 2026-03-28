import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Genre, Movie, MovieAction, UserPreferences } from '../types';
import { applyDislike, applyLike, buildInitialWeights } from '../utils/preferenceEngine';

interface AppState {
  preferences: UserPreferences;
  activeMovie: Movie | null;
  currentView: 'onboarding' | 'feed' | 'watchlater';

  completeOnboarding: (genres: Genre[]) => void;
  applyMovieAction: (movie: Movie, action: MovieAction) => void;
  openMovie: (movie: Movie) => void;
  closeMovie: () => void;
  setView: (view: 'feed' | 'watchlater') => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  selectedGenres: [],
  genreWeights: [],
  likedMovieIds: [],
  dislikedMovieIds: [],
  watchLaterIds: [],
  hasCompletedOnboarding: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      activeMovie: null,
      currentView: 'onboarding',

      completeOnboarding: (genres) => {
        set({
          preferences: {
            ...defaultPreferences,
            selectedGenres: genres,
            genreWeights: buildInitialWeights(genres),
            hasCompletedOnboarding: true,
          },
          currentView: 'feed',
        });
      },

      applyMovieAction: (movie, action) => {
        const prefs = get().preferences;

        if (action === 'like') {
          const isAlreadyLiked = prefs.likedMovieIds.includes(movie.id);
          set({
            preferences: {
              ...prefs,
              likedMovieIds: isAlreadyLiked
                ? prefs.likedMovieIds.filter((id) => id !== movie.id)
                : [...prefs.likedMovieIds, movie.id],
              dislikedMovieIds: prefs.dislikedMovieIds.filter((id) => id !== movie.id),
              genreWeights: isAlreadyLiked
                ? applyDislike(prefs.genreWeights, movie)
                : applyLike(prefs.genreWeights, movie),
            },
          });
        } else if (action === 'dislike') {
          const isAlreadyDisliked = prefs.dislikedMovieIds.includes(movie.id);
          set({
            preferences: {
              ...prefs,
              dislikedMovieIds: isAlreadyDisliked
                ? prefs.dislikedMovieIds.filter((id) => id !== movie.id)
                : [...prefs.dislikedMovieIds, movie.id],
              likedMovieIds: prefs.likedMovieIds.filter((id) => id !== movie.id),
              genreWeights: isAlreadyDisliked
                ? applyLike(prefs.genreWeights, movie)
                : applyDislike(prefs.genreWeights, movie),
            },
          });
        } else if (action === 'watch-later') {
          const isInWatchLater = prefs.watchLaterIds.includes(movie.id);
          set({
            preferences: {
              ...prefs,
              watchLaterIds: isInWatchLater
                ? prefs.watchLaterIds.filter((id) => id !== movie.id)
                : [...prefs.watchLaterIds, movie.id],
            },
          });
        }
      },

      openMovie: (movie) => set({ activeMovie: movie }),
      closeMovie: () => set({ activeMovie: null }),
      setView: (view) => set({ currentView: view }),

      resetPreferences: () => {
        set({
          preferences: defaultPreferences,
          activeMovie: null,
          currentView: 'onboarding',
        });
      },
    }),
    {
      name: 'cinematch-preferences',
      partialize: (state) => ({ preferences: state.preferences, currentView: state.currentView }),
    }
  )
);
