import { AnimatePresence, motion } from 'framer-motion';
import { GenreSelector } from './components/onboarding/GenreSelector';
import { MovieFeed } from './components/feed/MovieFeed';
import { NavBar } from './components/layout/NavBar';
import { MoviePopup } from './components/popup/MoviePopup';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const hasCompletedOnboarding = useAppStore((s) => s.preferences.hasCompletedOnboarding);

  return (
    <div className="min-h-screen bg-[#141414]">
      <AnimatePresence mode="wait">
        {!hasCompletedOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GenreSelector />
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NavBar />
            <main className="max-w-screen-2xl mx-auto">
              <MovieFeed />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <MoviePopup />
    </div>
  );
}
