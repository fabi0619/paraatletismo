import { supabase } from '../../athletes/api/athletesService';

export interface ChampionshipExtended {
  id: string;
  nombre: string;
  pais: string;
  departamento: string;
  ciudad: string;
  fechaInicio: string;
  fechaFin: string;
  fechaTexto: string;
  creadoPor: string;
  creadoPorNombre: string;
}

export const championshipsService = {
  getChampionships: async (): Promise<ChampionshipExtended[]> => {
    const { data, error } = await supabase
      .from('para_eventos')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (error) {
      console.error('Error fetching championships:', error);
      throw new Error(error.message);
    }

    return (data || []).map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
      pais: e.pais,
      departamento: e.departamento,
      ciudad: e.ciudad,
      fechaInicio: e.fecha_inicio,
      fechaFin: e.fecha_fin,
      fechaTexto: e.fecha_texto,
      creadoPor: e.creado_por,
      creadoPorNombre: e.creado_por_nombre || 'Organización'
    }));
  }
};
