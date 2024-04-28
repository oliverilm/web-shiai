import { RouteProvider } from '../router/router';
import { AppQueryClientProvider } from './AppQueryClientProvider';
import { GoogleProvider } from './GoogleProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider() {
  return (
    <ThemeProvider>
      <AppQueryClientProvider>
        <GoogleProvider>
          <RouteProvider />
        </GoogleProvider>
      </AppQueryClientProvider>
    </ThemeProvider>
  );
}
