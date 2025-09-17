// src/components/admin/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import useAuth from '../../../hooks/useAuth';

type Props = {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
};

export default function ProtectedRoute({ children, redirectTo = '/login', fallback = null }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <>{fallback}</>;
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
