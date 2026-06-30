import React, { useState, useEffect } from "react";
import { useAthletes, useDeleteAthlete } from "../hooks/useAthletes";
import { useAthletesFilters } from "../hooks/useAthletesFilters";
import { AthleteCard } from "./AthleteCard";
import { AthletesFilters } from "./AthletesFilters";
import { Skeleton } from "../../../components/ui/skeleton";
import { Card } from "../../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
}

export function AthletesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden pt-0">
          <Skeleton className="h-36 rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="mt-auto px-4 pb-4">
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function AthletesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
      <span className="material-icons-round mb-4 text-6xl text-slate-300">
        sentiment_dissatisfied
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        No se encontraron atletas
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Intenta ajustar los criterios de búsqueda o cambiar los filtros
        seleccionados.
      </p>
    </div>
  );
}

const AthletesGridInner: React.FC<{ initialData?: any }> = ({ initialData }) => {
  const { data: athletes, isLoading, isError, error } = useAthletes(initialData);
  const deleteAthleteMutation = useDeleteAthlete();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);

  useEffect(() => {
    (window as any).refreshAthletesData = () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    };
    return () => {
      delete (window as any).refreshAthletesData;
    };
  }, [queryClient]);

  const canEdit = session?.rol === "admin" || session?.rol === "profesor";

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este atleta?")) return;
    try {
      await deleteAthleteMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar atleta.");
    }
  };

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredAthletes,
    availableClases,
    isFiltering,
    hasActiveFilters,
  } = useAthletesFilters(athletes);

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-2 text-4xl">
          error_outline
        </span>
        <h3 className="text-lg font-bold">Error al cargar los atletas</h3>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AthletesFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        availableClases={availableClases}
        resultsCount={filteredAthletes.length}
        isLoading={isLoading}
      />

      <section>
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">
              Nuestros Atletas
            </h2>
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >
              {isLoading
                ? "Cargando..."
                : `Mostrando ${filteredAthletes.length} atletas`}
            </Badge>
          </div>

          {canEdit && (
            <Button
              onClick={() => {
                if ((window as any).openAthleteModal) {
                  (window as any).openAthleteModal();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} />
              Registrar Nuevo Atleta
            </Button>
          )}
        </div>

        {isLoading ? (
          <AthletesGridSkeleton />
        ) : filteredAthletes.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={{
              opacity: isFiltering ? 0.7 : 1,
              transition: "opacity 150ms",
            }}
          >
            {filteredAthletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onClick={() => (window.location.href = `/atleta/${athlete.id}`)}
                canEdit={canEdit}
                onEdit={() => {
                  if ((window as any).openAthleteModal) {
                    (window as any).openAthleteModal(athlete);
                  }
                }}
                onDelete={() => handleDelete(athlete.id)}
              />
            ))}
          </div>
        ) : (
          <AthletesEmptyState />
        )}
      </section>
    </div>
  );
};

export const AthletesView: React.FC<{ initialData?: any }> = ({ initialData }) => {
  return (
    <QueryProvider>
      <AthletesGridInner initialData={initialData} />
    </QueryProvider>
  );
};
