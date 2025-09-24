import { useState } from 'react';
import { requestPasswordReset } from '../../services/auth/password.client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await requestPasswordReset(email.trim().toLowerCase());
      setSent(true);
    } catch {
      setErr('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#F8FAF8] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Recuperar contraseña</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 p-3 text-sm">
            Si el correo existe, te llegará un enlace para restablecer.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {err && <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">{err}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none
                           focus:border-[#0D784A] focus:ring-2 focus:ring-[#0D784A]/30 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-2 font-medium text-white bg-[#0D784A]
                         hover:bg-[#0B6A41] disabled:opacity-50 shadow-[0_6px_16px_-6px_rgba(13,120,74,0.45)]"
            >
              {loading ? 'Enviando…' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <a href="/login" className="mt-6 inline-block text-sm text-[#C58940] hover:underline">Volver al inicio de sesión</a>
      </div>
    </div>
  );
}
