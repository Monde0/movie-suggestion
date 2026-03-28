import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Genre } from '../../types';
import { ALL_GENRES } from '../../types';
import { GenreCard } from './GenreCard';

const REQUIRED = 3;

export function GenreSelector() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [selected, setSelected] = useState<Genre[]>([]);

  const toggle = (genre: Genre) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const canProceed = selected.length === REQUIRED;

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-3">
          Welcome to <span className="text-brand-red">CineMatch</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Pick <strong className="text-white">3 genres</strong> you love to get personalized movie suggestions
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {ALL_GENRES.map((genre) => (
          <motion.div
            key={genre}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <GenreCard
              genre={genre}
              selected={selected.includes(genre)}
              disabled={selected.length >= REQUIRED}
              onToggle={toggle}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <p className="text-zinc-400 text-sm">
          {selected.length}/{REQUIRED} genres selected
        </p>

        <div className="flex gap-2 flex-wrap justify-center min-h-[28px]">
          {selected.map((g) => (
            <motion.span
              key={g}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="px-3 py-1 rounded-full bg-zinc-700 text-white text-sm font-medium"
            >
              {g}
            </motion.span>
          ))}
        </div>

        <motion.button
          whileHover={canProceed ? { scale: 1.05 } : {}}
          whileTap={canProceed ? { scale: 0.95 } : {}}
          onClick={() => canProceed && completeOnboarding(selected)}
          disabled={!canProceed}
          className="mt-2 px-10 py-3 rounded-lg font-bold text-lg transition-all duration-200
            bg-brand-red text-white
            disabled:opacity-30 disabled:cursor-not-allowed
            enabled:hover:bg-brand-darkred enabled:shadow-lg enabled:shadow-red-900/40"
        >
          Get My Movies
        </motion.button>
      </motion.div>
    </div>
  );
}
