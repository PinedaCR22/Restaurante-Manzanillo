// src/modules/users/types/user.types.ts

export type UserStatus = 'active' | 'inactive';

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  password: string;
  roleId: number;
  status?: UserStatus;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  email?: string;
}

export interface UpdateRoleDto {
  roleId: number;
}

export interface UpdateStatusDto {
  status: UserStatus;
}

export interface UpdatePasswordDto {
  password: string;
}