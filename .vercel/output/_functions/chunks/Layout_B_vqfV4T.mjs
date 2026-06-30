import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { ap as renderHead, aq as renderSlot, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import 'clsx';
/* empty css                 */

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Valle Oro Puro - Paraatletismo" } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><!-- Etiquetas Meta SEO --><meta name="description" content="Plataforma de gestión e historial deportivo de atletas de la selección de paraatletismo del Valle del Cauca. Registro, marcas, campeonatos y clasificaciones."><meta name="keywords" content="paraatletismo, valle del cauca, atletismo adaptado, clasificacion deportiva, indeportes valle"><!-- Fuentes e Iconos --><!-- La fuente Plus Jakarta Sans se carga desde @fontsource-variable (sin CDN externo) --><link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">${renderHead()}</head> <body class="min-h-screen relative overflow-x-hidden bg-slate-50"> <!-- Animated background blobs --> <div aria-hidden="true" class="pointer-events-none fixed inset-0 z-0" style="background: radial-gradient(ellipse 80% 60% at 50% -10%, hsla(0,75%,45%,0.25) 0%, transparent 70%);"></div> <div aria-hidden="true" class="pointer-events-none fixed bottom-0 right-0 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl" style="background: hsl(0,75%,45%);"></div> <div aria-hidden="true" class="pointer-events-none fixed top-1/2 left-0 h-96 w-96 -translate-y-1/2 -translate-x-1/2 rounded-full opacity-[0.15] blur-3xl" style="background: hsl(348,100%,40%);"></div> <div class="relative z-10 flex min-h-screen flex-col"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
