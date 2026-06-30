import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useDeferredValue, useCallback, useMemo, useEffect } from 'react';
import { a as useAthletes, b as useDeleteAthlete } from './useAthletes_BlC5Zdkk.mjs';
import { C as CLASES_DEPORTIVAS } from './classes_Da4MgPJU.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from './card_B1uvd6Uf.mjs';
import { UserRound, Medal, CheckIcon, ChevronDownIcon, XIcon, RotateCcw, Plus } from 'lucide-react';
import { AspectRatio as AspectRatio$1 } from 'radix-ui';
import { I as InputGroup, a as InputGroupInput, b as InputGroupAddon, c as InputGroupButton, S as SearchInput } from './search-input_bsel3tu9.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select_Dghz8IQH.mjs';
import { Combobox as Combobox$1 } from '@base-ui/react';
import { c as cn } from './utils_B05Dmz_H.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { B as Badge } from './badge_DVRej5nP.mjs';
import { Q as QueryProvider } from './QueryProvider__3BIDRjC.mjs';
import { useQueryClient } from '@tanstack/react-query';

const DEFAULT_FILTERS = {
  search: "",
  discapacidad: "all",
  tipoClase: "all",
  claseDeportiva: "all"
};
function getFilteredClases(discapacidad, tipoClase) {
  let filtered = CLASES_DEPORTIVAS;
  if (discapacidad !== "all") {
    filtered = filtered.filter((c) => c.discapacidad === discapacidad);
  }
  if (tipoClase !== "all") {
    filtered = filtered.filter((c) => c.tipo === tipoClase);
  }
  return filtered;
}
function useAthletesFilters(athletes) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const deferredSearch = useDeferredValue(filters.search);
  const updateFilter = useCallback(
    (key, value) => {
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
      const matchesSearch = !term || (athlete.nombre || "").toLowerCase().includes(term) || (athlete.cedula || "").toLowerCase().includes(term);
      const matchesDiscapacidad = filters.discapacidad === "all" || athlete.discapacidad && athlete.discapacidad.toLowerCase().includes(filters.discapacidad.toLowerCase());
      const matchesTipoClase = filters.tipoClase === "all" || athlete.tipoClase && athlete.tipoClase.toLowerCase() === filters.tipoClase.toLowerCase();
      const matchesClase = filters.claseDeportiva === "all" || athlete.claseDeportiva === filters.claseDeportiva;
      return matchesSearch && matchesDiscapacidad && matchesTipoClase && matchesClase;
    });
  }, [
    athletes,
    deferredSearch,
    filters.discapacidad,
    filters.tipoClase,
    filters.claseDeportiva
  ]);
  const isFiltering = deferredSearch !== filters.search;
  const hasActiveFilters = filters.search !== "" || filters.discapacidad !== "all" || filters.tipoClase !== "all" || filters.claseDeportiva !== "all";
  return {
    filters,
    updateFilter,
    resetFilters,
    filteredAthletes,
    availableClases,
    isFiltering,
    hasActiveFilters
  };
}

function AspectRatio({
  ...props
}) {
  return /* @__PURE__ */ jsx(AspectRatio$1.Root, { "data-slot": "aspect-ratio", ...props });
}

const AthleteCard = ({
  athlete,
  onClick,
  canEdit = false,
  onEdit,
  onDelete
}) => {
  const gold = athlete.campeonatos?.filter((c) => c.posicion === "1").length || 0;
  const silver = athlete.campeonatos?.filter((c) => c.posicion === "2").length || 0;
  const bronze = athlete.campeonatos?.filter((c) => c.posicion === "3").length || 0;
  return /* @__PURE__ */ jsxs(
    Card,
    {
      onClick,
      className: "group flex h-full cursor-pointer flex-col overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/50 backdrop-blur-xl relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/70",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "p-3 pb-0", children: /* @__PURE__ */ jsx(AspectRatio, { ratio: 4 / 5, children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner", children: [
          athlete.foto ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: athlete.foto,
                alt: athlete.nombre,
                className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center bg-slate-800", children: /* @__PURE__ */ jsx(UserRound, { size: 64, className: "text-slate-400" }) }),
          canEdit && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 flex gap-1 z-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onEdit?.();
                },
                className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-white text-slate-700 transition-colors",
                title: "Editar atleta",
                children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "edit" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onDelete?.();
                },
                className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-red-50 text-red-600 transition-colors",
                title: "Eliminar atleta",
                children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "delete" })
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2 pt-4 px-5 relative z-10", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "truncate text-xl font-black text-slate-800 group-hover:text-red-700 transition-colors", children: athlete.nombre }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-black text-red-600 drop-shadow-sm", children: athlete.club || "Atleta Valle" }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-bold text-slate-500 tracking-wide mt-1", children: [
            athlete.discapacidad?.replace("Discapacidad ", ""),
            athlete.claseDeportiva ? `Clase ${athlete.claseDeportiva}` : null
          ].filter(Boolean).join(" · ") || "Sin clasificación" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "mt-auto pt-2 px-5 pb-5 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-3 border-t border-white/60", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-yellow-100/50 px-2 py-1 rounded-full border border-yellow-200/50", title: "Oro", children: [
            /* @__PURE__ */ jsx(Medal, { size: 16, className: "fill-yellow-400 text-yellow-600 drop-shadow-sm" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-700", children: gold })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-slate-200/50 px-2 py-1 rounded-full border border-slate-300/50", title: "Plata", children: [
            /* @__PURE__ */ jsx(Medal, { size: 16, className: "fill-slate-300 text-slate-500 drop-shadow-sm" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-700", children: silver })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-orange-100/50 px-2 py-1 rounded-full border border-orange-200/50", title: "Bronce", children: [
            /* @__PURE__ */ jsx(Medal, { size: 16, className: "fill-orange-400 text-orange-600 drop-shadow-sm" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-700", children: bronze })
          ] })
        ] }) })
      ]
    }
  );
};

