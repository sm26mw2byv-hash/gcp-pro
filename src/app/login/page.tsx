"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

const VALID_EMAIL = "admin@gcp-pro.fr";
const VALID_PASSWORD = "demo1234";

export default function LoginPage() {
  const [email, setEmail] = useState(VALID_EMAIL);
  const [password, setPassword] = useState(VALID_PASSWORD);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.trim().toLowerCase() !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setError("Identifiants incorrects. Veuillez utiliser admin@gcp-pro.fr avec le mot de passe demo1234.");
      return;
    }

    window.localStorage.setItem("gcp-pro-auth", "true");
    window.location.assign("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fbff,_#eef4ff)] p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">NOV’HABITAT</p>
            <h1 className="text-2xl font-semibold text-slate-900">Connexion sécurisée</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-500" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-500" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white active:scale-[0.99]"
          >
            <Lock className="h-4 w-4" /> Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
