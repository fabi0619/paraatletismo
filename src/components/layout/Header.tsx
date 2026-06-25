import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { athletesService, type Athlete } from "../../features/athletes/api/athletesService";
import { professorsService, type Professor } from "../../features/professors/api/professorsService";
import { championshipsService, type ChampionshipExtended } from "../../features/championships/api/championshipsService";
import { QueryProvider } from "../providers/QueryProvider";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
  cedula?: string;
  especialidad?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSession(): Session | null {
  try {
    const raw = localStorage.getItem("sesion_usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("sesion_usuario");
}

function getRolLabel(rol: string) {
  switch (rol) {
    case "admin":
      return "Administrador";
    case "profesor":
      return "Entrenador";
    case "atleta":
      return "Atleta";
    default:
      return rol;
  }
}

function getRolColor(rol: string) {
  switch (rol) {
    case "admin":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "profesor":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "atleta":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

// ─── Stats chip ───────────────────────────────────────────────────────────────
function StatChip({
  icon,
  value,
  label,
  isLoading,
  href,
}: {
  icon: string;
  value: number | string;
  label: string;
  isLoading?: boolean;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/60 px-3 py-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:border-red-200 hover:shadow-md cursor-pointer">
      <span
        className="material-icons-round text-[var(--primary-red)]"
        style={{ fontSize: "18px" }}
      >
        {icon}
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-black text-slate-900 tabular-nums">
          {isLoading ? (
            <span className="inline-block h-3.5 w-6 animate-pulse rounded bg-slate-200" />
          ) : (
            value
          )}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          {label}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="no-underline hover:no-underline">
        {content}
      </a>
    );
  }

  return content;
}

// ─── Inner header (needs QueryProvider context) ────────────────────────────────
const HeaderInner: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sync session from localStorage on mount and on storage events
  useEffect(() => {
    setMounted(true);
    setSession(getSession());

    const handleStorage = () => setSession(getSession());
    window.addEventListener("storage", handleStorage);
    // Also listen to a custom event for same-tab updates
    window.addEventListener("sesion_change", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("sesion_change", handleStorage);
    };
  }, []);

  const { data: athletes, isLoading: athletesLoading } = useQuery<Athlete[], Error>({
    queryKey: ["athletes"],
    queryFn: athletesService.getAthletes,
    staleTime: 1000 * 60 * 5,
  });

  const { data: professors, isLoading: professorsLoading } = useQuery<Professor[], Error>({
    queryKey: ["professors"],
    queryFn: professorsService.getProfessors,
    staleTime: 1000 * 60 * 5,
  });

  const { data: championships, isLoading: championshipsLoading } = useQuery<ChampionshipExtended[], Error>({
    queryKey: ["championships"],
    queryFn: championshipsService.getChampionships,
    staleTime: 1000 * 60 * 5,
  });

  // Compute stats
  const totalAthletes = athletes?.length ?? 0;
  const totalProfessors = professors?.length ?? 0;
  
  // Use distinct championships by name
  const totalChampionships = useMemo(() => {
    if (!championships) return 0;
    const names = new Set(championships.map(c => c.campeonato.trim().toLowerCase()));
    return names.size;
  }, [championships]);

  const handleLogout = useCallback(() => {
    clearSession();
    setSession(null);
    // Notify same-tab listeners
    window.dispatchEvent(new Event("sesion_change"));
    window.location.href = "/";
  }, []);

  const handleProfile = useCallback(() => {
    if (session?.rol === "atleta" && session?.id) {
      window.location.href = `/atleta/${session.id}`;
    }
  }, [session]);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(214,219,228,0.5)",
        boxShadow: "0 2px 20px rgba(15,23,42,0.06)",
      }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6"
        style={{ minHeight: "68px" }}
      >
        {/* ── Logo ──────────────────────────────────────────── */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-3 no-underline"
          aria-label="Inicio - Valle Paraatletismo"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
            style={{
              background: "linear-gradient(135deg, var(--primary-red) 0%, hsl(348,100%,40%) 100%)",
            }}
          >
            <span
              className="material-icons-round text-white"
              style={{ fontSize: "22px" }}
            >
              sports_athletics
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black tracking-widest text-slate-900 uppercase">
              Valle{" "}
              <span style={{ color: "var(--primary-red)" }}>Paraatletismo</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Portal de Gestión Deportiva
            </span>
          </div>
        </a>

        {/* ── Stats (center) ────────────────────────────────── */}
        <div className="mx-auto hidden items-center gap-3 sm:flex">
          <StatChip
            icon="groups"
            value={totalAthletes}
            label="Atletas"
            isLoading={athletesLoading}
            href="/atletas"
          />
          <StatChip
            icon="sports"
            value={totalProfessors}
            label="Profesores"
            isLoading={professorsLoading}
            href="/profesores"
          />
          <StatChip
            icon="emoji_events"
            value={totalChampionships}
            label="Campeonatos"
            isLoading={championshipsLoading}
            href="/campeonatos"
          />
        </div>

        {/* ── Right actions ─────────────────────────────────── */}
        <div className="ml-auto flex items-center gap-2">
          {!mounted ? null : session ? (
            /* ── Authenticated user ─── */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-all hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-red)]"
                  aria-label="Opciones de usuario"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary-red) 0%, hsl(348,100%,40%) 100%)",
                    }}
                  >
                    <span
                      className="material-icons-round"
                      style={{ fontSize: "18px" }}
                    >
                      account_circle
                    </span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="max-w-[120px] truncate text-xs font-bold text-slate-900">
                      {session.nombre}
                    </span>
                    <span
                      className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase border ${getRolColor(session.rol)}`}
                    >
                      {getRolLabel(session.rol)}
                    </span>
                  </div>
                  <span
                    className="material-icons-round text-slate-400"
                    style={{ fontSize: "16px" }}
                  >
                    expand_more
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {session.nombre}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {getRolLabel(session.rol)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                  <span
                    className="material-icons-round mr-2"
                    style={{ fontSize: "16px" }}
                  >
                    dashboard
                  </span>
                  Dashboard
                </DropdownMenuItem>
                {session.rol === "atleta" && (
                  <DropdownMenuItem onClick={handleProfile}>
                    <span
                      className="material-icons-round mr-2"
                      style={{ fontSize: "16px" }}
                    >
                      account_box
                    </span>
                    Mi Perfil
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <span
                    className="material-icons-round mr-2"
                    style={{ fontSize: "16px" }}
                  >
                    logout
                  </span>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* ── Guest ─── */
            <a href="/login">
              <Button
                variant="outline"
                className="gap-2 border-[var(--primary-red)] text-[var(--primary-red)] font-bold hover:bg-[var(--primary-red)] hover:text-white transition-all"
              >
                <span
                  className="material-icons-round"
                  style={{ fontSize: "18px" }}
                >
                  login
                </span>
                Ingresar
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

// ─── Public export (with QueryProvider) ───────────────────────────────────────
export const Header: React.FC = () => (
  <QueryProvider>
    <HeaderInner />
  </QueryProvider>
);
