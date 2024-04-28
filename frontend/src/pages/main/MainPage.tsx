import { useQuery } from '@tanstack/react-query';
import {
  Button, Card, Flex, Modal, Text,
  TextInput,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import {
  CompetitionOut, createCompetition, getCompetitionList, joinCompetition,
} from '../../api/app';
import { GoogleButton } from '../../components/GoogleButton/GoogleButton';
import useForm from '../../hooks/useForm';
import { useUserStore } from '../../store';

function CompetitionListItem({ competition }: {
  competition: CompetitionOut
}) {
  const [opened, toggle] = useToggle();
  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: useForm.validators.password,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    await joinCompetition({ competition: competition.id, password: values.password });
  };

  return (
    <Flex justify="space-between">
      <Text size="xl">
        {competition.is_joined ? '✅' : null}
        {' '}
        {competition.name}
      </Text>
      {!competition.is_joined ? (
        <>
          <Button onClick={() => toggle()} color="blue" size="sm">
            Join
          </Button>
          <Modal
            title={`Join ${competition.name}`}
            opened={opened}
            onClose={toggle}
          >
            <Text>To join this competition, enter the password</Text>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <Flex direction="column" gap="md">
                <TextInput title="Password" label="Password" type="password" {...form.getInputProps('password')} />
                <Button type="submit">validate</Button>
              </Flex>
            </form>
          </Modal>
        </>
      ) : (
        <Button component={Link} to={`/cadmin/${competition.id}`} color="green" size="sm">
          Open
        </Button>
      )}
    </Flex>
  );
}

export function MainPage() {
  const { isAuthenticated } = useUserStore();

  const competitionQuery = useQuery({ queryKey: ['competitions'], queryFn: getCompetitionList });

  const form = useForm({
    initialValues: {
      name: '',
      password: '',
    },
    validate: {
      name: useForm.validators.required,
      password: useForm.validators.password,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    await createCompetition(values);
    form.reset();
    competitionQuery.refetch();
  };

  return (
    <div>
      <GoogleButton.Link />
      <GoogleButton.Unlink />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Flex gap="lg">
          <TextInput type="text" {...form.getInputProps('name')} />
          <TextInput type="text" {...form.getInputProps('password')} />
          <Button type="submit">submit</Button>
        </Flex>
      </form>
      {isAuthenticated && (
        <Card style={(theme) => ({ backgroundColor: theme.colors.red })}>
          <Flex gap="sm" direction="column">
            {competitionQuery.data?.data.map((competition) => (
              <CompetitionListItem competition={competition} />
            ))}
          </Flex>
        </Card>
      )}
    </div>
  );
}
