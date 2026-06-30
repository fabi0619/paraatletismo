import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { c as championshipsService } from './championshipsService_DznYA8jA.mjs';
import { u as useAthlete } from './useAthletes_BlC5Zdkk.mjs';
import { Q as QueryProvider, a as athletesService } from './QueryProvider__3BIDRjC.mjs';
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from './card_B1uvd6Uf.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { Medal } from 'lucide-react';
import './button_CfI8z-VA.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select_Dghz8IQH.mjs';

const PerformancesDashboard = ({ athlete }) => {
  const campeonatos = athlete?.campeonatos || [];
  const [tooltip, setTooltip] = useState(null);
  const [currentMedalIndex, setCurrentMedalIndex] = useState(0);
  const pruebas = Array.from(new Set(campeonatos.map((c) => c.prueba).filter(Boolean)));
  const [selectedPrueba, setSelectedPrueba] = useState("all");
  const gold = campeonatos.filter((c) => String(c.posicion) === "1" || String(c.posicion).toLowerCase() === "oro").length;
  const silver = campeonatos.filter((c) => String(c.posicion) === "2" || String(c.posicion).toLowerCase() === "plata").length;
  const bronze = campeonatos.filter((c) => String(c.posicion) === "3" || String(c.posicion).toLowerCase() === "bronce").length;
  const bestChamps = [...campeonatos].filter((c) => ["1", "2", "3", "oro", "plata", "bronce"].includes(String(c.posicion).toLowerCase())).sort((a, b) => {
    const getRank = (pos) => ["1", "oro"].includes(pos) ? 1 : ["2", "plata"].includes(pos) ? 2 : 3;
    const rankDiff = getRank(String(a.posicion).toLowerCase()) - getRank(String(b.posicion).toLowerCase());
    if (rankDiff !== 0) return rankDiff;
    if (a.fecha && b.fecha) return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    return 0;
  });
  const highlightedChamp = bestChamps.length > 0 ? bestChamps[currentMedalIndex] : null;
  const handlePrevMedal = () => {
    setCurrentMedalIndex((prev) => prev === 0 ? bestChamps.length - 1 : prev - 1);
  };
  const handleNextMedal = () => {
    setCurrentMedalIndex((prev) => prev === bestChamps.length - 1 ? 0 : prev + 1);
  };
  const getMedalLabel = (posicion) => {
    const pos = String(posicion).toLowerCase();
    if (["1", "oro"].includes(pos)) return "Medalla de Oro";
    if (["2", "plata"].includes(pos)) return "Medalla de Plata";
    return "Medalla de Bronce";
  };
  const chartCampeonatos = selectedPrueba === "all" ? campeonatos : campeonatos.filter((c) => c.prueba === selectedPrueba);
  const pbByYear = {};
  chartCampeonatos.forEach((c) => {
    if (c.fecha && c.marca) {
      const year = parseInt(c.fecha.split("-")[0]);
      const markMatch = String(c.marca).match(/[\d.]+/);
      const mark = markMatch ? parseFloat(markMatch[0]) : NaN;
      if (!isNaN(year) && !isNaN(mark)) {
        if (!pbByYear[year] || mark < pbByYear[year].pb) {
          pbByYear[year] = { pb: mark, prueba: c.prueba, marca: c.marca };
        }
      }
    }
  });
  const years = Object.keys(pbByYear).map(Number).sort((a, b) => a - b);
  let chartData = years.map((y) => ({
    year: y,
    pb: pbByYear[y].pb,
    prueba: pbByYear[y].prueba,
    marca: pbByYear[y].marca
  }));
  if (chartData.length === 0) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    chartData = [
      { year: currentYear - 2, pb: 0, prueba: "", marca: "" },
      { year: currentYear - 1, pb: 0, prueba: "", marca: "" },
      { year: currentYear, pb: 0, prueba: "", marca: "" }
    ];
  }
  const width = 700;
  const height = 320;
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  let minYear = Math.min(...chartData.map((d) => d.year));
  let maxYear = Math.max(...chartData.map((d) => d.year));
  if (minYear === maxYear) {
    minYear -= 2;
    maxYear += 2;
  }
  if (maxYear - minYear < 5) {
    const diff = 5 - (maxYear - minYear);
    minYear -= Math.floor(diff / 2);
    maxYear += Math.ceil(diff / 2);
  }
  let minPb = Math.min(...chartData.map((d) => d.pb));
  let maxPb = Math.max(...chartData.map((d) => d.pb));
  if (minPb === maxPb) {
    minPb -= 1;
    maxPb += 1;
  }
  minPb = Math.max(0, Math.floor(minPb) - 0.5);
  maxPb = Math.ceil(maxPb) + 0.5;
  const getX = (year) => padding.left + (year - minYear) / (maxYear - minYear) * innerWidth;
  const getY = (pb) => padding.top + (pb - minPb) / (maxPb - minPb) * innerHeight;
  const points = chartData.map((d) => `${getX(d.year)},${getY(d.pb)}`).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs(Card, { className: "h-full overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl flex flex-col relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-white/40 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-black text-slate-800 text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-yellow-500", children: "emoji_events" }),
          "Logros"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/50 px-2 py-1 rounded-full", children: "Destacados" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-6 flex-1 flex flex-col relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-8 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1", children: [
            /* @__PURE__ */ jsx(Medal, { className: "fill-yellow-400 text-yellow-600", size: 28, strokeWidth: 1.5 }),
            /* @__PURE__ */ jsx("span", { className: "font-black text-xl text-slate-800 leading-none", children: gold })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1", children: [
            /* @__PURE__ */ jsx(Medal, { className: "fill-slate-300 text-slate-500", size: 28, strokeWidth: 1.5 }),
            /* @__PURE__ */ jsx("span", { className: "font-black text-xl text-slate-800 leading-none", children: silver })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1", children: [
            /* @__PURE__ */ jsx(Medal, { className: "fill-orange-400 text-orange-600", size: 28, strokeWidth: 1.5 }),
            /* @__PURE__ */ jsx("span", { className: "font-black text-xl text-slate-800 leading-none", children: bronze })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-5 bg-white/40 p-5 rounded-2xl border border-white/60 shadow-inner flex-1", children: highlightedChamp ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm", children: getMedalLabel(highlightedChamp.posicion) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-black text-2xl text-slate-900 leading-tight", children: highlightedChamp.prueba }),
            /* @__PURE__ */ jsx("p", { className: "font-black text-3xl text-red-600 leading-none tracking-tight", children: highlightedChamp.marca })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-8 h-1 bg-slate-200 rounded-full" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-600 leading-snug", children: highlightedChamp.campeonato }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-slate-400 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[14px]", children: "event" }),
              highlightedChamp.fecha
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx("div", { className: "text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 font-black text-3xl tracking-tighter italic leading-none", children: "VALLE" }) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center text-slate-400", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mb-3 shadow-sm", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-300", children: "emoji_events" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-500", children: "Aún no hay medallas" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs mt-1", children: "Registra logros para verlos aquí" })
        ] }) }),
        bestChamps.length > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-6 px-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: handlePrevMedal, className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-xl", children: "chevron_left" }) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-400 tracking-widest", children: [
            currentMedalIndex + 1,
            " / ",
            bestChamps.length
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: handleNextMedal, className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-xl", children: "chevron_right" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs(Card, { className: "h-full overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl flex flex-col relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-white/40 flex flex-wrap items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-black text-slate-800 text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600", children: "trending_up" }),
          "Performances"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxs(Select, { value: selectedPrueba, onValueChange: setSelectedPrueba, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-white/80 hover:bg-white text-slate-800 font-bold rounded-xl px-4 shadow-sm border border-white/60 h-10 w-auto min-w-[180px] focus:ring-2 focus:ring-red-500/20 transition-all", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar prueba" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { className: "rounded-xl border-white/60 shadow-xl backdrop-blur-xl bg-white/90", children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", className: "font-black text-red-600", children: "TODAS LAS PRUEBAS" }),
            pruebas.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: String(p), className: "font-medium uppercase", children: String(p) }, String(p)))
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-6 flex-1 flex flex-col relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto flex-1 flex items-center justify-center bg-white/30 rounded-2xl border border-white/40 p-4 shadow-inner", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            viewBox: `0 0 ${width} ${height}`,
            className: "w-full h-auto min-w-[550px] select-none",
            style: { maxHeight: "400px" },
            children: [
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("linearGradient", { id: "chart-gradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--primary-red, #dc2626)", stopOpacity: "0.25" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--primary-red, #dc2626)", stopOpacity: "0" })
                ] }),
                /* @__PURE__ */ jsxs("filter", { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
                  /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "4", result: "blur" }),
                  /* @__PURE__ */ jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
                ] })
              ] }),
              Array.from({ length: 7 }).map((_, i) => {
                const val = minPb + i * (maxPb - minPb) / 6;
                return /* @__PURE__ */ jsxs("g", { children: [
                  /* @__PURE__ */ jsx(
                    "line",
                    {
                      x1: padding.left,
                      y1: getY(val),
                      x2: width - padding.right,
                      y2: getY(val),
                      stroke: "#e2e8f0",
                      strokeWidth: "1",
                      strokeDasharray: "4,4"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "text",
                    {
                      x: padding.left - 12,
                      y: getY(val),
                      textAnchor: "end",
                      alignmentBaseline: "middle",
                      className: "text-xs fill-slate-400 font-bold",
                      children: val.toFixed(2)
                    }
                  )
                ] }, val);
              }),
              /* @__PURE__ */ jsx(
                "text",
                {
                  x: 12,
                  y: height / 2,
                  transform: `rotate(-90, 12, ${height / 2})`,
                  textAnchor: "middle",
                  className: "text-xs fill-slate-400 font-bold tracking-widest uppercase",
                  children: "Marca"
                }
              ),
              Array.from({ length: maxYear - minYear + 1 }).map((_, i) => {
                const year = minYear + i;
                const x = getX(year);
                return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx(
                  "text",
                  {
                    x,
                    y: height - padding.bottom + 20,
                    textAnchor: "middle",
                    className: "text-xs fill-slate-500 font-black",
                    children: year
                  }
                ) }, year);
              }),
              /* @__PURE__ */ jsx(
                "line",
                {
                  x1: padding.left,
                  y1: height - padding.bottom,
                  x2: width - padding.right + 20,
                  y2: height - padding.bottom,
                  stroke: "#cbd5e1",
                  strokeWidth: "2",
                  strokeLinecap: "round"
                }
              ),
              chartData.length > 0 && /* @__PURE__ */ jsx(
                "polygon",
                {
                  points: `${points} ${getX(chartData[chartData.length - 1].year)},${height - padding.bottom} ${getX(chartData[0].year)},${height - padding.bottom}`,
                  fill: "url(#chart-gradient)"
                }
              ),
              /* @__PURE__ */ jsx(
                "polyline",
                {
                  points,
                  fill: "none",
                  stroke: "var(--primary-red, #dc2626)",
                  strokeWidth: "3",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  filter: "url(#glow)"
                }
              ),
              chartData.map((d, i) => /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx(
                "circle",
                {
                  cx: getX(d.year),
                  cy: getY(d.pb),
                  r: "6",
                  fill: "white",
                  stroke: "var(--primary-red, #dc2626)",
                  strokeWidth: "2.5",
                  className: "cursor-pointer transition-all duration-300 hover:r-[8]",
                  onMouseEnter: (e) => {
                    if (!d.prueba) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      top: rect.top - 8,
                      left: rect.left + rect.width / 2,
                      prueba: d.prueba,
                      marca: d.marca,
                      year: d.year
                    });
                  },
                  onMouseLeave: () => setTooltip(null)
                }
              ) }, i))
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-12 mt-6", children: [
          /* @__PURE__ */ jsx("button", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-xl", children: "chevron_left" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-500 tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full shadow-sm border border-white/30", children: "Personal Bests" }),
          /* @__PURE__ */ jsx("button", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-xl", children: "chevron_right" }) })
        ] })
      ] })
    ] }) }),
    tooltip && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed z-[100] pointer-events-none -translate-x-1/2 -translate-y-full pb-2 animate-in fade-in zoom-in duration-200",
        style: { top: tooltip.top, left: tooltip.left },
        children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white text-xs rounded-xl shadow-xl px-3 py-2.5 flex flex-col items-center min-w-[110px] border border-slate-700 relative", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-400 mb-0.5 text-[10px] uppercase tracking-wider", children: tooltip.year }),
          /* @__PURE__ */ jsx("span", { className: "font-black truncate w-full text-center text-sm", children: tooltip.prueba }),
          /* @__PURE__ */ jsx("span", { className: "text-red-400 font-bold text-[15px]", children: tooltip.marca }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900" })
        ] })
      }
    )
  ] });
};

