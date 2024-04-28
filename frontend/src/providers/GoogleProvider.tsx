import { GoogleOAuthProvider } from '@react-oauth/google';
import { ComponentWithChildren } from '../types';

export function GoogleProvider({ children }: ComponentWithChildren) {
  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
