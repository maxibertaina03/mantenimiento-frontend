import { getData } from './http';
import type { UserDto } from '@/shared/types/iam';

export const iamApi = {
  me: () => getData<UserDto>('/iam/users/me'),
};
