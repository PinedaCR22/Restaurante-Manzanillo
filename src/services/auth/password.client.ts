// Frontend client for password recovery/reset
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return (await res.json()) as { ok: boolean; message: string };
}

export async function verifyResetToken(token: string) {
  const res = await fetch(`${API_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return (await res.json()) as { valid: boolean };
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return (await res.json()) as { ok: boolean; message: string };
}
