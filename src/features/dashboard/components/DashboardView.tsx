import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { athletesService, type Athlete, type Championship } from "../../athletes/api/athletesService";
import { championshipsService } from "../../championships/api/championshipsService";
import { professorsService } from "../../professors/api/professorsService";
import { QueryProvider } from "@/components/providers/QueryProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
  cedula?: string;
  especialidad?: string;
}

function getSession(): Session | null {
  try {
    const raw = localStorage.getItem("sesion_usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getRolLabel(rol: string) {
  switch (rol) {
    case "admin": return "Administrador";
    case "profesor": return "Entrenador";
    case "atleta": return "Atleta";
    default: return rol;
  }
}

function getRolColor(rol: string) {
  switch (rol) {
    case "admin": return "bg-purple-100 text-purple-700";
    case "profesor": return "bg-blue-100 text-blue-700";
    case "atleta": return "bg-emerald-100 text-emerald-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: string;
  label: string;
  value: number | string;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(135deg, var(--primary-red-light) 0%, hsl(0,68%,92%) 100%)",
          }}
        >
          <span
            className="material-icons-round"
            style={{ fontSize: "24px", color: "var(--primary-red)" }}
          >
            {icon}
          </span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 tabular-nums">
            {isLoading ? (
              <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-200" />
            ) : (
              value
            )}
          </p>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick-link card ──────────────────────────────────────────────────────────
function QuickLink({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a href={href} className="group block no-underline">
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-(--primary-red)/30">
        <CardContent className="flex items-start gap-3 p-5">
          <span
            className="material-icons-round mt-0.5 transition-colors group-hover:text-(--primary-red)"
            style={{ fontSize: "22px", color: "var(--text-muted)" }}
          >
            {icon}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-(--primary-red)">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

// ─── Dashboard inner (inside QueryProvider) ───────────────────────────────────
const DashboardInner: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      // Si no hay sesión, redirigir al login
      window.location.href = "/login";
      return;
    }
    setSession(s);
  }, []);

  const { data: athletes, isLoading: athletesLoading } = useQuery<Athlete[], Error>({
    queryKey: ["athletes"],
    queryFn: athletesService.getAthletes,
    staleTime: 1000 * 60 * 5,
  });

  const { data: championships, isLoading: championshipsLoading } = useQuery({
    queryKey: ["championships"],
    queryFn: championshipsService.getChampionships,
    staleTime: 1000 * 60 * 5,
  });

  const { data: professors, isLoading: professorsLoading } = useQuery({
    queryKey: ["professors"],
    queryFn: professorsService.getProfessors,
    staleTime: 1000 * 60 * 5,
  });

  // ── Calcular estadísticas ──
  const stats = useMemo(() => {
    if (!athletes) return { total: 0, medals: 0, championships: 0, golds: 0 };

    let medals = 0;
    let golds = 0;
    const champSet = new Set<string>();

    athletes.forEach((a: Athlete) => {
      a.campeonatos?.forEach((c: Championship) => {
        champSet.add(c.campeonato);
        const pos = String(c.posicion).trim();
        if (["1", "Oro"].includes(pos)) { medals++; golds++; }
        else if (["2", "3", "Plata", "Bronce"].includes(pos)) { medals++; }
      });
    });

    return {
      total: athletes.length,
      medals,
      championships: champSet.size,
      golds,
    };
  }, [athletes]);

  if (!session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="material-icons-round animate-spin text-4xl text-slate-300">
          autorenew
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Welcome ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Bienvenido, {session.nombre}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <Badge className={`${getRolColor(session.rol)} border-0 text-xs font-bold uppercase`}>
            {getRolLabel(session.rol)}
          </Badge>
          <span className="text-sm text-slate-500">
            Panel de control del portal
          </span>
        </div>
      </div>

      <Separator />



      {/* ── Quick Links ── */}
      <section>
        <h2 className="mb-4 text-base font-bold text-slate-700">
          Accesos Rápidos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            icon="groups"
            title="Ver Atletas"
            description="Consulta la grilla completa de atletas registrados"
            href="/atletas"
          />
          {session.rol === "atleta" && (
            <QuickLink
              icon="account_box"
              title="Mi Perfil"
              description="Revisa tu información personal y campeonatos"
              href={`/atleta/${session.id}`}
            />
          )}
          {session.rol === "atleta" && (
            <QuickLink
              icon="upload_file"
              title="Cargar Documentos"
              description="Sube tus documentos PDF requeridos"
              href={`/atleta/documentos`}
            />
          )}
          {(session.rol === "profesor" || session.rol === "admin") && (
            <QuickLink
              icon="person_add"
              title="Registrar Atleta"
              description="Agrega un nuevo atleta a la plataforma"
              href="/registro"
            />
          )}
          {(session.rol === "profesor" || session.rol === "admin") && (
            <QuickLink
              icon="workspace_premium"
              title="Gestión de Logros"
              description="Registra y consulta logros con tus atletas"
              href="/logros"
            />
          )}
        </div>
      </section>

      {/* ── Recent Athletes (preview) ── */}
      {athletes && athletes.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-700">
              Atletas Recientes
            </h2>
            <a href="/atletas" className="text-sm font-semibold hover:underline" style={{ color: "var(--primary-red)" }}>
              Ver todos →
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {athletes.slice(0, 4).map((athlete: Athlete) => (
              <a
                key={athlete.id}
                href={`/atleta/${athlete.id}`}
                className="group block no-underline"
              >
                <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="flex items-center gap-3 p-3">
                    {athlete.foto ? (
                      <img
                        src={athlete.foto}
                        alt={athlete.nombre}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <span className="material-icons-round text-slate-400" style={{ fontSize: "20px" }}>
                          person
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 group-hover:text-(--primary-red)">
                        {athlete.nombre}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {athlete.claseDeportiva || "Sin clase"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ─── Exportación pública ──────────────────────────────────────────────────────
/**
 * DashboardView — Vista del panel de control.
 *
 * Requiere sesión activa (redirige a /login si no hay).
 * Muestra estadísticas generales, accesos rápidos según el rol
 * del usuario, y un preview de los atletas más recientes.
 */
export const DashboardView: React.FC = () => (
  <QueryProvider>
    <DashboardInner />
  </QueryProvider>
);
