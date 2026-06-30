import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { i as iniciarSesion } from './supabase_DtntKppG.mjs';
import 'clsx';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs_BjOEHDMU.mjs';
import { A as AthleteForm, C as CoachForm } from './CoachForm_a6eamSp1.mjs';
import './button_CfI8z-VA.mjs';

const RegisterForm = () => {
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen w-full items-center justify-center py-10", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative z-10 w-full max-w-4xl rounded-3xl border border-white/60 bg-white/80 p-6 md:p-10 shadow-2xl backdrop-blur-xl mx-4",
      style: { boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-10 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg",
              style: {
                background: "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,40%) 100%)"
              },
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "material-icons-round text-white",
                  style: { fontSize: "32px" },
                  children: "person_add"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-black tracking-tight text-slate-900", children: [
              "Registro ",
              /* @__PURE__ */ jsx("span", { style: { color: "hsl(0,68%,50%)" }, children: "Paraatletismo" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Crea tu cuenta en el Portal de Gestión Deportiva" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Tabs,
          {
            defaultValue: "atleta",
            onValueChange: () => setGeneralError(null),
            className: "w-full",
            children: [
              /* @__PURE__ */ jsxs(TabsList, { className: "mx-auto mb-10 grid w-full max-w-md grid-cols-2", children: [
                /* @__PURE__ */ jsxs(TabsTrigger, { value: "atleta", className: "gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "18px" }, children: "directions_run" }),
                  "Registrar Atleta"
                ] }),
                /* @__PURE__ */ jsxs(TabsTrigger, { value: "profesor", className: "gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "18px" }, children: "school" }),
                  "Registrar Entrenador"
                ] })
              ] }),
              generalError && /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-sm mx-auto max-w-2xl", children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round shrink-0 text-red-400", children: "error_outline" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: generalError })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white/60 rounded-2xl p-2 md:p-6 shadow-inner border border-white", children: [
                /* @__PURE__ */ jsx(TabsContent, { value: "atleta", className: "m-0 outline-none", children: /* @__PURE__ */ jsx(
                  AthleteForm,
                  {
                    onSuccess: async (savedAthlete) => {
                      setIsLoading(true);
                      try {
                        const sesion = await iniciarSesion(
                          savedAthlete.correo,
                          savedAthlete.password || "",
                          "atleta"
                        );
                        if (sesion) {
                          window.dispatchEvent(new Event("sesion_change"));
                          window.location.href = "/dashboard";
                        }
                      } catch (error) {
                        setGeneralError(
                          "Registro exitoso, pero ocurrió un error al iniciar sesión: " + error.message
                        );
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx(TabsContent, { value: "profesor", className: "m-0 outline-none", children: /* @__PURE__ */ jsx(
                  CoachForm,
                  {
                    isLoading,
                    setIsLoading,
                    setGeneralError
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-10 border-t border-slate-200/60 pt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
          "¿Ya tienes cuenta?",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/login",
              className: "font-bold transition-colors hover:underline underline-offset-4",
              style: { color: "hsl(0,68%,50%)" },
              children: "Inicia sesión aquí"
            }
          )
        ] }) })
      ]
    }
  ) });
};

export { RegisterForm as R };
