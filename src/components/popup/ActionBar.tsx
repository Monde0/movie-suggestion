import type { Movie } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { IconButton } from '../ui/IconButton';

interface ActionBarProps {
  movie: Movie;
}

export function ActionBar({ movie }: ActionBarProps) {
  const applyMovieAction = useAppStore((s) => s.applyMovieAction);
  const preferences = useAppStore((s) => s.preferences);

  const isLiked = preferences.likedMovieIds.includes(movie.id);
  const isDisliked = preferences.dislikedMovieIds.includes(movie.id);
  const isWatchLater = preferences.watchLaterIds.includes(movie.id);

  return (
    <div className="flex items-center justify-center gap-6 pt-2">
      <div className="flex flex-col items-center gap-1">
        <IconButton
          onClick={() => applyMovieAction(movie, 'like')}
          active={isLiked}
          activeClassName="border-red-500 bg-red-900/40 text-red-400"
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </IconButton>
        <span className="text-xs text-zinc-500">{isLiked ? 'Liked' : 'Like'}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <IconButton
          onClick={() => applyMovieAction(movie, 'dislike')}
          active={isDisliked}
          activeClassName="border-zinc-400 bg-zinc-700/60 text-zinc-300"
          title={isDisliked ? 'Remove dislike' : 'Dislike'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
        </IconButton>
        <span className="text-xs text-zinc-500">{isDisliked ? 'Disliked' : 'Dislike'}</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <IconButton
          onClick={() => applyMovieAction(movie, 'watch-later')}
          active={isWatchLater}
          activeClassName="border-yellow-500 bg-yellow-900/40 text-yellow-400"
          title={isWatchLater ? 'Remove from Watch Later' : 'Watch Later'}
        >
          <svg className="w-6 h-6" fill={isWatchLater ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </IconButton>
        <span className="text-xs text-zinc-500">{isWatchLater ? 'Saved' : 'Watch Later'}</span>
      </div>
    </div>
  );
}
