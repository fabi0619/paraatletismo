import React, { useState, useMemo } from "react";
import { useProfessors } from "../hooks/useProfessors";
import { Card, CardTitle, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { SearchInput } from "../../../components/search-input";
import { GraduationCap, Mail, IdCard, CalendarDays } from "lucide-react";

export function ProfessorsGridSkeleton() {
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

function ProfessorsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
      <span className="material-icons-round mb-4 text-6xl text-slate-300">
        sentiment_dissatisfied
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        No se encontraron profesores
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Intenta ajustar la búsqueda.
      </p>
    </div>
  );
}

const ProfesoresInner: React.FC<{ initialData?: any }> = ({ initialData }) => {
  const { data: professors, isLoading, isError, error } = useProfessors(initialData);
  const [search, setSearch] = useState("");

  const filteredProfessors = useMemo(() => {
    if (!professors) return [];
    const query = search.toLowerCase().trim();
    if (!query) return professors;
    return professors.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.especialidad.toLowerCase().includes(query) ||
        p.correo.toLowerCase().includes(query) ||
        p.cedula.includes(query)
    );
  }, [professors, search]);

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-2 text-4xl">error_outline</span>
        <h3 className="text-lg font-bold">Error al cargar los profesores</h3>
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
          placeholder="Buscar profesor por nombre, especialidad, correo..."
          resultsCount={isLoading ? undefined : filteredProfessors.length}
          className="w-full"
        />
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="material-icons-round text-red-500">sports</span>
            Entrenadores y Profesores
          </h2>
          <Badge
            variant="secondary"
            className="rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase"
          >
            {isLoading
              ? "Cargando..."
              : `Mostrando ${filteredProfessors.length} entrenadores`}
          </Badge>
        </div>

        {isLoading ? (
          <ProfessorsGridSkeleton />
        ) : filteredProfessors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProfessors.map((professor) => (
              <Card
                key={professor.id}
                onClick={() => window.location.href = `/profesor/${professor.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100">
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <span className="material-icons-round" style={{ fontSize: "20px" }}>sports</span>
                  </div>
                  <CardTitle className="pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors">
                    {professor.nombre}
                  </CardTitle>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-red-500">
                    <GraduationCap size={15} />
                    {professor.especialidad || "Entrenador Valle"}
                  </p>
                </div>

                <CardContent className="flex flex-col gap-3 p-6 pt-5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate" title={professor.correo}>{professor.correo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <IdCard size={14} className="text-slate-400 shrink-0" />
                    <span>Cédula: {professor.cedula}</span>
                  </div>
                  {professor.fechaNacimiento && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CalendarDays size={14} className="text-slate-400 shrink-0" />
                      <span>F. Nacimiento: {professor.fechaNacimiento}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ProfessorsEmptyState />
        )}
      </section>
    </div>
  );
};

export const ProfesoresView: React.FC<{ initialData?: any }> = ({ initialData }) => {
  return (
    <QueryProvider>
      <ProfesoresInner initialData={initialData} />
    </QueryProvider>
  );
};
