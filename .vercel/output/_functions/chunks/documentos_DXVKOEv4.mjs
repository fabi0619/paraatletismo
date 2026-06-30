import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { $ as $$Layout } from './Layout_B_vqfV4T.mjs';

const $$Documentos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Carga de Documentos - Paraatletismo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DocumentUploadView", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/athletes/components/DocumentUploadView", "client:component-export": "DocumentUploadView" })} ` })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/atleta/documentos.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/pages/atleta/documentos.astro";
const $$url = "/atleta/documentos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Documentos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
