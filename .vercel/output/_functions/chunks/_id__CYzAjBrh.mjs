import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate, al as maybeRenderHead } from './transition_D2c4wlGk.mjs';
import { $ as $$Layout } from './Layout_B_vqfV4T.mjs';
import { $ as $$ProfessorIsland, P as ProfileSkeleton } from './ProfessorIsland_CU10B7Va.mjs';

const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Perfil del Entrenador" }, { "default": ($$result2) => renderTemplate`${id ? renderTemplate`${renderComponent($$result2, "ProfessorIsland", $$ProfessorIsland, { "server:defer": true, "id": id, "server:component-directive": "defer", "server:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorIsland.astro", "server:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "ProfileSkeleton", ProfileSkeleton, { "slot": "fallback" })}` })}` : renderTemplate`${maybeRenderHead()}<p>ID no proporcionado</p>`}` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/profesor/[id].astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/profesor/[id].astro";
const $$url = "/profesor/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
