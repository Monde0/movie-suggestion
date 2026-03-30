import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLikedMovies, useMovieSuggestions, useWatchLaterMovies } from '../../hooks/useMovieSuggestions';
import { useAppStore } from '../../store/useAppStore';
import { MovieCard } from './MovieCard';
import { useAllMovies } from '../../hooks/useMovieSuggestions';
import { FilterBar } from './FilterBar';
import type { SortOption } from '../../types';

export function MovieFeed() {
  const currentView = useAppStore((s) => s.currentView);
  const isLoadingDynamic = useAppStore((s) => s.isLoadingDynamic);
  const allMovies = useAllMovies();
  const suggestions = useMovieSuggestions();
  const watchLater = useWatchLaterMovies();
  const liked = useLikedMovies();

  const [sort, setSort] = useState<SortOption>('relevance');
  const [studioFilter, setStudioFilter] = useState<string | null>(null);

  const baseMovies =
    currentView === 'watchlater' ? watchLater :
    currentView === 'liked' ? liked :
    suggestions;

  // Apply studio filter
  const studioFiltered = studioFilter
    ? baseMovies.filter((m) => (m.studio ?? 'Independent') === studioFilter)
    : baseMovies;

  // Apply sort (suggestions are already relevance-sorted)
  const movies = (() => {
    if (sort === 'relevance') return studioFiltered;
    const copy = [...studioFiltered];
    if (sort === 'newest') return copy.sort((a, b) => b.year - a.year);
    if (sort === 'oldest') return copy.sort((a, b) => a.year - b.year);
    if (sort === 'rating') return copy.sort((a, b) => b.rating - a.rating);
    return copy;
  })();

  const emptyState =
    currentView === 'watchlater' ? { icon: 'bookmark', message: 'No movies saved yet', sub: 'Bookmark movies from the suggestions feed' } :
    currentView === 'liked' ? { icon: 'heart', message: 'No liked movies yet', sub: 'Like movies from the suggestions feed' } :
    null;

  if (emptyState && baseMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        {emptyState.icon === 'heart' ? (
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ) : (
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
        <p className="text-lg font-medium">{emptyState.message}</p>
        <p className="text-sm mt-1">{emptyState.sub}</p>
      </div>
    );
  }

  const label =
    currentView === 'watchlater' ? `${movies.length} saved movie${movies.length !== 1 ? 's' : ''}` :
    currentView === 'liked' ? `${movies.length} liked movie${movies.length !== 1 ? 's' : ''}` :
    `${movies.length} suggestions for you`;

  return (
    <div className="px-4 md:px-8 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 flex items-center gap-4"
      >
        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
          {label}
        </h2>
        <AnimatePresence>
          {isLoadingDynamic && currentView === 'feed' && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs text-zinc-500"
            >
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              fetching more from {allMovies.length} total…
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mb-4 -mx-4 md:-mx-8">
        <FilterBar
          sort={sort}
          onSortChange={setSort}
          studio={studioFilter}
          onStudioChange={setStudioFilter}
        />
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <p className="text-base font-medium">No movies match these filters</p>
          <p className="text-sm mt-1">Try a different studio or sort option</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
