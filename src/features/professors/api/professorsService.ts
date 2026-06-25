import { supabase } from '../../athletes/api/athletesService';

export interface Professor {
  id: string;
  nombre: string;
  especialidad: string;
  correo: string;
  cedula: string;
  fechaNacimiento: string;
}

export const professorsService = {
  getProfessors: async (): Promise<Professor[]> => {
    const { data, error } = await supabase
      .from('para_profesores')
      .select('id, nombre, especialidad, correo, cedula, fecha_nacimiento');

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
    }));
  }
};
