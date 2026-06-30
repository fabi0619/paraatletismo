import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$MainLayout } from './MainLayout_D5u_EKrR.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Q as QueryProvider, a as athletesService } from './QueryProvider__3BIDRjC.mjs';
import { c as championshipsService } from './championshipsService_DznYA8jA.mjs';
import { p as professorsService } from './professorsService_B4TlaCRS.mjs';
import { C as Card, d as CardContent } from './card_B1uvd6Uf.mjs';
import './button_CfI8z-VA.mjs';
import { B as Badge } from './badge_DVRej5nP.mjs';
import { Separator as Separator$1 } from 'radix-ui';
import { c as cn } from './utils_B05Dmz_H.mjs';

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Separator$1.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}

function getSession() {
  try {
    const raw = localStorage.getItem("sesion_usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getRolLabel(rol) {
  switch (rol) {
    case "admin":
      return "Administrador";
    case "profesor":
      return "Entrenador";
    case "atleta":
      return "Atleta";
    default:
      return rol;
  }
}
function getRolColor(rol) {
  switch (rol) {
    case "admin":
      return "bg-purple-100 text-purple-700";
    case "profesor":
      return "bg-blue-100 text-blue-700";
    case "atleta":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
function QuickLink({
  icon,
  title,
  description,
  href
}) {
  return /* @__PURE__ */ jsx("a", { href, className: "group block no-underline", children: /* @__PURE__ */ jsx(Card, { className: "h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-red-500/30 bg-white/60 backdrop-blur-md border-white/60 shadow-md", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-start gap-3 p-5", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm border border-white group-hover:bg-red-50 transition-colors", children: /* @__PURE__ */ jsx(
      "span",
      {
        className: "material-icons-round mt-0.5 transition-colors group-hover:text-red-600",
        style: { fontSize: "22px", color: "var(--text-muted)" },
        children: icon
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-slate-500", children: description })
    ] })
  ] }) }) });
}
const DashboardInner = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    const s = getSession();
    if (!s) {
      window.location.href = "/login";
      return;
    }
    setSession(s);
  }, []);
  const { data: athletes, isLoading: athletesLoading } = useQuery({
    queryKey: ["athletes"],
    queryFn: athletesService.getAthletes,
    staleTime: 1e3 * 60 * 5
  });
  const { data: championships, isLoading: championshipsLoading } = useQuery({
    queryKey: ["championships"],
    queryFn: championshipsService.getChampionships,
    staleTime: 1e3 * 60 * 5
  });
  const { data: professors, isLoading: professorsLoading } = useQuery({
    queryKey: ["professors"],
    queryFn: professorsService.getProfessors,
    staleTime: 1e3 * 60 * 5
  });
  useMemo(() => {
    if (!athletes) return { total: 0, medals: 0, championships: 0, golds: 0 };
    let medals = 0;
    let golds = 0;
    const champSet = /* @__PURE__ */ new Set();
    athletes.forEach((a) => {
      a.campeonatos?.forEach((c) => {
        champSet.add(c.campeonato);
        const pos = String(c.posicion).trim();
        if (["1", "Oro"].includes(pos)) {
          medals++;
          golds++;
        } else if (["2", "3", "Plata", "Bronce"].includes(pos)) {
          medals++;
        }
      });
    });
    return {
      total: athletes.length,
      medals,
      championships: champSet.size,
      golds
    };
  }, [athletes]);
  if (!session) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round animate-spin text-4xl text-slate-300", children: "autorenew" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black text-slate-900 sm:text-3xl", children: [
        "Bienvenido, ",
        session.nombre
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { className: `${getRolColor(session.rol)} border-0 text-xs font-bold uppercase`, children: getRolLabel(session.rol) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-500", children: "Panel de control del portal" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-base font-bold text-slate-700", children: "Accesos Rápidos" }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx(
          QuickLink,
          {
            icon: "groups",
            title: "Ver Atletas",
            description: "Consulta la grilla completa de atletas registrados",
            href: "/atletas"
          }
        ),
        session.rol === "atleta" && /* @__PURE__ */ jsx(
          QuickLink,
          {
            icon: "account_box",
            title: "Mi Perfil",
            description: "Revisa tu información personal y campeonatos",
            href: `/atleta/${session.id}`
          }
        ),
        session.rol === "atleta" && /* @__PURE__ */ jsx(
          QuickLink,
          {
            icon: "upload_file",
            title: "Cargar Documentos",
            description: "Sube tus documentos PDF requeridos",
            href: `/atleta/documentos`
          }
        ),
        (session.rol === "profesor" || session.rol === "admin") && /* @__PURE__ */ jsx(
          QuickLink,
          {
            icon: "person_add",
            title: "Registrar Atleta",
            description: "Agrega un nuevo atleta a la plataforma",
            href: "/registro"
          }
        ),
        (session.rol === "profesor" || session.rol === "admin") && /* @__PURE__ */ jsx(
          QuickLink,
          {
            icon: "workspace_premium",
            title: "Gestión de Logros",
            description: "Registra y consulta logros con tus atletas",
            href: "/logros"
          }
        )
      ] })
    ] }),
    athletes && athletes.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-700", children: "Atletas Recientes" }),
        /* @__PURE__ */ jsx("a", { href: "/atletas", className: "text-sm font-semibold hover:underline", style: { color: "var(--primary-red)" }, children: "Ver todos →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: athletes.slice(0, 4).map((athlete) => /* @__PURE__ */ jsx(
        "a",
        {
          href: `/atleta/${athlete.id}`,
          className: "group block no-underline",
          children: /* @__PURE__ */ jsx(Card, { className: "overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
            athlete.foto ? /* @__PURE__ */ jsx(
              "img",
              {
                src: athlete.foto,
                alt: athlete.nombre,
                className: "h-10 w-10 shrink-0 rounded-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-slate-400", style: { fontSize: "20px" }, children: "person" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-bold text-slate-900 group-hover:text-(--primary-red)", children: athlete.nombre }),
              /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-slate-500", children: athlete.claseDeportiva || "Sin clase" })
            ] })
          ] }) })
        },
        athlete.id
      )) })
    ] })
  ] });
};
const DashboardView = () => /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(DashboardInner, {}) });

const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Dashboard - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardView", DashboardView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/dashboard/components/DashboardView", "client:component-export": "DashboardView" })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
