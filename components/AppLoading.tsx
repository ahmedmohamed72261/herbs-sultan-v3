import { motion, AnimatePresence } from 'motion/react';

interface AppLoadingProps {
  show: boolean;
}

export default function AppLoading({ show }: AppLoadingProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Ambient Radial Soft Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-secondary/20 via-primary/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

          {/* Floating Leaf & Text (No Box/Square Container) */}
          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated Botanical Leaf SVG */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_8px_20px_rgba(76,175,80,0.3)] overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* --- GHOST BACKGROUND PATHS FOR HIGH CONTRAST --- */}
                <path
                  d="M50 10 C 20 30, 10 70, 50 90 C 90 70, 80 30, 50 10 Z"
                  stroke="var(--color-outline-variant)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
                <path
                  d="M50 90 C 50 60, 50 30, 50 10"
                  stroke="var(--color-outline-variant)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M50 65 C 38 58, 30 52, 26 48 M50 48 C 40 42, 34 36, 32 32"
                  stroke="var(--color-outline-variant)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M50 65 C 62 58, 70 52, 74 48 M50 48 C 60 42, 66 36, 68 32"
                  stroke="var(--color-outline-variant)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />

                {/* --- ANIMATED OVERLAY PATHS --- */}
                {/* Outer Leaf Contour */}
                <motion.path
                  d="M50 10 C 20 30, 10 70, 50 90 C 90 70, 80 30, 50 10 Z"
                  stroke="var(--color-secondary)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Central Leaf Vein */}
                <motion.path
                  d="M50 90 C 50 60, 50 30, 50 10"
                  stroke="var(--color-primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    delay: 0.15,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Left Side Veins */}
                <motion.path
                  d="M50 65 C 38 58, 30 52, 26 48 M50 48 C 40 42, 34 36, 32 32"
                  stroke="var(--color-secondary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    delay: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Right Side Veins */}
                <motion.path
                  d="M50 65 C 62 58, 70 52, 74 48 M50 48 C 60 42, 66 36, 68 32"
                  stroke="var(--color-secondary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.2,
                    delay: 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </svg>
            </div>

            {/* Typography & High-Contrast Progress Line */}
            <div className="flex flex-col items-center gap-3">
              <span className="font-headline-sm text-sm font-black tracking-[0.25em] uppercase text-primary drop-shadow-sm">
                GREEN HERBS EG
              </span>

              {/* Progress Line Track */}
              <div className="w-32 h-1 rounded-full bg-outline-variant/40 overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary via-primary to-secondary rounded-full w-full"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



