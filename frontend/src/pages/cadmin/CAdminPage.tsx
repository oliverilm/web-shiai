import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompetition, getCompetitionRoles } from '../../api/app';
import { CreateCompetitionRoleForm } from './create-role/CreateCompetitionRoleForm';

export function CAdminPage() {
  const { id } = useParams<'id'>();
  const { data, isError } = useQuery({
    queryKey: ['cadmin'],
    queryFn: () => getCompetition(id!),
    enabled: Boolean(id),
  });

  const { data: roles, refetch } = useQuery({
    queryKey: ['cadmin/roles'],
    queryFn: () => getCompetitionRoles(id!),
    enabled: Boolean(id),
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  return (
    <div>
      {data?.data.is_owner && (
        <CreateCompetitionRoleForm callback={refetch} />
      )}
      {JSON.stringify(roles?.data)}
      {JSON.stringify(data?.data)}
    </div>
  );
}
