import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import type { ScoredMovie } from '../../types';
import { Badge } from '../ui/Badge';

interface MovieCardProps {
  movie: ScoredMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const openMovie = useAppStore((s) => s.openMovie);
  const preferences = useAppStore((s) => s.preferences);

  const isLiked = preferences.likedMovieIds.includes(movie.id);
  const isWatchLater = preferences.watchLaterIds.includes(movie.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => openMovie(movie)}
      className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[2/3] bg-zinc-800"
    >
      {/* Gradient poster */}
      <div className={`absolute inset-0 bg-gradient-to-br ${movie.posterColor}`} />

      {/* Status badges */}
      <div className="absolute top-2 left-2 flex gap-1">
        {isLiked && (
          <span className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </span>
        )}
        {isWatchLater && (
          <span className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </span>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex flex-wrap gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {movie.genres.slice(0, 2).map((g) => (
            <Badge key={g} genre={g} />
          ))}
        </div>
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-zinc-400 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {movie.year}
        </p>
      </div>

      {/* More Info button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
          More Info
        </span>
      </div>
    </motion.div>
  );
}
