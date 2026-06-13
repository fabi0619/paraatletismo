import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qlytrcwytowverzetlkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXRyY3d5dG93dmVyemV0bGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjY2MTQsImV4cCI6MjA5NTUwMjYxNH0.cL-A9VtVjJ-PvBtHZ1T-mRgURSwI78SrkmSvmdkg_eg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================================================
// CRUD ATLETAS
// ==========================================================================

export async function getAthletes() {
  const { data: athletes, error: relError } = await supabase
    .from('para_athletes')
    .select(`
      id, nombre, cedula, fecha_nacimiento, genero, telefono, correo, 
      discapacidad, tipo_clase, clase_deportiva, foto,
      documentos:para_documentos(*),
      campeonatos:para_campeonatos(*)
    `);

  if (relError) {
    console.error('Error fetching athletes with relations:', relError);
    return [];
  }

  // Transformar las propiedades de snake_case a camelCase para mantener app.js intacto
  return athletes.map(a => ({
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
    foto: a.foto,
    documentos: a.documentos || [],
    campeonatos: a.campeonatos || []
  }));
}

export async function saveAthlete(athlete) {
  let isUpdate = !!athlete.id && !athlete.id.startsWith("valle-");

  const payload = {
    nombre: athlete.nombre,
    cedula: athlete.cedula,
    fecha_nacimiento: athlete.fechaNacimiento,
    genero: athlete.genero,
    telefono: athlete.telefono,
    correo: athlete.correo,
    discapacidad: athlete.discapacidad,
    tipo_clase: athlete.tipoClase,
    clase_deportiva: athlete.claseDeportiva,
    foto: athlete.foto
  };

  if (isUpdate) {
    const { data, error } = await supabase.from('para_athletes').update(payload).eq('id', athlete.id).select().single();
    if (error) throw error;
    return data;
  } else {
    // Usar Supabase Auth para ocultar y encriptar la contraseña usando el correo real
    const authEmail = athlete.correo.trim();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: authEmail,
      password: athlete.password,
    });

    if (authError) throw authError;

    // Usar el ID seguro generado por Supabase Auth
    if (authData.user) {
      payload.id = authData.user.id;
    }

    const { data, error } = await supabase.from('para_athletes').insert([payload]).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deleteAthlete(id) {
  const { error } = await supabase.from('para_athletes').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================================================
// CRUD CAMPEONATOS
// ==========================================================================

export async function addChampionship(athleteId, championship) {
  const payload = {
    atleta_id: athleteId,
    campeonato: championship.campeonato,
    lugar: championship.lugar,
    prueba: championship.prueba,
    marca: championship.marca,
    fecha: championship.fecha,
    posicion: championship.posicion
  };

  const { error } = await supabase.from('para_campeonatos').insert([payload]);
  if (error) throw error;
  return true;
}

export async function deleteChampionship(athleteId, championshipId) {
  const { error } = await supabase.from('para_campeonatos').delete().eq('id', championshipId);
  if (error) throw error;
  return true;
}

// ==========================================================================
// CRUD DOCUMENTOS
// ==========================================================================

export async function addDocument(athleteId, fileName, fileSize) {
  const payload = {
    atleta_id: athleteId,
    nombre: fileName,
    fecha: new Date().toISOString().split("T")[0],
    tamano: fileSize
  };

  const { error } = await supabase.from('para_documentos').insert([payload]);
  if (error) throw error;
  return true;
}

export async function deleteDocument(athleteId, docId) {
  const { error } = await supabase.from('para_documentos').delete().eq('id', docId);
  if (error) throw error;
  return true;
}

// ==========================================================================
// CAPA DE AUTENTICACIÓN Y ROLES
// ==========================================================================

export async function iniciarSesion(usuario, clave, rol) {
  if (rol === "admin") {
    if (usuario.toLowerCase() === "admin" && clave === "123") {
      const sesion = { id: "admin", nombre: "Administrador del Sistema", rol: "admin" };
      localStorage.setItem("sesion_usuario", JSON.stringify(sesion));
      return sesion;
    }
    return null;
  }

  if (rol === "profesor" || rol === "atleta") {
    // Usar el correo directamente proporcionado en el login
    const authEmail = usuario.trim();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: clave,
    });

    if (authError || !authData.user) {
      return null; // Contraseña incorrecta o usuario no existe
    }

    // Buscar el perfil público en la tabla correspondiente usando el ID seguro
    const tabla = rol === "profesor" ? "para_profesores" : "para_athletes";
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (data) {
      const sesion = { 
        id: data.id, 
        nombre: data.nombre, 
        rol: rol, 
        cedula: data.cedula,
        ...(rol === "profesor" ? { especialidad: data.especialidad } : {})
      };
      localStorage.setItem("sesion_usuario", JSON.stringify(sesion));
      return sesion;
    }
    return null;
  }

  return null;
}

