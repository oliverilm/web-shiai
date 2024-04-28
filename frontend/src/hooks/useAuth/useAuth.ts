import {
  AuthenticateData, RegisterData, authenticate, getProfile, googleAuth, refreshToken, signUp,
} from '../../api/auth';
import { useUserStore } from '../../store';

export function useAuth() {
  const { setData } = useUserStore();

  return {
    initialLoad: async () => {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        const response = await refreshToken({ refresh });
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('access', response.data.access);
        if (response.data.access && response.data.refresh) {
          const profile = await getProfile();
          setData({
            refresh: response.data.refresh,
            access: response.data.access,
            user: profile.data,
            isAuthenticated: true,
          });
        } else {
          // refresh token is too old or incorrect
        }
      }
    },
    googleAuth: async (accessToken: string) => {
      const tokens = await googleAuth(accessToken);
      localStorage.setItem('refresh', tokens.data.refresh);
      localStorage.setItem('access', tokens.data.access);
      if (tokens.data.access && tokens.data.refresh) {
        const profile = await getProfile();
        setData({
          refresh: tokens.data.refresh,
          access: tokens.data.access,
          user: profile.data,
          isAuthenticated: true,
        });
      }
    },
    logIn: async (credentials: AuthenticateData) => {
      const tokens = await authenticate(credentials);
      localStorage.setItem('refresh', tokens.data.refresh);
      localStorage.setItem('access', tokens.data.access);
      if (tokens.data.access && tokens.data.refresh) {
        const profile = await getProfile();
        setData({
          refresh: tokens.data.refresh,
          access: tokens.data.access,
          user: profile.data,
          isAuthenticated: true,
        });
      } else {
        // something went wrong
      }
    },
    signUp: async (data: RegisterData) => {
      const profile = await signUp(data);
      const tokens = await authenticate({ password: data.password, username: data.email });
      localStorage.setItem('refresh', tokens.data.refresh);
      localStorage.setItem('access', tokens.data.access);
      if (tokens.data.access && tokens.data.refresh) {
        setData({
          refresh: tokens.data.refresh,
          access: tokens.data.access,
          user: profile.data,
          isAuthenticated: true,
        });
      } else {
        // something went wrong
      }
      setData({});
    },
    refetchProfile: async () => {
      const profile = await getProfile();
      if (profile) {
        setData({ user: profile.data });
      }
    },
  };
}
