import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate, al as maybeRenderHead } from './transition_D2c4wlGk.mjs';
import { $ as $$Layout } from './Layout_B_vqfV4T.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { a as adminLoginSchema } from './authSchemas_Bk0fpIi0.mjs';
import { i as iniciarSesion } from './supabase_DtntKppG.mjs';
import { I as Input } from './Input_BWk1Bi1Y.mjs';
import { L as Label } from './Label_CfJvnyIi.mjs';
import { B as Button } from './button_CfI8z-VA.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from './card_B1uvd6Uf.mjs';
/* empty css                 */

const AdminLoginForm = () => {
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      usuario: "",
      clave: ""
    }
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const session = await iniciarSesion(data.usuario, data.clave, "admin");
      if (session) {
        window.location.href = "/";
      } else {
        setGeneralError("Credenciales de administrador incorrectas.");
      }
    } catch (error) {
      setGeneralError(error.message || "Error al iniciar sesión como administrador.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "relative flex min-h-screen w-full items-center justify-center", children: /* @__PURE__ */ jsxs(Card, { className: "border-white/20 shadow-2xl relative overflow-hidden bg-slate-900/80 backdrop-blur-xl text-slate-100 w-full max-w-md mx-4 p-4 md:p-6 rounded-3xl", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-red-900/20 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxs(CardHeader, { className: "text-center relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-500 text-4xl animate-pulse", children: "admin_panel_settings" }) }),
      /* @__PURE__ */ jsxs(CardTitle, { className: "text-2xl font-black tracking-tight text-white", children: [
        "ADMIN ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500 font-extrabold", children: "PANEL" })
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5", children: "Ingreso de Administrador" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "relative z-10", children: [
      generalError && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-sm font-medium text-red-400", children: generalError }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit(onSubmit), noValidate: true, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "usuario", className: "text-slate-400", children: [
            "Usuario Administrador ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "usuario",
              placeholder: "admin",
              disabled: isLoading,
              className: "bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-red-500",
              ...register("usuario")
            }
          ),
          errors.usuario && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-medium", children: errors.usuario.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "clave", className: "text-slate-400", children: [
            "Contraseña ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "clave",
              type: "password",
              placeholder: "••••••••",
              disabled: isLoading,
              className: "bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-red-500",
              ...register("clave")
            }
          ),
          errors.clave && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 font-medium", children: errors.clave.message })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full bg-red-600 hover:bg-red-700 text-white mt-2",
            children: isLoading ? "Validando credenciales..." : "Acceder al Panel"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-center text-sm pt-2", children: /* @__PURE__ */ jsx("a", { href: "/login", className: "text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors", children: "Volver al ingreso general" }) })
      ] }) })
    ] })
  ] }) });
};

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Acceso de Administrador - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-glow"></div> <div class="min-h-screen flex items-center justify-center p-4 relative z-10"> ${renderComponent($$result2, "AdminLoginForm", AdminLoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/auth/components/AdminLoginForm", "client:component-export": "AdminLoginForm" })} </div> ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
