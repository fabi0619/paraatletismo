import { supabase } from '../../athletes/api/athletesService';

export interface Logro {
  id: string;
  profesorId: string;
  atletaId: string;
  atletaNombre: string;
  campeonato: string;
  logro: string;
  ano: string;
  profesorNombre?: string;
}

export const logrosService = {
  getLogros: async (): Promise<Logro[]> => {
    const { data, error } = await supabase
      .from('para_logros')
      .select(`
        id, profesor_id, atleta_id, atleta_nombre, campeonato, logro, ano,
        para_profesores (
          nombre
        )
      `)
      .order('ano', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      throw new Error(error.message);
    }

    return (data || []).map((d: any) => ({
      id: d.id,
      profesorId: d.profesor_id,
      atletaId: d.atleta_id,
      atletaNombre: d.atleta_nombre,
      campeonato: d.campeonato,
      logro: d.logro,
      ano: d.ano,
      profesorNombre: d.para_profesores?.nombre || 'Entrenador'
    }));
  },

  saveLogro: async (logro: Omit<Logro, 'id' | 'atletaNombre' | 'profesorNombre'>): Promise<any> => {
    // Fetch athlete name first
    const { data: atleta } = await supabase
      .from('para_athletes')
      .select('nombre')
      .eq('id', logro.atletaId)
      .single();

    const atletaNombre = atleta ? atleta.nombre : "Deportista No Identificado";

    const payload = {
      profesor_id: logro.profesorId,
      atleta_id: logro.atletaId,
      atleta_nombre: atletaNombre,
      campeonato: logro.campeonato,
      logro: logro.logro,
      ano: logro.ano
    };

    const { data, error } = await supabase
      .from('para_logros')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error saving achievement:', error);
      throw new Error(error.message);
    }

    return data;
  }
};
