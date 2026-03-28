import { motion } from 'framer-motion';
import type { Genre } from '../../types';
import { cn } from '../../utils/cn';

const genreConfig: Record<Genre, { emoji: string; bg: string }> = {
  Action:      { emoji: '💥', bg: 'from-red-800 to-red-950' },
  Comedy:      { emoji: '😂', bg: 'from-yellow-700 to-amber-900' },
  Drama:       { emoji: '🎭', bg: 'from-blue-800 to-blue-950' },
  Horror:      { emoji: '👻', bg: 'from-red-950 to-zinc-900' },
  'Sci-Fi':    { emoji: '🚀', bg: 'from-cyan-800 to-slate-950' },
  Thriller:    { emoji: '🔪', bg: 'from-purple-800 to-zinc-950' },
  Romance:     { emoji: '💕', bg: 'from-pink-700 to-rose-950' },
  Animation:   { emoji: '✨', bg: 'from-green-700 to-teal-900' },
  Documentary: { emoji: '🎬', bg: 'from-orange-700 to-amber-950' },
  Fantasy:     { emoji: '🧙', bg: 'from-indigo-700 to-violet-950' },
  Crime:       { emoji: '🕵️', bg: 'from-zinc-600 to-zinc-900' },
  Adventure:   { emoji: '🗺️', bg: 'from-amber-700 to-orange-950' },
};

interface GenreCardProps {
  genre: Genre;
  selected: boolean;
  disabled: boolean;
  onToggle: (genre: Genre) => void;
}

export function GenreCard({ genre, selected, disabled, onToggle }: GenreCardProps) {
  const { emoji, bg } = genreConfig[genre];

  return (
    <motion.button
      layout
      whileHover={!disabled || selected ? { scale: 1.05 } : {}}
      whileTap={!disabled || selected ? { scale: 0.95 } : {}}
      onClick={() => (!disabled || selected) && onToggle(genre)}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-xl p-6',
        'bg-gradient-to-br border-2 transition-all duration-200 cursor-pointer',
        'text-white font-semibold text-base select-none',
        bg,
        selected
          ? 'border-white shadow-lg shadow-white/20 scale-105'
          : 'border-transparent opacity-80 hover:opacity-100',
        disabled && !selected && 'opacity-40 cursor-not-allowed'
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
      <span className="text-3xl">{emoji}</span>
      <span>{genre}</span>
    </motion.button>
  );
}
