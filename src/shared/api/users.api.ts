import { apiClient } from './client';

export interface UserListItem {
  id: string;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'OPERATOR';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface ListUsersResponse {
  items: UserListItem[];
  total: number;
}

export const usersApi = {
  list: (skip?: number, take?: number): Promise<ListUsersResponse> =>
    apiClient.get('/v1/iam/users', { params: { skip, take } }),
};
