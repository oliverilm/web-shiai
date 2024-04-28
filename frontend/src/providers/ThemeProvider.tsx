import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { theme } from '../theme/theme';
import { useThemeStore } from '../store/theme/useThemeStore';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface Props {
    children: React.ReactNode
}

export function ThemeProvider({ children }: Props) {
  const { theme: activeTheme } = useThemeStore();
  return (
    <MantineProvider defaultColorScheme="light" forceColorScheme={activeTheme} theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
