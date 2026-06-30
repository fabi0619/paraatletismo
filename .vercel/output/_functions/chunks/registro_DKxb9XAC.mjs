import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate, al as maybeRenderHead } from './transition_D2c4wlGk.mjs';
import { $ as $$Layout } from './Layout_B_vqfV4T.mjs';
import { R as RegisterForm } from './RegisterForm_BeLMO-_6.mjs';
/* empty css                 */

const $$Registro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registro - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10 flex-1"> ${renderComponent($$result2, "RegisterForm", RegisterForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/auth/components/RegisterForm", "client:component-export": "RegisterForm" })} </div> ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/registro.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/registro.astro";
const $$url = "/registro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Registro,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
