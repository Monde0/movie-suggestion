import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

export function NavBar() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const resetPreferences = useAppStore((s) => s.resetPreferences);
  const watchLaterIds = useAppStore((s) => s.preferences.watchLaterIds);

  return (
    <nav className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8">
      <div className="flex items-center justify-between h-14 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <button
          onClick={() => setView('feed')}
          className="text-brand-red font-black text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          CineMatch
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink active={currentView === 'feed'} onClick={() => setView('feed')}>
            Suggestions
          </NavLink>
          <NavLink active={currentView === 'watchlater'} onClick={() => setView('watchlater')}>
            Watch Later
            {watchLaterIds.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-600 text-white text-xs font-bold leading-none">
                {watchLaterIds.length}
              </span>
            )}
          </NavLink>
        </div>

        {/* Reset */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (confirm('Reset your preferences and start over?')) {
              resetPreferences();
            }
          }}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium"
          title="Reset preferences"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </div>
    </nav>
  );
}

function NavLink({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center',
        active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 bg-zinc-800 rounded-md -z-10"
        />
      )}
    </button>
  );
}
