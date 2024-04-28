import {
  AppShell, Burger, Button, Group, Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Outlet } from 'react-router-dom';
import { LoginModal } from '../../utils/modal/LoginModal';
import { SignupModal } from '../../utils/modal/SignupModal';
import { useUserStore } from '../../store';
import { useThemeStore } from '../../store/theme/useThemeStore';

export function RootLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [loginModalOpened, { toggle: toggleLogin }] = useDisclosure(false);
  const [signupModalOpened, { toggle: toggleSignup }] = useDisclosure(false);

  const { isAuthenticated, logout } = useUserStore();

  const { toggleTheme, theme } = useThemeStore();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" w="100%" justify="space-between">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <div />

          {!isAuthenticated ? (
            <Group justify="flex-end">
              <Button onClick={toggleLogin} variant="default">Log in</Button>
              <Button onClick={toggleSignup}>Sign up</Button>
            </Group>
          ) : (
            <Group justify="flex-end">
              <Button onClick={logout}>Log out</Button>
            </Group>
          )}

        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div style={{ flexGrow: 1 }}>
          {Array(15)
            .fill(0)
            .map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </div>
        <Button onClick={toggleTheme}>
          toggle
          {' '}
          {theme === 'light' ? 'dark' : 'light'}
          {' '}
          theme
        </Button>
      </AppShell.Navbar>
      <AppShell.Main>
        <LoginModal
          opened={loginModalOpened}
          onClose={toggleLogin}
          noAccountCallback={() => {
            toggleLogin();
            toggleSignup();
          }}
        />

        <SignupModal
          opened={signupModalOpened}
          onClose={toggleSignup}
          haveAccountCallback={() => {
            toggleSignup();
            toggleLogin();
          }}
        />

        <Outlet />

      </AppShell.Main>
    </AppShell>
  );
}
