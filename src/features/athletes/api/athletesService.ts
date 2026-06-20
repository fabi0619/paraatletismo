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
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  correo: string;
  discapacidad: string;
  tipoClase: string;
  claseDeportiva: string;
  club: string;
  foto?: string;
  documentos: Document[];
  campeonatos: Championship[];
}

export const athletesService = {
  getAthletes: async (): Promise<Athlete[]> => {
    const { data: athletes, error } = await supabase
      .from('para_athletes')
      .select(`
        id, nombre, cedula, fecha_nacimiento, genero, telefono, correo, 
        discapacidad, tipo_clase, clase_deportiva, foto, club,
        documentos:para_documentos(*),
        campeonatos:para_campeonatos(*)
      `);

    if (error) {
      console.error('Error fetching athletes with relations:', error);
      throw new Error(error.message);
    }

    return (athletes || []).map((a: any) => ({
      id: a.id,
      nombre: a.nombre,
      cedula: a.cedula,
      fechaNacimiento: a.fecha_nacimiento,
      genero: a.genero,
      telefono: a.telefono,
      correo: a.correo,
      discapacidad: a.discapacidad,
      tipoClase: a.tipo_clase,
      claseDeportiva: a.clase_deportiva,
      club: a.club,
      foto: a.foto,
      documentos: a.documentos || [],
      campeonatos: a.campeonatos || []
    }));
  },

  getAthleteById: async (id: string): Promise<Athlete | null> => {
    const { data: a, error } = await supabase
      .from('para_athletes')
      .select(`
        id, nombre, cedula, fecha_nacimiento, genero, telefono, correo, 
        discapacidad, tipo_clase, clase_deportiva, foto, club,
        documentos:para_documentos(*),
        campeonatos:para_campeonatos(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching athlete by id:', error);
      throw new Error(error.message);
    }

    if (!a) return null;

    return {
      id: a.id,
      nombre: a.nombre,
      cedula: a.cedula,
      fechaNacimiento: a.fecha_nacimiento,
      genero: a.genero,
      telefono: a.telefono,
      correo: a.correo,
      discapacidad: a.discapacidad,
      tipoClase: a.tipo_clase,
      claseDeportiva: a.clase_deportiva,
      club: a.club,
      foto: a.foto,
      documentos: a.documentos || [],
      campeonatos: a.campeonatos || []
    };
  }
};
