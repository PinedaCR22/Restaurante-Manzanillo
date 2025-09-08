// src/types/auth/identity.ts
export type UserStatus = 'active' | 'inactive';

export interface Role {
  id: number;
  name: string; // 'ADMIN' | 'EDITOR'
}

export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  email: string;
  status: UserStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  role: Role;
}
