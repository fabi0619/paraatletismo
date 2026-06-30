import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$MainLayout } from './MainLayout_D5u_EKrR.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { u as useChampionships, a as useCreateChampionship } from './useChampionships_Cbqq4OpZ.mjs';
import { C as Card, b as CardTitle, d as CardContent } from './card_B1uvd6Uf.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { B as Badge } from './badge_DVRej5nP.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { Q as QueryProvider } from './QueryProvider__3BIDRjC.mjs';
import { S as SearchInput } from './search-input_bsel3tu9.mjs';
import { Plus, Trophy, MapPin, Calendar, UserRound, X } from 'lucide-react';

function ChampionshipsGridSkeleton() {
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
function ChampionshipsEmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl text-slate-300", children: "emoji_events" }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "No se encontraron campeonatos" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: "Intenta ajustar la búsqueda de campeonatos." })
  ] });
}
const CampeonatosInner = () => {
  const { data: championships, isLoading, isError, error } = useChampionships();
  const createChampionshipMutation = useCreateChampionship();
  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [departamento, setDepartamento] = useState("Valle del Cauca");
  const [ciudad, setCiudad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [fechaTexto, setFechaTexto] = useState("");
  const [formError, setFormError] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);
  const filteredChampionships = useMemo(() => {
    if (!championships) return [];
    const query = search.toLowerCase().trim();
    if (!query) return championships;
    return championships.filter(
      (c) => c.nombre.toLowerCase().includes(query) || c.ciudad.toLowerCase().includes(query) || c.departamento.toLowerCase().includes(query) || c.pais.toLowerCase().includes(query) || c.creadoPorNombre && c.creadoPorNombre.toLowerCase().includes(query)
    );
  }, [championships, search]);
  const canCreate = session?.rol === "profesor" || session?.rol === "admin";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!nombre.trim() || !ciudad.trim() || !fechaInicio || !fechaFin) {
      setFormError("Por favor completa los campos obligatorios (*)");
      return;
    }
    try {
      await createChampionshipMutation.mutateAsync({
        nombre,
        pais,
        departamento,
        ciudad,
        fechaInicio,
        fechaFin,
        fechaTexto: fechaTexto || `${fechaInicio} / ${fechaFin}`,
        creadoPor: session?.id || "admin",
        creadoPorNombre: session?.nombre || "Administrador"
      });
      setNombre("");
      setCiudad("");
      setFechaInicio("");
      setFechaFin("");
      setFechaTexto("");
      setShowModal(false);
    } catch (err) {
      setFormError(err.message || "Error al crear el campeonato.");
    }
  };
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-2 text-4xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Error al cargar los campeonatos" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: error?.message })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsx("section", { className: "flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsx(
      SearchInput,
      {
        value: search,
        onChange: setSearch,
        placeholder: "Buscar campeonato por nombre, lugar, creador...",
        resultsCount: isLoading ? void 0 : filteredChampionships.length,
        className: "w-full"
      }
    ) }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-500 text-2xl", children: "emoji_events" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900", children: "Campeonatos y Eventos Oficiales" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: "rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase",
              children: isLoading ? "Cargando..." : `${filteredChampionships.length} campeonatos`
            }
          )
        ] }),
        canCreate && /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => setShowModal(true),
            className: "bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl transition-all shadow-md hover:shadow-lg",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              "Crear Evento"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsx(ChampionshipsGridSkeleton, {}) : filteredChampionships.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filteredChampionships.map((c) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500", children: /* @__PURE__ */ jsx(Trophy, { size: 20 }) }),
              /* @__PURE__ */ jsx(CardTitle, { className: "pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors", children: c.nombre })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-3 p-6 pt-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 14, className: "text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Lugar: ",
                  c.ciudad,
                  ", ",
                  c.departamento,
                  ", ",
                  c.pais
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 14, className: "text-slate-400 shrink-0" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Fecha: ",
                  c.fechaTexto || `${c.fechaInicio} / ${c.fechaFin}`
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500", children: [
                /* @__PURE__ */ jsx(UserRound, { size: 12, className: "text-slate-400" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Organizado por: ",
                  /* @__PURE__ */ jsx("strong", { children: c.creadoPorNombre })
                ] })
              ] })
            ] })
          ]
        },
        c.id
      )) }) : /* @__PURE__ */ jsx(ChampionshipsEmptyState, {})
    ] }),
    showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Trophy, { size: 20 }),
          /* @__PURE__ */ jsx("h3", { className: "font-black text-lg", children: "Registrar Campeonato" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowModal(false),
            className: "rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 flex flex-col gap-4", children: [
        formError && /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600", children: formError }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
            "Nombre del Evento ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ej. Juegos Deportivos Nacionales",
              value: nombre,
              onChange: (e) => setNombre(e.target.value),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: "País" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: pais,
                onChange: (e) => setPais(e.target.value),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: "Departamento" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: departamento,
                onChange: (e) => setDepartamento(e.target.value),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
            "Ciudad ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ej. Cali",
              value: ciudad,
              onChange: (e) => setCiudad(e.target.value),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Fecha Inicio ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: fechaInicio,
                onChange: (e) => setFechaInicio(e.target.value),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Fecha Fin ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: fechaFin,
                onChange: (e) => setFechaFin(e.target.value),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden",
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: "Texto de Rango de Fechas (Opcional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Ej. 10 al 15 de Octubre 2026",
              value: fechaTexto,
              onChange: (e) => setFechaTexto(e.target.value),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-3 border-t pt-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setShowModal(false),
              className: "rounded-xl",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              disabled: createChampionshipMutation.isPending,
              className: "bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl",
              children: createChampionshipMutation.isPending ? "Guardando..." : "Guardar Evento"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const CampeonatosView = () => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(CampeonatosInner, {}) });
};

const $$Campeonatos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Campeonatos - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CampeonatosView", CampeonatosView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/championships/components/CampeonatosView", "client:component-export": "CampeonatosView" })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/campeonatos.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/campeonatos.astro";
const $$url = "/campeonatos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Campeonatos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
