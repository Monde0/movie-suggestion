import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSimilarLikedMovies } from '../../hooks/useMovieSuggestions';
import { usePoster } from '../../hooks/usePoster';
import { useAppStore } from '../../store/useAppStore';
import type { Movie } from '../../types';
import { Badge } from '../ui/Badge';
import { ActionBar } from './ActionBar';

function PopupPosterHeader({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const posterUrl = usePoster(movie);
  return (
    <div className={`bg-gradient-to-br ${movie.posterColor} h-56 relative flex items-end p-5 flex-shrink-0`}>
      {posterUrl && (
        <img
          src={posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {movie.genres.map((g) => (
            <Badge key={g} genre={g} />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight">{movie.title}</h2>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function MoviePopup() {
  const activeMovie = useAppStore((s) => s.activeMovie);
  const closeMovie = useAppStore((s) => s.closeMovie);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMovie();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeMovie]);

  return (
    <AnimatePresence>
      {activeMovie && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMovie}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeMovie}
          >
            <div
              className="bg-zinc-900 rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <PopupPosterHeader movie={activeMovie} onClose={closeMovie} />

              {/* Content */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-500 text-xs mb-1">Year</p>
                    <p className="text-white font-medium">{activeMovie.year}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-500 text-xs mb-1">Rating</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {activeMovie.rating.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-500 text-xs mb-1">Director</p>
                    <p className="text-white font-medium truncate">{activeMovie.director}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-500 text-xs mb-1">Main Actor</p>
                    <p className="text-white font-medium truncate">{activeMovie.mainActor}</p>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed">{activeMovie.description}</p>

                <ActionBar movie={activeMovie} />

                <SimilarLikedSection movie={activeMovie} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SimilarMovieThumbnail({ movie }: { movie: Movie }) {
  const posterUrl = usePoster(movie);
  return (
    <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${movie.posterColor} flex-shrink-0 overflow-hidden`}>
      {posterUrl && <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
    </div>
  );
}

function SimilarLikedSection({ movie }: { movie: Movie }) {
  const similar = useSimilarLikedMovies(movie.id);
  const openMovie = useAppStore((s) => s.openMovie);

  if (similar.length === 0) return null;

  return (
    <div className="pt-2 border-t border-zinc-800">
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">
        Similar to movies you liked
      </p>
      <div className="space-y-2">
        {similar.map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openMovie(m)}
            className="w-full flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl p-3 transition-colors text-left"
          >
            <SimilarMovieThumbnail movie={m} />
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{m.title}</p>
              <p className="text-zinc-400 text-xs mt-0.5">{m.year}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {m.genres.filter((g) => movie.genres.includes(g)).map((g) => (
                  <Badge key={g} genre={g} />
                ))}
              </div>
            </div>
            <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
