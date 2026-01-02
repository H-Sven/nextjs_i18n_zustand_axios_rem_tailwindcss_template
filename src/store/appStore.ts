import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * 应用全局状态 Store
 * 存储语言设置等全局信息
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: routing.defaultLocale,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
