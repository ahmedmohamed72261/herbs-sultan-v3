import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

interface AppState {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'light',
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'herbs-app-storage',
    }
  )
);
