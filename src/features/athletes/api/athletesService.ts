import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qlytrcwytowverzetlkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXRyY3d5dG93dmVyemV0bGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjY2MTQsImV4cCI6MjA5NTUwMjYxNH0.cL-A9VtVjJ-PvBtHZ1T-mRgURSwI78SrkmSvmdkg_eg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface Document {
  id: string;
  atleta_id: string;
  nombre: string;
  fecha: string;
  tamano: number;
}

export interface Championship {
  id: string;
  atleta_id: string;
  campeonato: string;
  lugar: string;
  prueba: string;
  marca: string;
  fecha: string;
  posicion: string;
}

export interface Athlete {
  id: string;
  nombre: string;
  tipoDocumento: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  grupoSanguineo: string;
  paisNacimiento: string;
  departamentoNacimiento: string;
  municipioNacimiento: string;
  grupoEtnico: string;
  nivelEducativo: string;
  eps: string;
  altura: string;
  peso: string;
  telefono: string;
  telefonoFijo?: string;
  correo: string;
  paisResidencia: string;
  departamentoResidencia: string;
  municipioResidencia: string;
  barrio: string;
  direccion: string;
  estrato: string;
  discapacidad: string;
  usaSillaRuedas: string;
  usaSillaAtletica: string;
  tipoClase: string;
  claseDeportiva: string;
  club: string;
  fechaAfiliacion: string;
  liga: string;
  foto?: string;
  certificadoAfiliacion?: string;
  documentos: Document[];
  campeonatos: Championship[];
}

function parseLogroToChampionship(logroRow: any): Championship {
  const c: Championship = {
    id: logroRow.id,
    atleta_id: logroRow.atleta_id || logroRow.atletaId,
    campeonato: logroRow.campeonato,
    lugar: "Local",
    prueba: "General",
    marca: "-",
    fecha: logroRow.ano ? `${logroRow.ano}-01-01` : new Date().toISOString().split("T")[0],
    posicion: "Participación",
  };

  const text = logroRow.logro || "";

  // Try parsing AthleteProfile format
  const profileMatch = text.match(/Prueba:\s*\[([^\]]+)\]\s*\|\s*Marca:\s*\[([^\]]+)\]\s*\|\s*Posición:\s*\[([^\]]+)\](?:\s*\|\s*Lugar:\s*\[([^\]]+)\])?(?:\s*\|\s*Fecha:\s*\[([^\]]+)\])?/);
  if (profileMatch) {
    c.prueba = profileMatch[1];
    c.marca = profileMatch[2];
    c.posicion = profileMatch[3];
    if (profileMatch[4]) c.lugar = profileMatch[4];
    if (profileMatch[5]) c.fecha = profileMatch[5];
    return c;
  }

  // Try parsing LogrosView format
  const viewMatch = text.match(/Obtuvo Medalla de (.+) en la prueba de ([^.]+)/);
  if (viewMatch) {
    const medalla = viewMatch[1].toLowerCase().trim();
    c.posicion = medalla.includes("oro") ? "1" : medalla.includes("plata") ? "2" : medalla.includes("bronce") ? "3" : "Participación";
    c.prueba = viewMatch[2].trim();
    // Try to find a number in details for 'marca'
    const matchMarca = text.match(/marca\s*(?:personal)?\s*([0-9.,:]+)/i);
    if (matchMarca) c.marca = matchMarca[1];
    return c;
  }

  return c;
}

export const athletesService = {
  getAthletes: async (): Promise<Athlete[]> => {
    const { data: athletes, error } = await supabase
      .from('para_athletes')
      .select(`*`);

    if (error) {
      console.error('Error fetching athletes with relations:', error);
      throw new Error(error.message);
    }

    const { data: allLogros } = await supabase.from('para_logros').select('*');
    const logrosByAthlete: Record<string, any[]> = {};
    if (allLogros) {
      allLogros.forEach((l: any) => {
        if (!logrosByAthlete[l.atleta_id]) logrosByAthlete[l.atleta_id] = [];
        logrosByAthlete[l.atleta_id].push(l);
      });
    }

    return (athletes || []).map((a: any) => ({
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

  getAthleteById: async (id: string): Promise<Athlete | null> => {
    const { data: a, error } = await supabase
      .from('para_athletes')
      .select(`*`)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching athlete by id:', error);
      throw new Error(error.message);
    }

    if (!a) return null;

    const { data: logrosData } = await supabase.from('para_logros').select('*').eq('atleta_id', id);
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
      campeonatos: campeonatos
    };
  },

  deleteAthlete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('para_athletes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting athlete:', error);
      throw new Error(error.message);
    }
  },

  saveChampionship: async (champ: any, profesorId: string): Promise<void> => {
    // Generate the specific string format so it can be parsed later
    const logroStr = `Prueba: [${champ.prueba}] | Marca: [${champ.marca}] | Posición: [${champ.posicion}] | Lugar: [${champ.lugar}] | Fecha: [${champ.fecha}]`;
    
    // Get athlete name for para_logros required field
    const { data: atleta } = await supabase.from('para_athletes').select('nombre').eq('id', champ.atleta_id).single();
    
    const payload = {
      profesor_id: profesorId,
      atleta_id: champ.atleta_id,
      atleta_nombre: atleta?.nombre || 'Atleta',
      campeonato: champ.campeonato,
      logro: logroStr,
      ano: champ.fecha ? champ.fecha.split('-')[0] : new Date().getFullYear().toString()
    };

    const { error } = await supabase.from('para_logros').insert([payload]);
    if (error) {
      console.error('Error saving championship as logro:', error);
      throw new Error(error.message);
    }
  }
};
