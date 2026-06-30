import { createClient } from '@supabase/supabase-js';
import { jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const SUPABASE_URL = "https://qlytrcwytowverzetlkv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXRyY3d5dG93dmVyemV0bGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjY2MTQsImV4cCI6MjA5NTUwMjYxNH0.cL-A9VtVjJ-PvBtHZ1T-mRgURSwI78SrkmSvmdkg_eg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
function parseLogroToChampionship(logroRow) {
  const c = {
    id: logroRow.id,
    atleta_id: logroRow.atleta_id || logroRow.atletaId,
    campeonato: logroRow.campeonato,
    lugar: "Local",
    prueba: "General",
    marca: "-",
    fecha: logroRow.ano ? `${logroRow.ano}-01-01` : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    posicion: "Participación"
  };
  const text = logroRow.logro || "";
  const profileMatch = text.match(/Prueba:\s*\[([^\]]+)\]\s*\|\s*Marca:\s*\[([^\]]+)\]\s*\|\s*Posición:\s*\[([^\]]+)\](?:\s*\|\s*Lugar:\s*\[([^\]]+)\])?(?:\s*\|\s*Fecha:\s*\[([^\]]+)\])?/);
  if (profileMatch) {
    c.prueba = profileMatch[1];
    c.marca = profileMatch[2];
    c.posicion = profileMatch[3];
    if (profileMatch[4]) c.lugar = profileMatch[4];
    if (profileMatch[5]) c.fecha = profileMatch[5];
    return c;
  }
  const viewMatch = text.match(/Obtuvo Medalla de (.+) en la prueba de ([^.]+)/);
  if (viewMatch) {
    const medalla = viewMatch[1].toLowerCase().trim();
    c.posicion = medalla.includes("oro") ? "1" : medalla.includes("plata") ? "2" : medalla.includes("bronce") ? "3" : "Participación";
    c.prueba = viewMatch[2].trim();
    const matchMarca = text.match(/marca\s*(?:personal)?\s*([0-9.,:]+)/i);
    if (matchMarca) c.marca = matchMarca[1];
    return c;
  }
  return c;
}
const athletesService = {
  getAthletes: async () => {
    const { data: athletes, error } = await supabase.from("para_athletes").select(`*`);
    if (error) {
      console.error("Error fetching athletes with relations:", error);
      throw new Error(error.message);
    }
    const { data: allLogros } = await supabase.from("para_logros").select("*");
    const logrosByAthlete = {};
    if (allLogros) {
      allLogros.forEach((l) => {
        if (!logrosByAthlete[l.atleta_id]) logrosByAthlete[l.atleta_id] = [];
        logrosByAthlete[l.atleta_id].push(l);
      });
    }
    return (athletes || []).map((a) => ({
      id: a.id,
      nombre: a.nombre,
      tipoDocumento: a.tipo_documento,
      cedula: a.cedula,
      fechaNacimiento: a.fecha_nacimiento,
      genero: a.genero,
      grupoSanguineo: a.grupo_sanguineo,
      paisNacimiento: a.pais_nacimiento,
      departamentoNacimiento: a.departamento_nacimiento,
      municipioNacimiento: a.municipio_nacimiento,
      grupoEtnico: a.grupo_etnico,
      nivelEducativo: a.nivel_educativo,
      eps: a.eps,
      altura: a.altura,
      peso: a.peso,
      telefono: a.telefono,
      telefonoFijo: a.telefono_fijo,
      correo: a.correo,
      paisResidencia: a.pais_residencia,
      departamentoResidencia: a.departamento_residencia,
      municipioResidencia: a.municipio_residencia,
      barrio: a.barrio,
      direccion: a.direccion,
      estrato: a.estrato,
      discapacidad: a.discapacidad,
      usaSillaRuedas: a.usa_silla_ruedas,
      usaSillaAtletica: a.usa_silla_atletica,
      tipoClase: a.tipo_clase,
      claseDeportiva: a.clase_deportiva,
      club: a.club,
      fechaAfiliacion: a.fecha_afiliacion,
      liga: a.liga,
      foto: a.foto,
      certificadoAfiliacion: a.certificado_afiliacion_url,
      documentos: a.documentos || [],
      campeonatos: (logrosByAthlete[a.id] || []).map(parseLogroToChampionship).sort((x, y) => new Date(y.fecha).getTime() - new Date(x.fecha).getTime())
    }));
  },
  getAthleteById: async (id) => {
    const { data: a, error } = await supabase.from("para_athletes").select(`*`).eq("id", id).maybeSingle();
    if (error) {
      console.error("Error fetching athlete by id:", error);
      throw new Error(error.message);
    }
    if (!a) return null;
    const { data: logrosData } = await supabase.from("para_logros").select("*").eq("atleta_id", id);
    const campeonatos = (logrosData || []).map(parseLogroToChampionship).sort((x, y) => new Date(y.fecha).getTime() - new Date(x.fecha).getTime());
    return {
      id: a.id,
      nombre: a.nombre,
      tipoDocumento: a.tipo_documento,
      cedula: a.cedula,
      fechaNacimiento: a.fecha_nacimiento,
      genero: a.genero,
      grupoSanguineo: a.grupo_sanguineo,
      paisNacimiento: a.pais_nacimiento,
      departamentoNacimiento: a.departamento_nacimiento,
      municipioNacimiento: a.municipio_nacimiento,
      grupoEtnico: a.grupo_etnico,
      nivelEducativo: a.nivel_educativo,
      eps: a.eps,
      altura: a.altura,
      peso: a.peso,
      telefono: a.telefono,
      telefonoFijo: a.telefono_fijo,
      correo: a.correo,
      paisResidencia: a.pais_residencia,
      departamentoResidencia: a.departamento_residencia,
      municipioResidencia: a.municipio_residencia,
      barrio: a.barrio,
      direccion: a.direccion,
      estrato: a.estrato,
      discapacidad: a.discapacidad,
      usaSillaRuedas: a.usa_silla_ruedas,
      usaSillaAtletica: a.usa_silla_atletica,
      tipoClase: a.tipo_clase,
      claseDeportiva: a.clase_deportiva,
      club: a.club,
      fechaAfiliacion: a.fecha_afiliacion,
      liga: a.liga,
      foto: a.foto,
      certificadoAfiliacion: a.certificado_afiliacion_url,
      documentos: a.documentos || [],
      campeonatos
    };
  },
  deleteAthlete: async (id) => {
    const { error } = await supabase.from("para_athletes").delete().eq("id", id);
    if (error) {
      console.error("Error deleting athlete:", error);
      throw new Error(error.message);
    }
  },
  saveChampionship: async (champ, profesorId) => {
    const logroStr = `Prueba: [${champ.prueba}] | Marca: [${champ.marca}] | Posición: [${champ.posicion}] | Lugar: [${champ.lugar}] | Fecha: [${champ.fecha}]`;
    const { data: atleta } = await supabase.from("para_athletes").select("nombre").eq("id", champ.atleta_id).single();
    const payload = {
      profesor_id: profesorId,
      atleta_id: champ.atleta_id,
      atleta_nombre: atleta?.nombre || "Atleta",
      campeonato: champ.campeonato,
      logro: logroStr,
      ano: champ.fecha ? champ.fecha.split("-")[0] : (/* @__PURE__ */ new Date()).getFullYear().toString()
    };
    const { error } = await supabase.from("para_logros").insert([payload]);
    if (error) {
      console.error("Error saving championship as logro:", error);
      throw new Error(error.message);
    }
  }
};

const athletesService$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  athletesService,
  supabase
}, Symbol.toStringTag, { value: 'Module' }));

function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1e3 * 60 * 5,
        // 5 minutes
        refetchOnWindowFocus: false
      }
    }
  }));
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children });
}

export { QueryProvider as Q, athletesService as a, athletesService$1 as b, supabase as s };
