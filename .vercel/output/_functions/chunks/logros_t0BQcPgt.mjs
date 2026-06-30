import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$MainLayout } from './MainLayout_D5u_EKrR.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { s as supabase, Q as QueryProvider } from './QueryProvider__3BIDRjC.mjs';
import { a as useAthletes } from './useAthletes_BlC5Zdkk.mjs';
import { u as useChampionships } from './useChampionships_Cbqq4OpZ.mjs';
import { C as Card, b as CardTitle, d as CardContent } from './card_B1uvd6Uf.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { B as Badge } from './badge_DVRej5nP.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { S as SearchInput } from './search-input_bsel3tu9.mjs';
import { Plus, Award, UserRound, Medal, X } from 'lucide-react';

const logrosService = {
  getLogros: async () => {
    const { data, error } = await supabase.from("para_logros").select(`
        id, profesor_id, atleta_id, atleta_nombre, campeonato, logro, ano,
        para_profesores (
          nombre
        )
      `).order("ano", { ascending: false });
    if (error) {
      console.error("Error fetching achievements:", error);
      throw new Error(error.message);
    }
    return (data || []).map((d) => ({
      id: d.id,
      profesorId: d.profesor_id,
      atletaId: d.atleta_id,
      atletaNombre: d.atleta_nombre,
      campeonato: d.campeonato,
      logro: d.logro,
      ano: d.ano,
      profesorNombre: d.para_profesores?.nombre || "Entrenador"
    }));
  },
  saveLogro: async (logro) => {
    const { data: atleta } = await supabase.from("para_athletes").select("nombre").eq("id", logro.atletaId).single();
    const atletaNombre = atleta ? atleta.nombre : "Deportista No Identificado";
    const payload = {
      profesor_id: logro.profesorId,
      atleta_id: logro.atletaId,
      atleta_nombre: atletaNombre,
      campeonato: logro.campeonato,
      logro: logro.logro,
      ano: logro.ano
    };
    const { data, error } = await supabase.from("para_logros").insert([payload]).select().single();
    if (error) {
      console.error("Error saving achievement:", error);
      throw new Error(error.message);
    }
    return data;
  }
};

function useLogros() {
  return useQuery({
    queryKey: ["logros"],
    queryFn: logrosService.getLogros
  });
}
function useCreateLogro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logrosService.saveLogro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logros"] });
    }
  });
}

function LogrosGridSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxs(Card, { className: "flex flex-col overflow-hidden pt-0 border-b-4 border-b-red-500", children: [
    /* @__PURE__ */ jsx("div", { className: "h-2 bg-red-500 w-full" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-5", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/3 rounded" })
    ] })
  ] }, i)) });
}
function LogrosEmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl text-slate-300", children: "workspace_premium" }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "No se encontraron logros registrados" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-sm text-sm text-muted-foreground", children: "Los entrenadores aún no han registrado logros deportivos." })
  ] });
}
function getMedalBadgeColor(logroText) {
  const text = logroText.toLowerCase();
  if (text.includes("oro")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (text.includes("plata")) return "bg-slate-100 text-slate-800 border-slate-200";
  if (text.includes("bronce")) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-50 text-red-700 border-red-100";
}
const LogrosInner = () => {
  const { data: logros, isLoading, isError, error } = useLogros();
  const { data: athletes } = useAthletes();
  const { data: championships } = useChampionships();
  const createLogroMutation = useCreateLogro();
  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [atletaId, setAtletaId] = useState("");
  const [selectedChampionshipId, setSelectedChampionshipId] = useState("");
  const [prueba, setPrueba] = useState("");
  const [medalla, setMedalla] = useState("Oro");
  const [detalles, setDetalles] = useState("");
  const [formError, setFormError] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);
  const filteredLogros = useMemo(() => {
    if (!logros) return [];
    const query = search.toLowerCase().trim();
    if (!query) return logros;
    return logros.filter(
      (l) => l.campeonato.toLowerCase().includes(query) || l.atletaNombre.toLowerCase().includes(query) || l.logro.toLowerCase().includes(query) || l.ano.includes(query) || l.profesorNombre && l.profesorNombre.toLowerCase().includes(query)
    );
  }, [logros, search]);
  const canCreate = session?.rol === "profesor" || session?.rol === "admin";
  const availablePruebas = useMemo(() => {
    if (!atletaId || !athletes) return [];
    const athlete = athletes.find((a) => a.id === atletaId);
    if (!athlete) return [];
    const cl = (athlete.claseDeportiva || "").trim().toUpperCase();
    if (!cl || cl === "GUIA" || cl === "AUXILIAR") {
      return ["100m", "200m", "400m", "Salto Largo", "Lanzamiento de Bala"];
    }
    if (cl.startsWith("T")) {
      return [
        `100m ${cl}`,
        `200m ${cl}`,
        `400m ${cl}`,
        `800m ${cl}`,
        `1500m ${cl}`,
        `5000m ${cl}`,
        `10000m ${cl}`,
        `Relevos ${cl}`
      ];
    } else if (cl.startsWith("F")) {
      return [
        `Lanzamiento de Bala ${cl}`,
        `Lanzamiento de Disco ${cl}`,
        `Lanzamiento de Jabalina ${cl}`,
        `Lanzamiento de Maza ${cl}`,
        `Salto Largo ${cl}`,
        `Salto Alto ${cl}`
      ];
    }
    return [`100m ${cl}`, `Salto Largo ${cl}`, `Lanzamiento de Bala ${cl}`];
  }, [atletaId, athletes]);
  useEffect(() => {
    if (availablePruebas.length > 0) {
      setPrueba(availablePruebas[0]);
    } else {
      setPrueba("");
    }
  }, [availablePruebas]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!atletaId || !selectedChampionshipId || !prueba || !medalla) {
      setFormError("Por favor completa los campos requeridos.");
      return;
    }
    const event = championships?.find((c) => String(c.id) === String(selectedChampionshipId));
    if (!event) {
      setFormError("El campeonato seleccionado no es válido.");
      return;
    }
    const ano = event.fechaInicio ? event.fechaInicio.split("-")[0] : (/* @__PURE__ */ new Date()).getFullYear().toString();
    const logroText = `Obtuvo Medalla de ${medalla} en la prueba de ${prueba}.${detalles.trim() ? ` Detalle: ${detalles.trim()}` : ""}`;
    try {
      await createLogroMutation.mutateAsync({
        profesorId: session?.id || "admin",
        atletaId,
        campeonato: event.nombre,
        logro: logroText,
        ano
      });
      setAtletaId("");
      setSelectedChampionshipId("");
      setDetalles("");
      setShowModal(false);
    } catch (err) {
      setFormError(err.message || "Error al registrar el logro deportivo.");
    }
  };
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-2 text-4xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Error al cargar los logros" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: error?.message })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsx("section", { className: "flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: /* @__PURE__ */ jsx(
      SearchInput,
      {
        value: search,
        onChange: setSearch,
        placeholder: "Buscar logros por campeonato, atleta, entrenador, medalla...",
        resultsCount: isLoading ? void 0 : filteredLogros.length,
        className: "w-full"
      }
    ) }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-500 text-2xl", children: "workspace_premium" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-slate-900", children: "Palmarés e Historial de Logros" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "secondary",
              className: "rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase",
              children: isLoading ? "Cargando..." : `${filteredLogros.length} logros`
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
              "Registrar Logro"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsx(LogrosGridSkeleton, {}) : filteredLogros.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: filteredLogros.map((l) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500", children: /* @__PURE__ */ jsx(Award, { size: 20 }) }),
              /* @__PURE__ */ jsxs("span", { className: "inline-block rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 mb-2", children: [
                "Año ",
                l.ano
              ] }),
              /* @__PURE__ */ jsx(CardTitle, { className: "pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors", children: l.campeonato })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col gap-4 p-6 pt-5 flex-1 justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border rounded-xl p-3", children: [
                  /* @__PURE__ */ jsx(UserRound, { size: 16, className: "text-red-500 shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Atleta" }),
                    /* @__PURE__ */ jsx("span", { className: "font-extrabold text-slate-800", children: l.atletaNombre })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-600 leading-relaxed font-medium mt-1 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-xs font-black border ${getMedalBadgeColor(l.logro)}`, children: [
                    /* @__PURE__ */ jsx(Medal, { size: 12 }),
                    l.logro.toLowerCase().includes("oro") ? "Medalla de Oro" : l.logro.toLowerCase().includes("plata") ? "Medalla de Plata" : l.logro.toLowerCase().includes("bronce") ? "Medalla de Bronce" : "Resultado"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-slate-700 font-semibold", children: l.logro })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400", children: /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                "Entrenador: ",
                /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: l.profesorNombre })
              ] }) })
            ] })
          ]
        },
        l.id
      )) }) : /* @__PURE__ */ jsx(LogrosEmptyState, {})
    ] }),
    showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Award, { size: 20 }),
          /* @__PURE__ */ jsx("h3", { className: "font-black text-lg", children: "Registrar Logro Deportivo" })
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
            "Deportista Asociado ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: atletaId,
              onChange: (e) => setAtletaId(e.target.value),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona el atleta..." }),
                athletes?.map((a) => /* @__PURE__ */ jsxs("option", { value: a.id, children: [
                  a.nombre,
                  " (",
                  a.claseDeportiva ? `Clase ${a.claseDeportiva}` : "Sin clasificación",
                  ")"
                ] }, a.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
            "Campeonato / Evento Oficial ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedChampionshipId,
              onChange: (e) => setSelectedChampionshipId(e.target.value),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona el campeonato..." }),
                championships?.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                  c.nombre,
                  " (",
                  c.ciudad,
                  ", ",
                  c.fechaInicio.split("-")[0],
                  ")"
                ] }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Medalla lograda ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: medalla,
                onChange: (e) => setMedalla(e.target.value),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Oro", children: "Oro" }),
                  /* @__PURE__ */ jsx("option", { value: "Plata", children: "Plata" }),
                  /* @__PURE__ */ jsx("option", { value: "Bronce", children: "Bronce" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Prueba en la que compitió ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: prueba,
                onChange: (e) => setPrueba(e.target.value),
                disabled: !atletaId,
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white disabled:bg-slate-50 disabled:text-slate-400",
                required: true,
                children: !atletaId ? /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona primero un atleta..." }) : availablePruebas.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: "Detalles Adicionales (Opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              placeholder: "Ej. Logró una marca de 11.45s superando su récord personal.",
              value: detalles,
              onChange: (e) => setDetalles(e.target.value),
              rows: 3,
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden resize-none"
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
              disabled: createLogroMutation.isPending,
              className: "bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl",
              children: createLogroMutation.isPending ? "Guardando..." : "Guardar Logro"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const LogrosView = () => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(LogrosInner, {}) });
};

const $$Logros = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Logros de Entrenadores - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LogrosView", LogrosView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/professors/components/LogrosView", "client:component-export": "LogrosView" })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/logros.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/logros.astro";
const $$url = "/logros";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logros,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
