/* eslint-disable no-console */
import {
  CredentialResponse, GoogleLogin,
} from '@react-oauth/google';
import { Button } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { useUserStore } from '../../store';
import { linkGoogleToAccount, unlinkGoogleToAccount } from '../../api/auth';

interface Props {
  callback: () => void;
}

export function GoogleButton({ callback }: Props) {
  const { googleAuth } = useAuth();

  const onSuccess = async (credentials: CredentialResponse) => {
    if (credentials && credentials.credential) {
      await googleAuth(credentials.credential);
      callback?.();
    }
  };

  return (
    <GoogleLogin
      auto_select={false}
      size="large"
      onSuccess={onSuccess}
      onError={() => {
        console.error('Login Failed');
      }}
    />
  );
}

export function UnlinkGoogleButton() {
  const { user } = useUserStore();
  const { refetchProfile } = useAuth();

  if (user?.google_profile === null || !user) return null;

  const onClick = async () => {
    await unlinkGoogleToAccount();
    refetchProfile();
  };

  return (
    <Button onClick={onClick}>unlink account from google</Button>
  );
}

export function LinkGoogleButton() {
  const { user } = useUserStore();
  const { refetchProfile } = useAuth();

  if (user?.google_profile !== null || !user) return null;

  const onSuccess = async (credentials: CredentialResponse) => {
    if (credentials && credentials.credential) {
      await linkGoogleToAccount(credentials.credential);
      refetchProfile();
    }
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => {
        // TODO: add toasts
        console.log('Login Failed');
      }}
    />
  );
}

GoogleButton.Link = LinkGoogleButton;
GoogleButton.Unlink = UnlinkGoogleButton;
