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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0a2d15 0%, #0d3a1c 30%, #0f4422 60%, #0a2d15 100%)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }}
        >
          {/* Background Bokeh Circles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${[280, 200, 160, 120, 90, 70][i]}px`,
                height: `${[280, 200, 160, 120, 90, 70][i]}px`,
                left: `${[10, 65, 30, 75, 15, 85][i]}%`,
                top: `${[10, 20, 70, 60, 45, 80][i]}%`,
                background: `radial-gradient(circle, rgba(76,175,80,${[0.06, 0.05, 0.04, 0.07, 0.04, 0.05][i]}) 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Floating Leaf Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: `${[5, 15, 80, 90, 25, 70, 50, 40][i]}%`,
                top: `${[80, 20, 85, 15, 55, 40, 90, 10][i]}%`,
                fontSize: `${[10, 14, 10, 12, 8, 14, 10, 12][i]}px`,
                opacity: 0,
              }}
              animate={{
                y: [0, -30, -60, -90],
                x: [0, 10, -10, 5],
                opacity: [0, 0.4, 0.4, 0],
                rotate: [0, 30, -20, 45],
              }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.7,
              }}
            >
              🌿
            </motion.div>
          ))}

          {/* Rotating Ring */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer Ring Rotating */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '130px',
                height: '130px',
                border: '2px solid transparent',
                borderTopColor: '#4caf50',
                borderRightColor: 'rgba(76,175,80,0.3)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Middle Ring (slower, opposite direction) */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '108px',
                height: '108px',
                border: '1.5px solid transparent',
                borderBottomColor: 'rgba(129,199,132,0.5)',
                borderLeftColor: 'rgba(129,199,132,0.2)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner pulsing glow circle */}
            <motion.div
              className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, rgba(76,175,80,0.2) 0%, rgba(46,125,50,0.1) 100%)' }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Logo / Leaf Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 60 60" width="40" height="40" fill="none">
                  {/* Leaf body */}
                  <motion.path
                    d="M30 5 C 8 18, 5 45, 30 55 C 55 45, 52 18, 30 5 Z"
                    fill="rgba(76,175,80,0.15)"
                    stroke="#4caf50"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  {/* Center vein */}
                  <motion.path
                    d="M30 55 C 30 36, 30 18, 30 5"
                    stroke="#81c784"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
                  />
                  {/* Side veins */}
                  <motion.path
                    d="M30 40 C 22 35, 16 31, 13 28 M30 28 C 23 23, 18 19, 16 16"
                    stroke="#a5d6a7"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
                  />
                  <motion.path
                    d="M30 40 C 38 35, 44 31, 47 28 M30 28 C 37 23, 42 19, 44 16"
                    stroke="#a5d6a7"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Brand Name */}
          <motion.div
            className="flex flex-col items-center gap-2 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="font-black text-2xl sm:text-3xl tracking-[0.12em] uppercase"
                style={{ color: '#e8f5e9', letterSpacing: '0.12em' }}
              >
                GREEN HERBS
              </span>
              <span
                className="font-black text-2xl sm:text-3xl tracking-[0.12em] uppercase"
                style={{ color: '#4caf50' }}
              >
                EG
              </span>
            </div>
            <motion.span
              className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: 'rgba(165,214,167,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {isEn ? 'Premium Egyptian Botanicals' : 'أعشاب مصرية فاخرة للتصدير'}
            </motion.span>

            {/* Elegant Progress Bar */}
            <motion.div
              className="w-48 mt-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div
                className="w-full h-[2px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #4caf50, #81c784, transparent)',
                  }}
                  animate={{ x: ['-120%', '120%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className="absolute bottom-10 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase"
            style={{ color: 'rgba(165,214,167,0.35)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {isEn ? 'EST. EGYPT · GLOBAL BOTANICALS' : 'مصر · أعشاب وتوابل للعالم'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
