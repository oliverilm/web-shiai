import { create } from 'zustand';

interface ThemeStoreBase {
    theme: 'light' | 'dark',
}

const initialState: ThemeStoreBase = {
  theme: localStorage.getItem('activeTheme') as ThemeStoreBase['theme'] ?? 'light',
};

export const useThemeStore = create<{
    toggleTheme:() => void;
      } & ThemeStoreBase >((set) => ({
        ...initialState,

        toggleTheme: () => set((state) => {
          const theme = state.theme === 'light' ? 'dark' : 'light';
          localStorage.setItem('activeTheme', theme);
          return { ...state, theme };
        }),
      }));
