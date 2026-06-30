import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$MainLayout } from './MainLayout_D5u_EKrR.mjs';
import $$AthletesIsland from './AthletesIsland_C3XJkdrY.mjs';
import { A as AthletesGridSkeleton } from './AthletesView_CO7a2wD4.mjs';

const $$Atletas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Atletas - Valle Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AthletesIsland", $$AthletesIsland, { "server:defer": true, "server:component-directive": "defer", "server:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthletesIsland.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "AthletesGridSkeleton", AthletesGridSkeleton, { "slot": "fallback" })}` })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/atletas.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/atletas.astro";
const $$url = "/atletas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Atletas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
