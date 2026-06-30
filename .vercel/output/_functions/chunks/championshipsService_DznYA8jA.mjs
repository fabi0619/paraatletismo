import { s as supabase } from './QueryProvider__3BIDRjC.mjs';

const championshipsService = {
  getChampionships: async () => {
    const { data, error } = await supabase.from("para_eventos").select("*").order("fecha_inicio", { ascending: false });
    if (error) {
      console.error("Error fetching championships:", error);
      throw new Error(error.message);
    }
    return (data || []).map((e) => ({
      id: e.id,
      nombre: e.nombre,
      pais: e.pais,
      departamento: e.departamento,
      ciudad: e.ciudad,
      fechaInicio: e.fecha_inicio,
      fechaFin: e.fecha_fin,
      fechaTexto: e.fecha_texto,
      creadoPor: e.creado_por,
      creadoPorNombre: e.creado_por_nombre || "Organización"
    }));
  },
  saveChampionship: async (championship) => {
    const payload = {
      nombre: championship.nombre,
      pais: championship.pais,
      departamento: championship.departamento,
      ciudad: championship.ciudad,
      fecha_inicio: championship.fechaInicio,
      fecha_fin: championship.fechaFin,
      fecha_texto: championship.fechaTexto,
      creado_por: championship.creadoPor,
      creado_por_nombre: championship.creadoPorNombre
    };
    const { data, error } = await supabase.from("para_eventos").insert([payload]).select().single();
    if (error) {
      console.error("Error saving championship:", error);
      throw new Error(error.message);
    }
    return {
      id: data.id,
      nombre: data.nombre,
      pais: data.pais,
      departamento: data.departamento,
      ciudad: data.ciudad,
      fechaInicio: data.fecha_inicio,
      fechaFin: data.fecha_fin,
      fechaTexto: data.fecha_texto,
      creadoPor: data.creado_por,
      creadoPorNombre: data.creado_por_nombre || "Organización"
    };
  }
};

export { championshipsService as c };
