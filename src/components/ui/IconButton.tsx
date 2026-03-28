import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface IconButtonProps {
  onClick: () => void;
  active?: boolean;
  activeClassName?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function IconButton({ onClick, active, activeClassName, title, children, className }: IconButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={cn(
        'p-3 rounded-full border-2 transition-colors duration-200',
        'border-zinc-600 bg-zinc-800/80 text-zinc-300',
        'hover:border-zinc-400 hover:text-white',
        active && activeClassName,
        className
      )}
    >
      {children}
    </motion.button>
  );
}