export function obtenerUsuarioActual() {
  const sesion = localStorage.getItem("sesion_usuario");
  return sesion ? JSON.parse(sesion) : null;
}

export function cerrarSesion() {
  localStorage.removeItem("sesion_usuario");
}

export async function registrarProfesor(nuevoProfesor) {
  // Validar si ya existe el correo o la cédula
  const { data: existeCorreo } = await supabase
    .from('para_profesores')
    .select('id')
    .ilike('correo', nuevoProfesor.correo)
    .maybeSingle();

  if (existeCorreo) {
    return { error: "El correo electrónico ya se encuentra registrado." };
  }

  const { data: existeCedula } = await supabase
    .from('para_profesores')
    .select('id')
    .eq('cedula', nuevoProfesor.cedula)
    .maybeSingle();

  if (existeCedula) {
    return { error: "La cédula ya se encuentra registrada." };
  }

  // Registrar en Auth de forma segura usando el correo real
  const authEmail = nuevoProfesor.correo.trim();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: nuevoProfesor.password,
  });

  if (authError) {
    return { error: "Error en registro de seguridad: " + authError.message };
  }

  const payload = {
    id: authData.user.id,
    nombre: nuevoProfesor.nombre,
    especialidad: nuevoProfesor.especialidad,
    correo: nuevoProfesor.correo,
    cedula: nuevoProfesor.cedula,
    fecha_nacimiento: nuevoProfesor.fechaNacimiento
  };

  const { data, error } = await supabase.from('para_profesores').insert([payload]).select().single();
  if (error) {
    return { error: "Error al guardar perfil de profesor: " + error.message };
  }
  return data;
}

// ==========================================================================
// CRUD DE LOGROS DE PROFESORES
// ==========================================================================

export async function obtenerLogros(profesorId = null) {
  let query = supabase.from('para_logros').select('*');
  if (profesorId && profesorId !== 'admin') {
    query = query.eq('profesor_id', profesorId);
  }

  const { data, error } = await query;
  if (error) return [];

  return data.map(d => ({
    id: d.id,
    profesorId: d.profesor_id,
    atletaId: d.atleta_id,
    atletaNombre: d.atleta_nombre,
    campeonato: d.campeonato,
    logro: d.logro,
    ano: d.ano
  }));
}

export async function guardarLogro(nuevoLogro) {
  const { data: atleta } = await supabase.from('para_athletes').select('nombre').eq('id', nuevoLogro.atletaId).single();
  const atletaNombre = atleta ? atleta.nombre : "Deportista No Identificado";

  const payload = {
    profesor_id: nuevoLogro.profesorId,
    atleta_id: nuevoLogro.atletaId,
    atleta_nombre: atletaNombre,
    campeonato: nuevoLogro.campeonato,
    logro: nuevoLogro.logro,
    ano: nuevoLogro.ano
  };

  const { data, error } = await supabase.from('para_logros').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function eliminarLogro(logroId) {
  const { error } = await supabase.from('para_logros').delete().eq('id', logroId);
  if (error) throw error;
  return true;
}
