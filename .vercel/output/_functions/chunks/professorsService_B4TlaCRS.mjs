import { s as supabase } from './QueryProvider__3BIDRjC.mjs';
import { s as saveProfessor, e as eliminarLogro, a as actualizarLogro, o as obtenerLogros } from './supabase_DtntKppG.mjs';

const professorsService = {
  getProfessors: async () => {
    const { data, error } = await supabase.from("para_profesores").select("id, nombre, especialidad, correo, cedula, fecha_nacimiento, genero, telefono, foto");
    if (error) {
      console.error("Error fetching professors:", error);
      throw new Error(error.message);
    }
    return (data || []).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      especialidad: p.especialidad,
      correo: p.correo,
      cedula: p.cedula,
      fechaNacimiento: p.fecha_nacimiento,
      genero: p.genero,
      telefono: p.telefono,
      foto: p.foto
    }));
  },
  getProfessorById: async (id) => {
    const { data, error } = await supabase.from("para_profesores").select("id, nombre, especialidad, correo, cedula, fecha_nacimiento, genero, telefono, foto").eq("id", id).maybeSingle();
    if (error) {
      console.error("Error fetching professor by id:", error);
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
      foto: data.foto
    };
  },
  getProfessorAchievements: async (profesorId) => {
    return obtenerLogros(profesorId);
  },
  updateAchievement: async (logroId, payload) => {
    const res = await actualizarLogro(logroId, payload);
    if (res?.error) throw new Error(res.error);
    return res;
  },
  deleteAchievement: async (logroId) => {
    const res = await eliminarLogro(logroId);
    if (res?.error) throw new Error(res.error);
    return true;
  },
  saveProfessor: async (professor) => {
    return saveProfessor(professor);
  }
};

export { professorsService as p };