const BASE_PRUEBAS = [
  "100m",
  "200m",
  "400m",
  "800m",
  "1500m",
  "5000m",
  "10000m",
  "Maratón",
  "Marcha 20km",
  "Salto Largo",
  "Salto Alto",
  "Salto Triple",
  "Lanzamiento Bala",
  "Lanzamiento Disco",
  "Lanzamiento Jabalina",
  "Lanzamiento Club",
  "Lanzamiento Martillo",
  "Pentatlón",
  "Heptatlón"
];
const ProfileSkeleton = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [
  /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-full rounded-2xl" }),
  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, { className: "md:col-span-1", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center gap-4 p-6", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-40 rounded-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "md:col-span-2", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-6", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-1/3" }),
      [...Array(4)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }, i))
    ] }) })
  ] }),
  /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-6", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-1/4" }),
    [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-20 w-full" }, i))
  ] }) })
] }) });
const AthleteProfileInner = ({ id, initialData }) => {
  const { data: athlete, isLoading, isError, error } = useAthlete(id, initialData);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [marcaForm, setMarcaForm] = useState({
    eventoId: "",
    prueba: "",
    marca: "",
    posicion: ""
  });
  const sesionStr = typeof window !== "undefined" ? localStorage.getItem("sesion_usuario") : null;
  const sesion = sesionStr ? JSON.parse(sesionStr) : null;
  const canEdit = sesion && (sesion.rol === "admin" || sesion.rol === "profesor" || sesion.rol === "atleta" && sesion.id === id);
  const { data: eventos, isLoading: isLoadingEventos } = useQuery({
    queryKey: ["eventos"],
    queryFn: championshipsService.getChampionships
  });
  const handleSaveMarca = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const evt = eventos?.find((ev) => String(ev.id) === String(marcaForm.eventoId));
      const newChamp = {
        atleta_id: id,
        campeonato: evt?.nombre || "Campeonato Registrado",
        lugar: evt?.ciudad ? `${evt.ciudad}, ${evt.pais}` : "Local",
        prueba: marcaForm.prueba,
        marca: marcaForm.marca,
        fecha: evt?.fechaInicio || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        posicion: marcaForm.posicion
      };
      const sesionStr2 = typeof window !== "undefined" ? localStorage.getItem("sesion_usuario") : null;
      const sesion2 = sesionStr2 ? JSON.parse(sesionStr2) : null;
      const profesorId = sesion2?.id || "admin";
      const { athletesService } = await import('./QueryProvider__3BIDRjC.mjs').then(n => n.b);
      await athletesService.saveChampionship(newChamp, profesorId);
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setIsModalOpen(false);
      setMarcaForm({ eventoId: "", prueba: "", marca: "", posicion: "" });
    } catch (err) {
      console.error("Error guardando marca:", err);
      alert("Hubo un error al guardar la marca. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) return /* @__PURE__ */ jsx(ProfileSkeleton, {});
  if (isError || !athlete) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black", children: "Atleta no encontrado" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: error?.message || "No se pudo cargar la información del atleta." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.href = "/",
          className: "mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white",
          children: "Volver al Inicio"
        }
      )
    ] });
  }
  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };
  const gold = athlete.campeonatos?.filter((c) => c.posicion === "1").length || 0;
  const silver = athlete.campeonatos?.filter((c) => c.posicion === "2").length || 0;
  const bronze = athlete.campeonatos?.filter((c) => c.posicion === "3").length || 0;
  const infoItems = [
    { label: "Clasificación", value: athlete.claseDeportiva, badge: true },
    { label: "Edad", value: calculateAge(athlete.fechaNacimiento) },
    { label: "Club", value: athlete.club },
    { label: "Discapacidad", value: athlete.discapacidad },
    { label: "Género", value: athlete.genero }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 px-4 py-6 md:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center justify-between p-4 px-6 relative z-10", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => window.location.href = "/",
              className: "flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-black text-slate-800 transition-all hover:-translate-x-1 hover:shadow-md hover:bg-white border border-white shadow-sm",
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-[18px]", children: "arrow_back" }),
                "Regresar al inicio"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 text-slate-700 bg-white/50 px-4 py-1.5 rounded-full border border-white/60 shadow-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-lg", children: "account_circle" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black tracking-widest uppercase", children: "Perfil de Atleta" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-1 overflow-hidden border-white/50 shadow-xl rounded-3xl bg-white/50 backdrop-blur-xl relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center p-8 text-center relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-5 h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-2xl relative", children: athlete.foto ? /* @__PURE__ */ jsx("img", { src: athlete.foto, alt: athlete.nombre, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-slate-800", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-6xl text-slate-400", children: "person" }) }) }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl leading-tight font-black text-slate-900 drop-shadow-sm", children: athlete.nombre.split(" ")[0] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-red-600 tracking-tight drop-shadow-sm", children: athlete.nombre.split(" ").slice(1).join(" ") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 px-4 py-1.5 bg-white/80 rounded-full border border-white shadow-sm flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[16px] text-slate-400", children: "flag" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: athlete.club || "Sin club" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 md:col-span-2", children: [
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-white/40 bg-white/30", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 font-black", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-yellow-600 text-lg", children: "emoji_events" }) }),
              "Medallas Obtenidas"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/50 py-6 px-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white/70 relative overflow-hidden group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-yellow-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsx(Medal, { className: "fill-yellow-400 text-yellow-600 drop-shadow-sm transition-transform group-hover:scale-110", size: 56, strokeWidth: 1.5 }),
                /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-slate-800 mt-2 leading-none drop-shadow-sm", children: gold }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest text-yellow-700 uppercase bg-yellow-100/80 px-3 py-1 rounded-full shadow-sm border border-yellow-200/50 mt-1", children: "Oro" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/50 py-6 px-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white/70 relative overflow-hidden group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsx(Medal, { className: "fill-slate-300 text-slate-500 drop-shadow-sm transition-transform group-hover:scale-110", size: 56, strokeWidth: 1.5 }),
                /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-slate-800 mt-2 leading-none drop-shadow-sm", children: silver }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest text-slate-600 uppercase bg-slate-200/80 px-3 py-1 rounded-full shadow-sm border border-slate-300/50 mt-1", children: "Plata" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/50 py-6 px-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white/70 relative overflow-hidden group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-orange-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsx(Medal, { className: "fill-orange-400 text-orange-600 drop-shadow-sm transition-transform group-hover:scale-110", size: 56, strokeWidth: 1.5 }),
                /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-slate-800 mt-2 leading-none drop-shadow-sm", children: bronze }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest text-orange-800 uppercase bg-orange-100/80 px-3 py-1 rounded-full shadow-sm border border-orange-200/50 mt-1", children: "Bronce" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-white/40 bg-white/30", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 font-black", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-lg", children: "person" }) }),
              "Información del Atleta"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: infoItems.map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-col gap-1.5 border-b border-white/40 pb-3",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black tracking-widest text-slate-400 uppercase", children: item.label }),
                  item.badge ? /* @__PURE__ */ jsx("div", { className: "self-start", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-xs font-black text-white shadow-sm border border-red-400 inline-block", children: item.value || "N/A" }) }) : /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[15px]", children: item.value || "N/A" })
                ]
              },
              item.label
            )) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(PerformancesDashboard, { athlete }),
      /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-4 border-b border-white/40 bg-white/30", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 font-black", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-lg", children: "history" }) }),
            "Historial Deportivo"
          ] }),
          canEdit && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsModalOpen(true),
              className: "flex items-center gap-1 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "add" }),
                "Registrar Marca"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: athlete.campeonatos && athlete.campeonatos.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: athlete.campeonatos.map((camp) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl border border-white/60 bg-white/50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md backdrop-blur-sm",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-800 leading-tight", children: camp.campeonato }),
                camp.posicion && /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `shrink-0 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold shadow-sm ${camp.posicion === "1" || String(camp.posicion).toLowerCase() === "oro" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white" : camp.posicion === "2" || String(camp.posicion).toLowerCase() === "plata" ? "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800" : camp.posicion === "3" || String(camp.posicion).toLowerCase() === "bronce" ? "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900" : "bg-white/80 border border-slate-200 text-slate-600"}`,
                    children: [
                      "Pos ",
                      camp.posicion
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-white/60 my-3" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-3", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-white/60 flex items-center justify-center shadow-sm border border-white/50", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[14px] text-slate-400", children: "event" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: camp.fecha })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-white/60 flex items-center justify-center shadow-sm border border-white/50", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[14px] text-slate-400", children: "directions_run" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: camp.prueba })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-red-50 flex items-center justify-center shadow-sm border border-red-100", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[14px] text-red-500", children: "timer" }) }),
                  /* @__PURE__ */ jsx("span", { className: "font-black text-red-600 text-sm", children: camp.marca })
                ] })
              ] })
            ]
          },
          camp.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/40 p-12 text-center shadow-inner", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-300", children: "history" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-500", children: "Sin historial registrado" })
        ] }) })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1.5 bg-red-600" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600", children: "emoji_events" }),
          "Registrar Marca"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsModalOpen(false),
            className: "flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors",
            children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveMarca, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-700", children: "Campeonato / Evento" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              required: true,
              className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
              value: marcaForm.eventoId,
              onChange: (e) => setMarcaForm({ ...marcaForm, eventoId: e.target.value }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un evento..." }),
                !isLoadingEventos && eventos?.map((evt) => /* @__PURE__ */ jsxs("option", { value: evt.id, children: [
                  evt.nombre,
                  " (",
                  evt.fechaTexto || evt.fechaInicio,
                  ")"
                ] }, evt.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-700", children: "Prueba" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              required: true,
              className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
              value: marcaForm.prueba,
              onChange: (e) => setMarcaForm({ ...marcaForm, prueba: e.target.value }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione una prueba..." }),
                BASE_PRUEBAS.map((prueba) => {
                  const label = athlete.claseDeportiva ? `${prueba} ${athlete.claseDeportiva}` : prueba;
                  return /* @__PURE__ */ jsx("option", { value: label, children: label }, prueba);
                })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-700", children: "Marca / Resultado" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                placeholder: "Ej. 11.45",
                className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
                value: marcaForm.marca,
                onChange: (e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  setMarcaForm({ ...marcaForm, marca: val });
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-700", children: "Posición" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                required: true,
                className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
                value: marcaForm.posicion,
                onChange: (e) => setMarcaForm({ ...marcaForm, posicion: e.target.value }),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
                  /* @__PURE__ */ jsx("option", { value: "1", children: "1° (Oro)" }),
                  /* @__PURE__ */ jsx("option", { value: "2", children: "2° (Plata)" }),
                  /* @__PURE__ */ jsx("option", { value: "3", children: "3° (Bronce)" }),
                  /* @__PURE__ */ jsx("option", { value: "4", children: "4° Lugar" }),
                  /* @__PURE__ */ jsx("option", { value: "5", children: "5° Lugar" }),
                  /* @__PURE__ */ jsx("option", { value: "6", children: "6° Lugar" }),
                  /* @__PURE__ */ jsx("option", { value: "7", children: "7° Lugar" }),
                  /* @__PURE__ */ jsx("option", { value: "8", children: "8° Lugar" }),
                  /* @__PURE__ */ jsx("option", { value: "Participación", children: "Participación" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsModalOpen(false),
              className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: isSaving,
              className: `flex items-center gap-1.5 rounded-lg px-6 py-2 text-sm font-bold text-white transition-colors shadow-md ${isSaving ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[16px]", children: isSaving ? "hourglass_empty" : "save" }),
                isSaving ? "Guardando..." : "Guardar"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const AthleteProfile = ({ id, initialData }) => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(AthleteProfileInner, { id, initialData }) });
};

const $$AthleteIsland = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AthleteIsland;
  const { id } = Astro2.props;
  let initialData = null;
  try {
    initialData = await athletesService.getAthleteById(id);
  } catch (e) {
    console.error("Error fetching athlete in Server Island:", e);
  }
  return renderTemplate`${renderComponent($$result, "AthleteProfile", AthleteProfile, { "client:load": true, "id": id, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/athletes/components/AthleteProfile", "client:component-export": "AthleteProfile" })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthleteIsland.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthleteIsland.astro";
const $$url = undefined;

export { $$AthleteIsland as $, ProfileSkeleton as P, $$file as a, $$url as b };
