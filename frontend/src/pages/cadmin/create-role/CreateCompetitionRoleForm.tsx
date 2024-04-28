import { useParams } from 'react-router-dom';
import { Button, TextInput } from '@mantine/core';
import useForm from '../../../hooks/useForm';
import { createCompetitionRole } from '../../../api/app';

interface Props {
    callback: () => void
}
export function CreateCompetitionRoleForm({ callback }: Props) {
  const { id } = useParams<'id'>();
  const form = useForm({
    initialValues: {
      role: '',
      competition: id ?? '',
    },
    validate: {
      role: useForm.validators.required,
      competition: useForm.validators.required,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    await createCompetitionRole(values);
    callback?.();
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput {...form.getInputProps('role')} label="role name" />
      <Button type="submit">Create</Button>
    </form>
  );
}
