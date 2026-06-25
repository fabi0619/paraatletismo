import React, { useState, useMemo } from "react";
import { useChampionships } from "../hooks/useChampionships";
import { Card, CardTitle, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { SearchInput } from "../../../components/search-input";
import { Trophy, MapPin, Calendar, UserRound } from "lucide-react";

function ChampionshipsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden pt-0 border-b-4 border-b-red-500">
          <div className="h-2 bg-red-500 w-full" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ChampionshipsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
      <span className="material-icons-round mb-4 text-6xl text-slate-300">
        emoji_events
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        No se encontraron campeonatos
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Intenta ajustar la búsqueda de campeonatos.
      </p>
    </div>
  );
}

const CampeonatosInner: React.FC = () => {
  const { data: championships, isLoading, isError, error } = useChampionships();
  const [search, setSearch] = useState("");

  const filteredChampionships = useMemo(() => {
    if (!championships) return [];
    const query = search.toLowerCase().trim();
    if (!query) return championships;
    return championships.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.ciudad.toLowerCase().includes(query) ||
        c.departamento.toLowerCase().includes(query) ||
        c.pais.toLowerCase().includes(query) ||
        (c.creadoPorNombre && c.creadoPorNombre.toLowerCase().includes(query))
    );
  }, [championships, search]);

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-2 text-4xl">error_outline</span>
        <h3 className="text-lg font-bold">Error al cargar los campeonatos</h3>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar campeonato por nombre, lugar, creador..."
          resultsCount={isLoading ? undefined : filteredChampionships.length}
          className="w-full"
        />
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="material-icons-round text-red-500">emoji_events</span>
            Campeonatos y Eventos Oficiales
          </h2>
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase"
          >
            {isLoading
              ? "Cargando..."
              : `Mostrando ${filteredChampionships.length} campeonatos`}
          </Badge>
        </div>

        {isLoading ? (
          <ChampionshipsGridSkeleton />
        ) : filteredChampionships.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredChampionships.map((c) => (
              <Card
                key={c.id}
                className="group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100">
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Trophy size={20} />
                  </div>
                  <CardTitle className="pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors">
                    {c.nombre}
                  </CardTitle>
                </div>

                <CardContent className="flex flex-col gap-3 p-6 pt-5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>Lugar: {c.ciudad}, {c.departamento}, {c.pais}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Fecha: {c.fechaTexto || `${c.fechaInicio} / ${c.fechaFin}`}</span>
                  </div>
                  <div className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                    <UserRound size={12} className="text-slate-400" />
                    <span>Organizado por: <strong>{c.creadoPorNombre}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ChampionshipsEmptyState />
        )}
      </section>
    </div>
  );
};

export const CampeonatosView: React.FC = () => {
  return (
    <QueryProvider>
      <CampeonatosInner />
    </QueryProvider>
  );
};
