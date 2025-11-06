import { get, post, patch } from '../../lib/http';
import type {
  User,
  Role,
  CreateUserDto,
  UpdateUserDto,
  UpdateRoleDto,
  UpdateStatusDto,
  UpdatePasswordDto,
} from '../../types/users/user';

export const usersService = {
  // Roles
  async getRoles(): Promise<Role[]> {
    return get<Role[]>('/roles');
  },

  // Usuarios (solo ADMIN)
  async getUsers(): Promise<User[]> {
    return get<User[]>('/users');
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    return post<User>('/users', dto);
  },

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    return patch<User>(`/users/${id}`, dto);
  },

  async updateRole(id: number, dto: UpdateRoleDto): Promise<User> {
    return patch<User>(`/users/${id}/role`, dto);
  },

  async updateStatus(id: number, dto: UpdateStatusDto): Promise<User> {
    return patch<User>(`/users/${id}/status`, dto);
  },

  async updatePassword(id: number, dto: UpdatePasswordDto): Promise<User> {
    return patch<User>(`/users/${id}/password`, dto);
  },

  // Perfil actual (todos los usuarios)
  async getMe(): Promise<User> {
    return get<User>('/auth/me');
  },
};
