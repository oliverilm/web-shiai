import {
  Button, Modal, TextInput, Text,
  Flex,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useForm from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { GoogleButton } from '../../components/GoogleButton/GoogleButton';

interface LoginModalProps {
    opened: boolean,
    onClose: () => void;
    noAccountCallback: () => void;
}

export function LoginModal({ opened, onClose, noAccountCallback }: LoginModalProps) {
  const isMobile = useMediaQuery('(max-width: 50em)');
  const { logIn } = useAuth();
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: useForm.validators.skip,
      password: useForm.validators.skip,
    },
  });

  const onSubmit = async (formValues: typeof form['values']) => {
    logIn(formValues);
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
        <TextInput autoComplete="email" {...form.getInputProps('username')} label="Email" />
        <TextInput autoComplete="new-password" {...form.getInputProps('password')} label="Password" type="password" />

        <Button type="submit" mt="lg" w="100%">Submit</Button>

        <Text
          mt="sm"
          onClick={noAccountCallback}
          style={{ cursor: 'pointer' }}
          size="sm"
          c="dimmed"
          td="underline"
        >
          Dont have an account? Sign up
        </Text>
      </form>

      <Flex justify="center">
        <GoogleButton callback={onClose} />
      </Flex>
    </Modal>
  );
}
