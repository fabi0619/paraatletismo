import { supabase } from '../../athletes/api/athletesService';

export interface ChampionshipExtended {
  id: string;
  atleta_id: string;
  campeonato: string;
  lugar: string;
  prueba: string;
  marca: string;
  fecha: string;
  posicion: string;
  athleteName?: string;
}

export const championshipsService = {
  getChampionships: async (): Promise<ChampionshipExtended[]> => {
    const { data, error } = await supabase
      .from('para_campeonatos')
      .select(`
        id, atleta_id, campeonato, lugar, prueba, marca, fecha, posicion,
        para_athletes (
          nombre
        )
      `);

    if (error) {
      console.error('Error fetching championships:', error);
      throw new Error(error.message);
    }

    return (data || []).map((c: any) => ({
      id: c.id,
      atleta_id: c.atleta_id,
      campeonato: c.campeonato,
      lugar: c.lugar,
      prueba: c.prueba,
      marca: c.marca,
      fecha: c.fecha,
      posicion: c.posicion,
      athleteName: c.para_athletes?.nombre || 'Desconocido'
    }));
  }
};