const Combobox = Combobox$1.Root;
function ComboboxTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Combobox$1.Trigger,
    {
      "data-slot": "combobox-trigger",
      className: cn("[&_svg:not([class*='size-'])]:size-4", className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" })
      ]
    }
  );
}
function ComboboxClear({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.Clear,
    {
      "data-slot": "combobox-clear",
      render: /* @__PURE__ */ jsx(InputGroupButton, { variant: "ghost", size: "icon-xs" }),
      className: cn(className),
      ...props,
      children: /* @__PURE__ */ jsx(XIcon, { className: "pointer-events-none" })
    }
  );
}
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}) {
  return /* @__PURE__ */ jsxs(InputGroup, { className: cn("w-auto", className), children: [
    /* @__PURE__ */ jsx(
      Combobox$1.Input,
      {
        render: /* @__PURE__ */ jsx(InputGroupInput, { disabled }),
        ...props
      }
    ),
    /* @__PURE__ */ jsxs(InputGroupAddon, { align: "inline-end", children: [
      showTrigger && /* @__PURE__ */ jsx(
        InputGroupButton,
        {
          size: "icon-xs",
          variant: "ghost",
          asChild: true,
          "data-slot": "input-group-button",
          className: "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent",
          disabled,
          children: /* @__PURE__ */ jsx(ComboboxTrigger, {})
        }
      ),
      showClear && /* @__PURE__ */ jsx(ComboboxClear, { disabled })
    ] }),
    children
  ] });
}
function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}) {
  return /* @__PURE__ */ jsx(Combobox$1.Portal, { children: /* @__PURE__ */ jsx(
    Combobox$1.Positioner,
    {
      side,
      sideOffset,
      align,
      alignOffset,
      anchor,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsx(
        Combobox$1.Popup,
        {
          "data-slot": "combobox-content",
          "data-chips": !!anchor,
          className: cn("group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
          ...props
        }
      )
    }
  ) });
}
function ComboboxList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.List,
    {
      "data-slot": "combobox-list",
      className: cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      ),
      ...props
    }
  );
}
function ComboboxItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Combobox$1.Item,
    {
      "data-slot": "combobox-item",
      className: cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(
          Combobox$1.ItemIndicator,
          {
            render: /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
            children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" })
          }
        )
      ]
    }
  );
}
function ComboboxEmpty({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.Empty,
    {
      "data-slot": "combobox-empty",
      className: cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className
      ),
      ...props
    }
  );
}

