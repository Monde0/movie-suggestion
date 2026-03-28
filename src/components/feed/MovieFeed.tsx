import { AnimatePresence, motion } from 'framer-motion';
import { useMovieSuggestions, useWatchLaterMovies } from '../../hooks/useMovieSuggestions';
import { useAppStore } from '../../store/useAppStore';
import { MovieCard } from './MovieCard';

export function MovieFeed() {
  const currentView = useAppStore((s) => s.currentView);
  const suggestions = useMovieSuggestions();
  const watchLater = useWatchLaterMovies();

  const movies = currentView === 'watchlater' ? watchLater : suggestions;

  if (currentView === 'watchlater' && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <p className="text-lg font-medium">No movies saved yet</p>
        <p className="text-sm mt-1">Bookmark movies from the suggestions feed</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4"
      >
        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
          {currentView === 'watchlater'
            ? `${movies.length} saved movie${movies.length !== 1 ? 's' : ''}`
            : `${movies.length} suggestions for you`}
        </h2>
      </motion.div>

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
    </div>
  );
}
