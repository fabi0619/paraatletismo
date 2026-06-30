import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { a as AthletesView } from './AthletesView_CO7a2wD4.mjs';
import { a as athletesService } from './QueryProvider__3BIDRjC.mjs';

const $$AthletesIsland = createComponent(async ($$result, $$props, $$slots) => {
  let initialData = null;
  try {
    initialData = await athletesService.getAthletes();
  } catch (e) {
    console.error("Error fetching athletes in Server Island:", e);
  }
  return renderTemplate`${renderComponent($$result, "AthletesView", AthletesView, { "client:load": true, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/athletes/components/AthletesView", "client:component-export": "AthletesView" })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthletesIsland.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthletesIsland.astro";
const $$url = undefined;

export { $$AthletesIsland as default, $$file as file, $$url as url };
