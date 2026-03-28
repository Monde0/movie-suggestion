import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../ui/Badge';
import { ActionBar } from './ActionBar';

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
              className="bg-zinc-900 rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Poster header */}
              <div className={`bg-gradient-to-br ${activeMovie.posterColor} h-44 relative flex items-end p-5`}>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {activeMovie.genres.map((g) => (
                      <Badge key={g} genre={g} />
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {activeMovie.title}
                  </h2>
                </div>
                <button
                  onClick={closeMovie}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
