const serverIslandMap = new Map([
	["ProfessorIsland", () => import("../chunks/ProfessorIsland_dyUFnEtG.mjs")],
	["ProfessorsIsland", () => import("../chunks/ProfessorsIsland_C-xURvU3.mjs")],
	["AthletesIsland", () => import("../chunks/AthletesIsland_C3XJkdrY.mjs")],
	["AthleteIsland", () => import("../chunks/AthleteIsland_-lNrMSlc.mjs")],
]);

const serverIslandNameMap = new Map([
  [
    "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorIsland.astro",
    "ProfessorIsland"
  ],
  [
    "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorsIsland.astro",
    "ProfessorsIsland"
  ],
  [
    "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthletesIsland.astro",
    "AthletesIsland"
  ],
  [
    "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/AthleteIsland.astro",
    "AthleteIsland"
  ]
]);

export { serverIslandMap, serverIslandNameMap };
