import {
  Button, Modal, TextInput, Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { GoogleButton } from '../../components/GoogleButton/GoogleButton';

interface LoginModalProps {
    opened: boolean,
    onClose: () => void;
    haveAccountCallback: () => void;
}

export function SignupModal({ opened, onClose, haveAccountCallback }: LoginModalProps) {
  const isMobile = useMediaQuery('(max-width: 50em)');
  const { signUp } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validate: {
      email: useForm.validators.email,
      password: useForm.validators.password,
      passwordConfirm: useForm.validators.password,
    },
  });

  const onSubmit = async ({ email, password, passwordConfirm }: typeof form['values']) => {
    if (password !== passwordConfirm) {
      form.setFormInputErrors({ passwordConfirm: 'Passwords do not match' });
      return;
    }
    signUp({ email, password });
    onClose();
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Authentication"
      centered
      fullScreen={isMobile}
      transitionProps={{ transition: 'slide-up', duration: 200 }}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        {/* Modal content */}
        <TextInput autoComplete="email" {...form.getInputProps('email')} label="Email" />
        <TextInput autoComplete="new-password" {...form.getInputProps('password')} label="Password" type="password" />
        <TextInput autoComplete="confirm-password" {...form.getInputProps('passwordConfirm')} label="Password again" type="password" />

        <Button type="submit" mt="lg" w="100%">Submit</Button>

        <Text
          mt="sm"
          onClick={haveAccountCallback}
          style={{ cursor: 'pointer' }}
          size="sm"
          c="dimmed"
          td="underline"
        >
          Already have an account? Log in
        </Text>
      </form>

      <GoogleButton callback={onClose} />
    </Modal>
  );
}