const DISCAPACIDAD_OPTIONS = [
  { value: "all", label: "Todas las discapacidades" },
  { value: "fisica", label: "Física" },
  { value: "visual", label: "Visual" },
  { value: "intelectual", label: "Intelectual" },
  { value: "auditiva", label: "Auditiva" }
];
const TIPO_CLASE_OPTIONS = [
  { value: "all", label: "Todas (T / F)" },
  { value: "pista", label: "Pista (T)" },
  { value: "campo", label: "Campo (F)" }
];
function ClaseDeportivaCombobox({
  value,
  onChange,
  availableClases
}) {
  const items = useMemo(
    () => availableClases.map((c) => c.clase),
    [availableClases]
  );
  return /* @__PURE__ */ jsxs(
    Combobox,
    {
      value: value === "all" ? null : value,
      onValueChange: (v) => onChange(v ?? "all"),
      items,
      children: [
        /* @__PURE__ */ jsx(
          ComboboxInput,
          {
            placeholder: "Todas las clases",
            className: "min-w-[200px]",
            showClear: value !== "all"
          }
        ),
        /* @__PURE__ */ jsxs(ComboboxContent, { children: [
          /* @__PURE__ */ jsx(ComboboxEmpty, { children: "Sin clases disponibles." }),
          /* @__PURE__ */ jsx(ComboboxList, { children: (item) => /* @__PURE__ */ jsx(ComboboxItem, { value: item, children: item }, item) })
        ] })
      ]
    }
  );
}
function AthletesFilters({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  availableClases,
  resultsCount,
  isLoading
}) {
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsx(
      SearchInput,
      {
        value: filters.search,
        onChange: (v) => onFilterChange("search", v),
        placeholder: "Buscar atleta por nombre o cédula...",
        resultsCount: isLoading ? void 0 : resultsCount,
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: filters.discapacidad,
          onValueChange: (v) => onFilterChange("discapacidad", v),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[200px]", children: /* @__PURE__ */ jsx(SelectValue, { children: DISCAPACIDAD_OPTIONS.find(
              (o) => o.value === filters.discapacidad
            )?.label }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: DISCAPACIDAD_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Select,
        {
          value: filters.tipoClase,
          onValueChange: (v) => onFilterChange("tipoClase", v),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "min-w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, { children: TIPO_CLASE_OPTIONS.find((o) => o.value === filters.tipoClase)?.label }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: TIPO_CLASE_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        ClaseDeportivaCombobox,
        {
          value: filters.claseDeportiva,
          onChange: (v) => onFilterChange("claseDeportiva", v),
          availableClases
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "lg",
          onClick: onReset,
          disabled: !hasActiveFilters,
          children: [
            /* @__PURE__ */ jsx(RotateCcw, { "data-icon": "inline-start" }),
            "Restablecer"
          ]
        }
      )
    ] })
  ] });
}

function AthletesGridSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: [...Array(8)].map((_, i) => /* @__PURE__ */ jsxs(Card, { className: "flex flex-col overflow-hidden pt-0", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-36 rounded-none" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-2/3" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-auto px-4 pb-4", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) })
  ] }, i)) });
}
function AthletesEmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl text-slate-300", children: "sentiment_dissatisfied" }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "No se encontraron atletas" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: "Intenta ajustar los criterios de búsqueda o cambiar los filtros seleccionados." })
  ] });
}
const AthletesGridInner = ({ initialData }) => {
  const { data: athletes, isLoading, isError, error } = useAthletes(initialData);
  const deleteAthleteMutation = useDeleteAthlete();
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);
  useEffect(() => {
    window.refreshAthletesData = () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    };
    return () => {
      delete window.refreshAthletesData;
    };
  }, [queryClient]);
  const canEdit = session?.rol === "admin" || session?.rol === "profesor";
  const handleDelete = async (id) => {
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
    hasActiveFilters
  } = useAthletesFilters(athletes);
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-2 text-4xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Error al cargar los atletas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: error?.message })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsx(
      AthletesFilters,
      {
        filters,
        onFilterChange: updateFilter,
        onReset: resetFilters,
        hasActiveFilters,
        availableClases,
        resultsCount: filteredAthletes.length,
        isLoading
      }
    ),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900", children: "Nuestros Atletas" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: "rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase",
              children: isLoading ? "Cargando..." : `Mostrando ${filteredAthletes.length} atletas`
            }
          )
        ] }),
        canEdit && /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => {
              if (window.openAthleteModal) {
                window.openAthleteModal();
              }
            },
            className: "bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl transition-all shadow-md hover:shadow-lg",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              "Registrar Nuevo Atleta"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsx(AthletesGridSkeleton, {}) : filteredAthletes.length > 0 ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          style: {
            opacity: isFiltering ? 0.7 : 1,
            transition: "opacity 150ms"
          },
          children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsx(
            AthleteCard,
            {
              athlete,
              onClick: () => window.location.href = `/atleta/${athlete.id}`,
              canEdit,
              onEdit: () => {
                if (window.openAthleteModal) {
                  window.openAthleteModal(athlete);
                }
              },
              onDelete: () => handleDelete(athlete.id)
            },
            athlete.id
          ))
        }
      ) : /* @__PURE__ */ jsx(AthletesEmptyState, {})
    ] })
  ] });
};
const AthletesView = ({ initialData }) => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(AthletesGridInner, { initialData }) });
};

export { AthletesGridSkeleton as A, AthletesView as a };
