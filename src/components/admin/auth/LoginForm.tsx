import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import type { ApiError } from '../../../lib/http';

type LocationState = { from?: { pathname?: string } };

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: LocationState };
  const redirectTo = location.state?.from?.pathname ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(redirectTo, { replace: true });
    } catch (e: unknown) {
      let msg = 'Error al iniciar sesión';
      if (e && typeof e === 'object') {
        const err = e as ApiError;
        if (err.message) msg = err.message;
        if (err.data && typeof err.data === 'object' && 'message' in (err.data as object)) {
          const m = (err.data as Record<string, unknown>).message;
          if (typeof m === 'string') msg = m;
          else if (Array.isArray(m)) msg = m.join(', ');
        }
      }
      setErrorMsg(String(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-[15px]">
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          {errorMsg}
        </div>
      )}

      {/* 🔹 Campo de correo */}
      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium text-neutral-700">
          Usuario
        </label>
        <input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          required
          className="w-full h-12 rounded-xl border border-neutral-300 px-4 outline-none
                     focus:border-[#0D784A] focus:ring-2 focus:ring-[#0D784A]/30 transition
                     text-[15px]"
        />
      </div>

      {/* 🔹 Campo de contraseña con ícono centrado */}
      <div className="space-y-2">
        <label htmlFor="password" className="block font-medium text-neutral-700">
          Contraseña
        </label>

        {/* input + botón dentro del relative */}
        <div className="relative">
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className="w-full h-12 rounded-xl border border-neutral-300 pl-4 pr-12 outline-none
                       focus:border-[#0D784A] focus:ring-2 focus:ring-[#0D784A]/30 transition
                       text-[15px]"
          />

          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            aria-pressed={showPass}
            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 inset-y-0 my-auto grid place-items-center 
                       text-neutral-500 hover:text-neutral-700 h-6 w-6"
          >
            {showPass ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58a2 2 0 002.84 2.84" />
                <path d="M16.24 16.24A10.94 10.94 0 0112 18c-5 0-9-4-9-6a10.94 10.94 0 013.95-4.95" />
                <path d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9 4 9 6a10.94 10.94 0 01-2.12 3.17" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* ahora separado → no afecta alineación del botón */}
        <p className="mt-3 text-center text-sm">
          <a href="/forgot-password" className="text-[#C58940] hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </div>

      {/* 🔹 Botón de enviar */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 rounded-xl px-5 font-semibold text-white
                   bg-[#0D784A] hover:bg-[#0B6A41] disabled:opacity-50
                   shadow-[0_8px_18px_-6px_rgba(13,120,74,0.45)] transition text-base"
      >
        {submitting ? 'Accediendo…' : 'Acceder al Sistema'}
      </button>
    </form>
  );
}
