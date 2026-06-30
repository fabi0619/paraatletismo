import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { b as useProfessors } from './useProfessors_DnrC_Ykz.mjs';
import { C as Card, b as CardTitle, d as CardContent } from './card_B1uvd6Uf.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { B as Badge } from './badge_DVRej5nP.mjs';
import { Q as QueryProvider } from './QueryProvider__3BIDRjC.mjs';
import { S as SearchInput } from './search-input_bsel3tu9.mjs';
import { GraduationCap, Mail, IdCard, CalendarDays } from 'lucide-react';
import { p as professorsService } from './professorsService_B4TlaCRS.mjs';

function ProfessorsGridSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxs(Card, { className: "flex flex-col overflow-hidden pt-0 border-b-4 border-b-red-500", children: [
    /* @__PURE__ */ jsx("div", { className: "h-2 bg-red-500 w-full" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-5", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/3 rounded" })
    ] })
  ] }, i)) });
}
function ProfessorsEmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl text-slate-300", children: "sentiment_dissatisfied" }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "No se encontraron profesores" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: "Intenta ajustar la búsqueda." })
  ] });
}
const ProfesoresInner = ({ initialData }) => {
  const { data: professors, isLoading, isError, error } = useProfessors(initialData);
  const [search, setSearch] = useState("");
  const filteredProfessors = useMemo(() => {
    if (!professors) return [];
    const query = search.toLowerCase().trim();
    if (!query) return professors;
    return professors.filter(
      (p) => p.nombre.toLowerCase().includes(query) || p.especialidad.toLowerCase().includes(query) || p.correo.toLowerCase().includes(query) || p.cedula.includes(query)
    );
  }, [professors, search]);
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-2 text-4xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Error al cargar los profesores" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: error?.message })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsx("section", { className: "flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsx(
      SearchInput,
      {
        value: search,
        onChange: setSearch,
        placeholder: "Buscar profesor por nombre, especialidad, correo...",
        resultsCount: isLoading ? void 0 : filteredProfessors.length,
        className: "w-full"
      }
    ) }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-end justify-between border-b border-slate-100 pb-2", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-black text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-500", children: "sports" }),
          "Entrenadores y Profesores"
        ] }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: "secondary",
            className: "rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase",
            children: isLoading ? "Cargando..." : `Mostrando ${filteredProfessors.length} entrenadores`
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsx(ProfessorsGridSkeleton, {}) : filteredProfessors.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filteredProfessors.map((professor) => /* @__PURE__ */ jsxs(
        Card,
        {
          onClick: () => window.location.href = `/profesor/${professor.id}`,
          className: "group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "20px" }, children: "sports" }) }),
              /* @__PURE__ */ jsx(CardTitle, { className: "pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors", children: professor.nombre }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 flex items-center gap-1.5 text-sm font-bold text-red-500", children: [
                /* @__PURE__ */ jsx(GraduationCap, { size: 15 }),
                professor.especialidad || "Entrenador Valle"
              ] })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-3 p-6 pt-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Mail, { size: 14, className: "text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", title: professor.correo, children: professor.correo })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(IdCard, { size: 14, className: "text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Cédula: ",
                  professor.cedula
                ] })
              ] }),
              professor.fechaNacimiento && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(CalendarDays, { size: 14, className: "text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "F. Nacimiento: ",
                  professor.fechaNacimiento
                ] })
              ] })
            ] })
          ]
        },
        professor.id
      )) }) : /* @__PURE__ */ jsx(ProfessorsEmptyState, {})
    ] })
  ] });
};
const ProfesoresView = ({ initialData }) => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(ProfesoresInner, { initialData }) });
};

const $$ProfessorsIsland = createComponent(async ($$result, $$props, $$slots) => {
  let initialData = null;
  try {
    initialData = await professorsService.getProfessors();
  } catch (e) {
    console.error("Error fetching professors in Server Island:", e);
  }
  return renderTemplate`${renderComponent($$result, "ProfesoresView", ProfesoresView, { "client:load": true, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/professors/components/ProfesoresView", "client:component-export": "ProfesoresView" })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorsIsland.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorsIsland.astro";
const $$url = undefined;

export { $$ProfessorsIsland as $, ProfessorsGridSkeleton as P, $$file as a, $$url as b };
