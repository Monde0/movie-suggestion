import { INDEPENDENT, MAJOR_STUDIOS } from '../../utils/studios';
import type { SortOption } from '../../types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'newest',    label: 'Newest' },
  { value: 'oldest',    label: 'Oldest' },
  { value: 'rating',    label: 'Top Rated' },
];

const STUDIO_OPTIONS = ['All', ...MAJOR_STUDIOS, INDEPENDENT];

interface Props {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  studio: string | null;
  onStudioChange: (s: string | null) => void;
}

export function FilterBar({ sort, onSortChange, studio, onStudioChange }: Props) {
  return (
    <div className="px-4 md:px-8 pb-2 flex flex-col gap-2">
      {/* Sort row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-zinc-500 text-xs uppercase tracking-wider mr-1">Sort</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sort === opt.value
                ? 'bg-brand-red text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Studio row — horizontally scrollable */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-zinc-500 text-xs uppercase tracking-wider mr-1 shrink-0">Studio</span>
        {STUDIO_OPTIONS.map((s) => {
          const active = s === 'All' ? studio === null : studio === s;
          return (
            <button
              key={s}
              onClick={() => onStudioChange(s === 'All' ? null : s)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                active
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
