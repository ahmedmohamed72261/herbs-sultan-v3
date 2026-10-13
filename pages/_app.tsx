import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/store';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ApiProvider } from '@/context/ApiContext';
import AppLoading from '@/components/AppLoading';

export default function App({ Component, pageProps }: AppProps) {
  const { theme, language } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Initial website load ONLY (never on filtering products or query changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ApiProvider>
      <AppLoading show={loading} />
      <ErrorBoundary>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.asPath.split('?')[0]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
      <Toaster position={language === 'ar' ? 'top-left' : 'top-right'} />
    </ApiProvider>
  );
}
