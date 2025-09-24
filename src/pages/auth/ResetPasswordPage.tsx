// src/pages/auth/ResetPasswordPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../../services/auth/password.client";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Loader2,
  LockKeyhole,
} from "lucide-react";

// Paleta (verde/dorado institucional)
const BRAND = "#0D784A";
const BRAND_DARK = "#0B6A41";

const reqs = {
  length: (v: string) => v.length >= 8,
  upper: (v: string) => /[A-Z]/.test(v),
  lower: (v: string) => /[a-z]/.test(v),
  digit: (v: string) => /\d/.test(v),
  symbol: (v: string) => /[^A-Za-z0-9]/.test(v),
};
const allValid = (v: string) => Object.values(reqs).every((fn) => fn(v));
const score = (v: string) => Object.values(reqs).reduce((acc, fn) => acc + (fn(v) ? 1 : 0), 0);

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const nav = useNavigate();

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // Verificar token
  useEffect(() => {
    (async () => {
      try {
        const res = await verifyResetToken(token);
        setValid(!!res.valid);
      } catch {
        setValid(false);
      } finally {
        setChecking(false);
      }
    })();
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (pwd !== pwd2) {
      setErr("Las contraseñas no coinciden.");
      return;
    }
    if (!allValid(pwd)) {
      setErr("La contraseña no cumple los requisitos mínimos.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await resetPassword(token, pwd);
      if (res.ok) {
        setOk(true);
        setTimeout(() => nav("/login", { replace: true }), 1400);
      } else {
        setErr(res.message || "No se pudo restablecer la contraseña.");
      }
    } catch {
      setErr("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  // Skeleton mientras valida token
  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F8FAF8]">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="animate-spin" size={18} />
          Verificando enlace…
        </div>
      </div>
    );
  }

  // Token inválido
  if (!valid) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#F8FAF8] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Enlace inválido o vencido</h1>
          <p className="text-sm text-slate-600 mt-2">
            Solicita uno nuevo desde <b>“Olvidé mi contraseña”</b>.
          </p>
          <Link to="/forgot-password" className="mt-6 inline-block text-sm" style={{ color: BRAND }}>
            Ir a “Olvidé mi contraseña”
          </Link>
        </div>
      </div>
    );
  }

  const s = score(pwd);
  const canSubmit = allValid(pwd) && pwd === pwd2 && !submitting;

  return (
    <div className="min-h-screen grid place-items-center bg-[#F8FAF8] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: "#E6F4EE", color: BRAND }}
          >
            <LockKeyhole size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Restablecer contraseña</h1>
            <p className="text-sm text-slate-500 mt-1">Crea tu nueva contraseña segura.</p>
          </div>
        </div>

        {/* Éxito */}
        {ok ? (
          <div className="mt-6 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-sm">
            <ShieldCheck size={18} />
            ¡Listo! Redirigiendo al inicio de sesión…
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
            {/* Error */}
            {err && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm"
              >
                {err}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Nueva contraseña</label>
              <div className="relative mt-1">
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 outline-none
                             focus:border-[#0D784A] focus:ring-2 focus:ring-[#0D784A]/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-neutral-500 hover:text-neutral-700"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Medidor de fuerza */}
              <div className="mt-3">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 w-full rounded-full"
                      style={{
                        background:
                          s === 0
                            ? "#E5E7EB"
                            : i < s
                            ? i < 2
                              ? "#F59E0B" // débil (ámbar)
                              : i < 4
                              ? "#10B981" // medio (verde)
                              : "#059669" // fuerte (verde oscuro)
                            : "#E5E7EB",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mín. 8 caracteres, con mayúscula, minúscula, número y símbolo.
                </p>
              </div>

              {/* Checklist en vivo */}
              <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
                <Req ok={reqs.length(pwd)} label="8+ caracteres" />
                <Req ok={reqs.upper(pwd)} label="1 mayúscula" />
                <Req ok={reqs.lower(pwd)} label="1 minúscula" />
                <Req ok={reqs.digit(pwd)} label="1 número" />
                <Req ok={reqs.symbol(pwd)} label="1 símbolo" />
              </ul>
            </div>

            {/* Confirmación */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirmar contraseña</label>
              <div className="relative mt-1">
                <input
                  type={showPwd2 ? "text" : "password"}
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 outline-none
                             focus:border-[#0D784A] focus:ring-2 focus:ring-[#0D784A]/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd2((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-neutral-500 hover:text-neutral-700"
                  aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {pwd2.length > 0 && (
                <p className={`mt-1 text-xs ${pwd === pwd2 ? "text-emerald-600" : "text-red-600"}`}>
                  {pwd === pwd2 ? "Coinciden" : "No coinciden"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white
                         shadow-[0_6px_16px_-6px_rgba(13,120,74,0.45)]
                         transition disabled:opacity-50"
              style={{ background: BRAND }}
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Restablecer contraseña
            </button>

            <div className="text-xs text-slate-500 text-center">
              <Link to="/login" className="hover:underline" style={{ color: BRAND_DARK }}>
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Req({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "text-emerald-700" : "text-slate-500"}`}>
      {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {label}
    </li>
  );
}
