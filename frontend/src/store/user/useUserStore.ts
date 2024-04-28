import { create } from 'zustand';
import { Profile, TokensResponse } from '../../api/auth';

interface UserStoreBase {
    isAuthenticated: boolean,
    access: string | null,
    refresh: string | null,
    user: Profile | null
}

const initialState: UserStoreBase = {
  isAuthenticated: false,
  access: null,
  refresh: null,
  user: null,
};

export const useUserStore = create<{
    parseTokens:(value: TokensResponse) => void;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => void;
    setUserData: (value: Profile) => void;
    setData: (value: Partial<UserStoreBase>) => void;
      } & UserStoreBase >((set) => ({
        ...initialState,
        logout: () => set((state) => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');

          return { ...state, ...initialState };
        }),
        parseTokens: (value: TokensResponse) => set((state) => {
          if (value && value.access && value.refresh) {
            localStorage.setItem('access', value.access);
            localStorage.setItem('refresh', value.refresh);

            return {
              ...state,
              refresh: value.refresh,
              access: value.access,
              isAuthenticated: true,
            };
          }
          return state;
        }),
        setUserData: (value) => set((state) => ({ ...state, user: value })),
        setIsAuthenticated: (value) => set((state) => ({ ...state, isAuthenticated: value })),
        setData: (value) => set((state) => ({ ...state, ...value })),
      }));
