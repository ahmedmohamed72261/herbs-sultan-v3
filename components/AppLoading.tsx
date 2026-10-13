import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store';

interface AppLoadingProps {
  show: boolean;
}

export default function AppLoading({ show }: AppLoadingProps) {
  const { language } = useAppStore();
  const isEn = language !== 'ar';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfbf7] dark:bg-[#07130e] text-[#1b3327] dark:text-[#f8f1dc]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Ambient Radial Soft Glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-[#2e7d32]/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

          {/* Floating Brand Container */}
          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated Botanical Leaf SVG */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_10px_25px_rgba(46,125,50,0.35)] overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* --- GHOST BACKGROUND PATHS FOR CONTRAST --- */}
                <path
                  d="M50 10 C 20 30, 10 70, 50 90 C 90 70, 80 30, 50 10 Z"
                  stroke="#a5d6a7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
                <path
                  d="M50 90 C 50 60, 50 30, 50 10"
                  stroke="#a5d6a7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.35"
                />
                <path
                  d="M50 65 C 38 58, 30 52, 26 48 M50 48 C 40 42, 34 36, 32 32"
                  stroke="#a5d6a7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.35"
                />
                <path
                  d="M50 65 C 62 58, 70 52, 74 48 M50 48 C 60 42, 66 36, 68 32"
                  stroke="#a5d6a7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.35"
                />

                {/* --- ANIMATED OVERLAY PATHS --- */}
                {/* Outer Leaf Contour */}
                <motion.path
                  d="M50 10 C 20 30, 10 70, 50 90 C 90 70, 80 30, 50 10 Z"
                  stroke="#2e7d32"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Central Leaf Vein */}
                <motion.path
                  d="M50 90 C 50 60, 50 30, 50 10"
                  stroke="#4caf50"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: 0.15,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Left Side Veins */}
                <motion.path
                  d="M50 65 C 38 58, 30 52, 26 48 M50 48 C 40 42, 34 36, 32 32"
                  stroke="#81c784"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: 0.25,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Right Side Veins */}
                <motion.path
                  d="M50 65 C 62 58, 70 52, 74 48 M50 48 C 60 42, 66 36, 68 32"
                  stroke="#81c784"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: 0.25,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </svg>
            </div>

            {/* Typography & Subtitle */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-[0.16em] uppercase text-emerald-900 dark:text-emerald-300">
                  GREEN HERBS
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-[0.16em] uppercase text-emerald-500">
                  EG
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-emerald-700/80 dark:text-emerald-400/80">
                {isEn ? "Premium Egyptian Botanicals" : "تصدير الأعشاب الطبية الفاخرة"}
              </span>

              {/* Progress Line Track */}
              <div className="w-40 h-1.5 rounded-full bg-emerald-900/10 dark:bg-white/10 overflow-hidden relative mt-2">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-full w-full"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.4,
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
