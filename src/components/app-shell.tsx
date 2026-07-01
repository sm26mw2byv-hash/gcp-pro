"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Building2, ClipboardCheck, History, BarChart3, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: Home },
  { href: "/residences", label: "Résidences", icon: Building2 },
  { href: "/controle", label: "Nouveau contrôle", icon: ClipboardCheck },
  { href: "/historique", label: "Historique", icon: History },
  { href: "/statistiques", label: "Statistiques", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("gcp-pro-auth");
    setIsAuthenticated(stored === "true");
  }, []);

  useEffect(() => {
    if (pathname !== "/login" && !isAuthenticated) {
      router.replace("/login");
    }
  }, [pathname, isAuthenticated, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white/90 p-6 shadow-sm lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">NOV’HABITAT</p>
              <h1 className="text-xl font-semibold text-slate-900">Contrôle qualité</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
