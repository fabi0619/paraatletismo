import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$MainLayout } from './MainLayout_D5u_EKrR.mjs';
import { $ as $$ProfessorsIsland, P as ProfessorsGridSkeleton } from './ProfessorsIsland_3klHSMcX.mjs';

const $$Profesores = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Entrenadores - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProfessorsIsland", $$ProfessorsIsland, { "server:defer": true, "server:component-directive": "defer", "server:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorsIsland.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "ProfessorsGridSkeleton", ProfessorsGridSkeleton, { "slot": "fallback" })}` })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/profesores.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/profesores.astro";
const $$url = "/profesores";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profesores,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
