// src/hooks/users/useUsers.ts
import { useEffect, useState } from "react";
import { usersService } from "../../services/users/users.service";
import type { User, Role } from "../../types/users/user";
import useAuth from "../../hooks/useAuth";

export function useUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  async function reload() {
    if (user?.role?.name !== "ADMIN") return; // ✅ evita el 403
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        usersService.getUsers(),
        usersService.getRoles(),
      ]);
      setUsers(u);
      setRoles(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [user?.role?.name]);

  return { users, roles, loading, reload };
}
