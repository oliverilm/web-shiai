import { useLayoutEffect } from 'react';
import { useAuth } from '../../hooks/useAuth/useAuth';

export function AuthSystem() {
  const { initialLoad } = useAuth();

  useLayoutEffect(() => {
    initialLoad();
  }, []);

  return null;
}
