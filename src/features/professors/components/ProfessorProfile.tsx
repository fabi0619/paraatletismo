import React, { useState, useEffect } from "react";
import { useProfessor, useProfessorAchievements } from "../hooks/useProfessors";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Award, Mail, IdCard, Phone, Calendar, Shield } from "lucide-react";

interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
}

const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/3" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const ProfessorProfileInner: React.FC<{ id: string }> = ({ id }) => {
  const { data: professor, isLoading, isError, error } = useProfessor(id);
  const { data: achievements, isLoading: achievementsLoading } = useProfessorAchievements(id);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !professor) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-4 text-6xl">error_outline</span>
        <h2 className="text-2xl font-black">Entrenador no encontrado</h2>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "No se pudo cargar la información del entrenador."}
        </p>
        <button
          onClick={() => (window.location.href = "/profesores")}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white"
        >
          Volver a Entrenadores
        </button>
      </div>
    );
  }

  const isSelf = session?.id === professor.id || session?.rol === "admin";

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };

  const infoItems = [
    { label: "Especialidad", value: professor.especialidad, icon: <Shield size={16} className="text-red-500" /> },
    { label: "Cédula", value: professor.cedula, icon: <IdCard size={16} className="text-slate-500" /> },
    { label: "Edad", value: professor.fechaNacimiento ? `${calculateAge(professor.fechaNacimiento)} (${professor.fechaNacimiento})` : "N/A", icon: <Calendar size={16} className="text-green-500" /> },
    { label: "Correo", value: professor.correo, icon: <Mail size={16} className="text-orange-500" /> },
    { label: "Teléfono", value: professor.telefono || "N/A", icon: <Phone size={16} className="text-teal-500" /> },
    { label: "Género", value: professor.genero || "N/A", icon: <span className="material-icons-round text-sm text-purple-500">transgender</span> },
  ];

  const handleEditClick = () => {
    if ((window as any).openCoachModal) {
      (window as any).openCoachModal(professor);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Bar */}
        <Card className="border-none bg-slate-900 text-white">
          <CardContent className="flex items-center justify-between p-4 flex-wrap gap-4">
            <button
              onClick={() => (window.location.href = "/profesores")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Ver Entrenadores
            </button>
            {isSelf && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 shadow-md"
              >
                <span className="material-icons-round text-sm">edit</span>
                Editar Perfil
              </button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Panel: Photo & Identity */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl bg-slate-100">
                {professor.foto ? (
                  <img
                    src={professor.foto}
                    alt={professor.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <span className="material-icons-round text-6xl text-slate-500">
                      sports
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl leading-tight font-black text-black">
                {professor.nombre.split(" ")[0]}
              </h2>
              <p className="text-lg font-bold text-red-600">
                {professor.nombre.split(" ").slice(1).join(" ")}
              </p>
              <p className="mt-1 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {professor.especialidad || "Entrenador Valle"}
              </p>
            </CardContent>
          </Card>

          {/* Right Panel: Info & Achievements */}
          <div className="space-y-6 md:col-span-2">
            {/* Detailed Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="material-icons-round text-red-600">assignment_ind</span>
                  Información Personal y Profesional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="text-right text-sm font-bold text-slate-850 truncate max-w-[200px]" title={item.value}>
                        {item.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="text-red-600" />
                  Logros Deportivos Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : achievements && achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="rounded-xl border border-slate-150 bg-white p-4 shadow-sm hover:border-red-200 transition-colors flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                              {ach.ano}
                            </span>
                            <span className="text-sm font-bold text-slate-950">
                              Atleta: {ach.atletaNombre}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">
                            Evento: <span className="text-slate-700">{ach.campeonato}</span>
                          </p>
                          <p className="text-xs text-slate-600 italic mt-1 font-medium">
                            "{ach.logro}"
                          </p>
                        </div>
                        <span className="material-icons-round text-red-500 shrink-0 select-none">
                          emoji_events
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                    <span className="material-icons-round mb-2 text-4xl text-slate-350">
                      emoji_events
                    </span>
                    <p className="text-sm font-bold text-muted-foreground">
                      Sin logros registrados por este entrenador
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfessorProfile: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryProvider>
      <ProfessorProfileInner id={id} />
    </QueryProvider>
  );
};
