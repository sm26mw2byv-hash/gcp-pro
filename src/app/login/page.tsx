"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gcp-pro.fr");
  const [password, setPassword] = useState("demo1234");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.localStorage.setItem("gcp-pro-auth", "true");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f8fbff,_#eef4ff)] p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
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
            <label className="mb-2 block text-sm text-slate-500">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-500">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800" />
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white">
            <Lock className="h-4 w-4" /> Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
