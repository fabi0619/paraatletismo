import { supabase } from '../../athletes/api/athletesService';
import { saveProfessor as saveProfessorDb, obtenerLogros, actualizarLogro, eliminarLogro } from '../../../lib/supabase';

export interface Professor {
  id: string;
  nombre: string;
  especialidad: string;
  correo: string;
  cedula: string;
  fechaNacimiento: string;
  genero?: string;
  telefono?: string;
  foto?: string;
}

export const professorsService = {
  getProfessors: async (): Promise<Professor[]> => {
    const { data, error } = await supabase
      .from('para_profesores')
      .select('id, nombre, especialidad, correo, cedula, fecha_nacimiento, genero, telefono, foto');

    if (error) {
      console.error('Error fetching professors:', error);
      throw new Error(error.message);
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      especialidad: p.especialidad,
      correo: p.correo,
      cedula: p.cedula,
      fechaNacimiento: p.fecha_nacimiento,
      genero: p.genero,
      telefono: p.telefono,
      foto: p.foto,
    }));
  },

  getProfessorById: async (id: string): Promise<Professor | null> => {
    const { data, error } = await supabase
      .from('para_profesores')
      .select('id, nombre, especialidad, correo, cedula, fecha_nacimiento, genero, telefono, foto')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching professor by id:', error);
      throw new Error(error.message);
    }

    if (!data) return null;

    return {
      id: data.id,
      nombre: data.nombre,
      especialidad: data.especialidad,
      correo: data.correo,
      cedula: data.cedula,
      fechaNacimiento: data.fecha_nacimiento,
      genero: data.genero,
      telefono: data.telefono,
      foto: data.foto,
    };
  },

  getProfessorAchievements: async (profesorId: string): Promise<any[]> => {
    return (obtenerLogros as any)(profesorId);
  },

  updateAchievement: async (logroId: string, payload: any): Promise<any> => {
    const res = await actualizarLogro(logroId, payload);
    if (res && typeof res === 'object' && 'error' in res) throw new Error(res.error as string);
    return res;
  },

  deleteAchievement: async (logroId: string): Promise<boolean> => {
    const res = await eliminarLogro(logroId);
    if (typeof res !== 'boolean' && res && 'error' in res) throw new Error(res.error as string);
    return true;
  },

  saveProfessor: async (professor: any): Promise<any> => {
    return saveProfessorDb(professor);
  }
};



