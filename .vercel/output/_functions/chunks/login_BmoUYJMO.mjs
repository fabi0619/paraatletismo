import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate, al as maybeRenderHead } from './transition_D2c4wlGk.mjs';
import { $ as $$Layout } from './Layout_B_vqfV4T.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { l as loginSchema } from './authSchemas_Bk0fpIi0.mjs';
import { i as iniciarSesion } from './supabase_DtntKppG.mjs';
import { I as Input } from './Input_BWk1Bi1Y.mjs';
import { L as Label } from './Label_CfJvnyIi.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger } from './tabs_BjOEHDMU.mjs';
/* empty css                 */

const LoginForm = () => {
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rol: "profesor",
      usuario: "",
      clave: ""
    }
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const session = await iniciarSesion(data.usuario, data.clave, data.rol);
      if (session) {
        window.dispatchEvent(new Event("sesion_change"));
        window.location.href = "/dashboard";
      } else {
        setGeneralError("Usuario o contraseña incorrectos. Verifique sus credenciales.");
      }
    } catch (error) {
      setGeneralError(error.message || "Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen w-full items-center justify-center", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl",
      style: { boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg",
              style: {
                background: "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,40%) 100%)"
              },
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "material-icons-round text-white",
                  style: { fontSize: "28px" },
                  children: "sports_athletics"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-black tracking-tight text-slate-900", children: [
              "Valle",
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "hsl(0,68%,50%)" }, children: "Paraatletismo" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Portal de Gestión Deportiva" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Tabs,
          {
            defaultValue: "profesor",
            onValueChange: (value) => {
              setValue("rol", value);
              setGeneralError(null);
            },
            className: "w-full",
            children: [
              /* @__PURE__ */ jsxs(TabsList, { className: "mb-6 grid w-full grid-cols-2", children: [
                /* @__PURE__ */ jsxs(TabsTrigger, { value: "profesor", className: "gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "15px" }, children: "school" }),
                  "Entrenador"
                ] }),
                /* @__PURE__ */ jsxs(TabsTrigger, { value: "atleta", className: "gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "15px" }, children: "directions_run" }),
                  "Atleta"
                ] })
              ] }),
              generalError && /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700", children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round mt-0.5 shrink-0 text-red-400", style: { fontSize: "18px" }, children: "error_outline" }),
                generalError
              ] }),
              /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit(onSubmit), noValidate: true, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "usuario", className: "text-sm font-semibold text-slate-700", children: "Correo Electrónico" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "usuario",
                      type: "email",
                      placeholder: "ejemplo@valle.co",
                      disabled: isLoading,
                      autoComplete: "email",
                      ...register("usuario")
                    }
                  ),
                  errors.usuario && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-red-500", children: errors.usuario.message })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "clave", className: "text-sm font-semibold text-slate-700", children: "Contraseña" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "clave",
                      type: "password",
                      placeholder: "••••••••",
                      disabled: isLoading,
                      autoComplete: "current-password",
                      ...register("clave")
                    }
                  ),
                  errors.clave && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-red-500", children: errors.clave.message })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: isLoading,
                    className: "mt-1 w-full gap-2 font-bold",
                    style: {
                      background: "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,42%) 100%)",
                      border: "none"
                    },
                    children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "material-icons-round animate-spin",
                          style: { fontSize: "18px" },
                          children: "autorenew"
                        }
                      ),
                      "Iniciando sesión..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "18px" }, children: "login" }),
                      "Iniciar Sesión"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-slate-500", children: [
                  "¿No tienes cuenta?",
                  " ",
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/registro",
                      className: "font-semibold underline-offset-4 hover:underline",
                      style: { color: "hsl(0,68%,50%)" },
                      children: "Regístrate aquí"
                    }
                  )
                ] })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-6 border-t border-slate-100 pt-4 text-center", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/admin/login",
            className: "inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600",
            children: [
              /* @__PURE__ */ jsx("span", { className: "material-icons-round", style: { fontSize: "13px" }, children: "admin_panel_settings" }),
              "Acceso Administrador"
            ]
          }
        ) })
      ]
    }
  ) });
};

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar Sesión - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-glow"></div> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/auth/components/LoginForm", "client:component-export": "LoginForm" })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/login.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
