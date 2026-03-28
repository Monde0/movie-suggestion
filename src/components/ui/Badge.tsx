import type { Genre } from '../../types';
import { cn } from '../../utils/cn';

const genreColors: Record<string, string> = {
  Action: 'bg-red-900/60 text-red-300',
  Comedy: 'bg-yellow-900/60 text-yellow-300',
  Drama: 'bg-blue-900/60 text-blue-300',
  Horror: 'bg-red-950/80 text-red-400',
  'Sci-Fi': 'bg-cyan-900/60 text-cyan-300',
  Thriller: 'bg-purple-900/60 text-purple-300',
  Romance: 'bg-pink-900/60 text-pink-300',
  Animation: 'bg-green-900/60 text-green-300',
  Documentary: 'bg-orange-900/60 text-orange-300',
  Fantasy: 'bg-indigo-900/60 text-indigo-300',
  Crime: 'bg-zinc-700/80 text-zinc-300',
  Adventure: 'bg-amber-900/60 text-amber-300',
};

interface BadgeProps {
  genre: Genre | string;
  className?: string;
}

export function Badge({ genre, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded text-xs font-medium',
        genreColors[genre] ?? 'bg-zinc-700 text-zinc-300',
        className
      )}
    >
      {genre}
    </span>
  );
}
