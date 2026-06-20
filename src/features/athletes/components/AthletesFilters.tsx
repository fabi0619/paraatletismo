import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { SearchInput } from "../../../components/search-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "../../../components/ui/combobox";
import { Button } from "../../../components/ui/button";
import type { AthletesFilters as FiltersType } from "../hooks/useAthletesFilters";

interface ClaseOption {
  clase: string;
  tipo: string;
  discapacidad: string;
  descripcion: string;
}

interface AthletesFiltersProps {
  filters: FiltersType;
  onFilterChange: <K extends keyof FiltersType>(
    key: K,
    value: FiltersType[K],
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  availableClases: ClaseOption[];
  resultsCount?: number;
  isLoading?: boolean;
}

const DISCAPACIDAD_OPTIONS = [
  { value: "all", label: "Todas las discapacidades" },
  { value: "fisica", label: "Física" },
  { value: "visual", label: "Visual" },
  { value: "intelectual", label: "Intelectual" },
  { value: "auditiva", label: "Auditiva" },
] as const;

const TIPO_CLASE_OPTIONS = [
  { value: "all", label: "Todas (T / F)" },
  { value: "pista", label: "Pista (T)" },
  { value: "campo", label: "Campo (F)" },
] as const;

function ClaseDeportivaCombobox({
  value,
  onChange,
  availableClases,
}: {
  value: string;
  onChange: (v: string) => void;
  availableClases: ClaseOption[];
}) {
  const items = useMemo(
    () => availableClases.map((c) => c.clase),
    [availableClases],
  );

  return (
    <Combobox
      value={value === "all" ? null : value}
      onValueChange={(v) => onChange(v ?? "all")}
      items={items}
    >
      <ComboboxInput
        placeholder="Todas las clases"
        className="min-w-[200px]"
        showClear={value !== "all"}
      />
      <ComboboxContent>
        <ComboboxEmpty>Sin clases disponibles.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function AthletesFilters({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  availableClases,
  resultsCount,
  isLoading,
}: AthletesFiltersProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <SearchInput
        value={filters.search}
        onChange={(v) => onFilterChange("search", v)}
        placeholder="Buscar atleta por nombre o cédula..."
        resultsCount={isLoading ? undefined : resultsCount}
        className="w-full"
      />

      <div className="flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
        <Select
          value={filters.discapacidad}
          onValueChange={(v) => onFilterChange("discapacidad", v)}
        >
          <SelectTrigger className="min-w-[200px]">
            <SelectValue>
              {
                DISCAPACIDAD_OPTIONS.find(
                  (o) => o.value === filters.discapacidad,
                )?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {DISCAPACIDAD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.tipoClase}
          onValueChange={(v) => onFilterChange("tipoClase", v)}
        >
          <SelectTrigger className="min-w-[160px]">
            <SelectValue>
              {
                TIPO_CLASE_OPTIONS.find((o) => o.value === filters.tipoClase)
                  ?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIPO_CLASE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ClaseDeportivaCombobox
          value={filters.claseDeportiva}
          onChange={(v) => onFilterChange("claseDeportiva", v)}
          availableClases={availableClases}
        />

        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          <RotateCcw data-icon="inline-start" />
          Restablecer
        </Button>
      </div>
    </section>
  );
}
