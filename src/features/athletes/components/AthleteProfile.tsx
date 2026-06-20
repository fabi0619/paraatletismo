import React from "react";
import { useAthlete } from "../hooks/useAthletes";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Medal } from "lucide-react";

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
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-1/4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const AthleteProfileInner: React.FC<{ id: string }> = ({ id }) => {
  const { data: athlete, isLoading, isError, error } = useAthlete(id);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !athlete) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-4 text-6xl">
          error_outline
        </span>
        <h2 className="text-2xl font-black">Atleta no encontrado</h2>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "No se pudo cargar la información del atleta."}
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };

  const gold =
    athlete.campeonatos?.filter((c) => c.posicion === "1").length || 0;
  const silver =
    athlete.campeonatos?.filter((c) => c.posicion === "2").length || 0;
  const bronze =
    athlete.campeonatos?.filter((c) => c.posicion === "3").length || 0;

  const infoItems = [
    { label: "Clasificación", value: athlete.claseDeportiva, badge: true },
    { label: "Edad", value: calculateAge(athlete.fechaNacimiento) },
    { label: "Club", value: athlete.club },
    { label: "Discapacidad", value: athlete.discapacidad },
    { label: "Género", value: athlete.genero },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <Card className="border-none bg-slate-900">
          <CardContent className="flex items-center p-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Regresar
            </button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left — Photo & Identity */}
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl">
                {athlete.foto ? (
                  <img
                    src={athlete.foto}
                    alt={athlete.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <span className="material-icons-round text-6xl text-slate-600">
                      person
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl leading-tight font-black text-black">
                {athlete.nombre.split(" ")[0]}
              </h2>
              <p className="text-lg font-bold text-red-600">
                {athlete.nombre.split(" ").slice(1).join(" ")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {athlete.club || "Sin club"}
              </p>
            </CardContent>
          </Card>

          {/* Right — Info & Medals */}
          <div className="space-y-6 md:col-span-2">
            {/* Medals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons-round text-red-600">
                    emoji_events
                  </span>
                  Medallas Obtenidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                    <Medal className="fill-yellow-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {gold}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-yellow-700 uppercase">
                      Oro
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Medal className="fill-slate-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {silver}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Plata
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <Medal className="fill-orange-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {bronze}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-orange-700 uppercase">
                      Bronce
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Atleta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          {item.value || "N/A"}
                        </span>
                      ) : (
                        <span className="text-right font-bold text-slate-700">
                          {item.value || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Championship History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons-round text-red-600">history</span>
              Historial Deportivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {athlete.campeonatos && athlete.campeonatos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {athlete.campeonatos.map((camp) => (
                  <div
                    key={camp.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-muted-foreground">
                        {camp.fecha?.split("-")[0]}
                      </span>
                      {camp.posicion && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                            camp.posicion === "1"
                              ? "bg-yellow-100 text-yellow-800"
                              : camp.posicion === "2"
                                ? "bg-slate-200 text-slate-800"
                                : camp.posicion === "3"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Pos {camp.posicion}
                        </span>
                      )}
                    </div>
                    <h4 className="mb-2 text-sm font-black text-slate-800">
                      {camp.campeonato}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Prueba:{" "}
                        <span className="font-medium text-slate-700">
                          {camp.prueba}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Marca:{" "}
                        <span className="font-bold text-red-600">
                          {camp.marca}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                <span className="material-icons-round mb-2 text-4xl text-slate-300">
                  history
                </span>
                <p className="text-sm font-bold text-muted-foreground">
                  Sin historial registrado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AthleteProfile: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryProvider>
      <AthleteProfileInner id={id} />
    </QueryProvider>
  );
};
