import { motion } from 'motion/react';
import { useAppStore } from '@/store';

interface PageLoaderProps {
  className?: string;
  label?: string;
}

export function PageLoader({ className = '', label }: PageLoaderProps) {
  const { language } = useAppStore();
  const text = label ?? (language === 'ar' ? 'جاري تحميل المحتوى...' : 'Loading content...');

  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center gap-5 ${className}`}
    >
      <motion.div
        className="relative h-12 w-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-[#d6a757]/25" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d6a757]" />
      </motion.div>
      <motion.p
        className="text-sm font-bold uppercase tracking-[0.16em] text-[#566359] dark:text-white/60"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
