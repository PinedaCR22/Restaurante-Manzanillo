// src/components/admin/auth/RoleGuard.tsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import useAuth from '../../../hooks/useAuth';

type RoleName = 'ADMIN' | 'EDITOR';

type Props = {
  allow: RoleName[];
  children: ReactNode;
  fallbackPath?: string;
};

export default function RoleGuard({ allow, children, fallbackPath = '/admin' }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null;

  const role = user?.role?.name as RoleName | undefined;
  if (!role || !allow.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
