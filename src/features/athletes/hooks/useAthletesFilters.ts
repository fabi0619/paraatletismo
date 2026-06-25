import { useState, useMemo, useCallback, useDeferredValue } from "react";
import { CLASES_DEPORTIVAS } from "../../../lib/classes";
import type { Athlete } from "../api/athletesService";

export interface AthletesFilters {
  search: string;
  discapacidad: string;
  tipoClase: string;
  claseDeportiva: string;
}

const DEFAULT_FILTERS: AthletesFilters = {
  search: "",
  discapacidad: "all",
  tipoClase: "all",
  claseDeportiva: "all",
};

export function getFilteredClases(discapacidad: string, tipoClase: string) {
  let filtered = CLASES_DEPORTIVAS;

  if (discapacidad !== "all") {
    filtered = filtered.filter((c) => c.discapacidad === discapacidad);
  }

  if (tipoClase !== "all") {
    filtered = filtered.filter((c) => c.tipo === tipoClase);
  }

  return filtered;
}

export function useAthletesFilters(athletes: Athlete[] | undefined) {
  const [filters, setFilters] = useState<AthletesFilters>(DEFAULT_FILTERS);
  const deferredSearch = useDeferredValue(filters.search);

  const updateFilter = useCallback(
    <K extends keyof AthletesFilters>(key: K, value: AthletesFilters[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "discapacidad" || key === "tipoClase") {
          next.claseDeportiva = "all";
        }
        return next;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const availableClases = useMemo(
    () => getFilteredClases(filters.discapacidad, filters.tipoClase),
    [filters.discapacidad, filters.tipoClase]
  );

  const filteredAthletes = useMemo(() => {
    if (!athletes) return [];

    return athletes.filter((athlete) => {
      const term = deferredSearch.toLowerCase();
      const matchesSearch =
        !term ||
        (athlete.nombre || "").toLowerCase().includes(term) ||
        (athlete.cedula || "").toLowerCase().includes(term);

      const matchesDiscapacidad =
        filters.discapacidad === "all" ||
        (athlete.discapacidad &&
          athlete.discapacidad
            .toLowerCase()
            .includes(filters.discapacidad.toLowerCase()));

      const matchesTipoClase =
        filters.tipoClase === "all" ||
        (athlete.tipoClase &&
          athlete.tipoClase.toLowerCase() === filters.tipoClase.toLowerCase());

      const matchesClase =
        filters.claseDeportiva === "all" ||
        athlete.claseDeportiva === filters.claseDeportiva;

      return (
        matchesSearch &&
        matchesDiscapacidad &&
        matchesTipoClase &&
        matchesClase
      );
    });
  }, [
    athletes,
    deferredSearch,
    filters.discapacidad,
    filters.tipoClase,
    filters.claseDeportiva,
  ]);

  const isFiltering = deferredSearch !== filters.search;
  const hasActiveFilters =
    filters.search !== "" ||
    filters.discapacidad !== "all" ||
    filters.tipoClase !== "all" ||
    filters.claseDeportiva !== "all";

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredAthletes,
    availableClases,
    isFiltering,
    hasActiveFilters,
  };
}
