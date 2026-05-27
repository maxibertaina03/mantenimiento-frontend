import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { usersApi } from '@/shared/api/users.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  roles?: ('ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'OPERATOR')[];
}

export function UserSelector({
  value,
  onValueChange,
  placeholder = 'Seleccionar usuario',
  disabled,
  roles,
}: Props) {
  const { data } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => usersApi.list(0, 100),
  });

  const filteredUsers = useMemo(() => {
    if (!data?.items) return [];
    if (!roles) return data.items.filter((u) => u.status === 'ACTIVE');
    return data.items.filter((u) => u.status === 'ACTIVE' && roles.includes(u.role));
  }, [data?.items, roles]);

  const selectedUser = useMemo(
    () => filteredUsers.find((u) => u.id === value),
    [filteredUsers, value],
  );

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger disabled={disabled}>
        <SelectValue placeholder={placeholder}>
          {selectedUser ? (
            <span>{selectedUser.fullName}</span>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {filteredUsers.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.fullName} {user.role !== 'OPERATOR' && `· ${user.role}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
