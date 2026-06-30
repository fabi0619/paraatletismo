import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qlytrcwytowverzetlkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseXRyY3d5dG93dmVyemV0bGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjY2MTQsImV4cCI6MjA5NTUwMjYxNH0.cL-A9VtVjJ-PvBtHZ1T-mRgURSwI78SrkmSvmdkg_eg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function saveAthlete(athlete) {
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
    club: athlete.club,
    foto: athlete.foto
  };

  // Crear un cliente temporal sin sesión para evitar bloqueos de RLS al editar otro usuario
  const localSupabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  if (isUpdate) {
    const { data, error } = await localSupabase.from('para_athletes').update(payload).eq('id', athlete.id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`No se encontró el atleta con id ${athlete.id} para actualizar. Verifique permisos o que el registro exista.`);
    return data;
  } else {
    // Usar Supabase Auth para ocultar y encriptar la contraseña usando el correo real
    const authEmail = athlete.correo.trim();
    const { data: authData, error: authError } = await localSupabase.auth.signUp({
      email: authEmail,
      password: athlete.password,
    });

    if (authError) throw authError;

    // Usar el ID seguro generado por Supabase Auth
    if (authData.user) {
      payload.id = authData.user.id;
    }

    const { data, error } = await localSupabase.from('para_athletes').insert([payload]).select().single();
    if (error) throw error;
    return data;
  }
}

// ==========================================================================
// CAPA DE AUTENTICACIÓN Y ROLES
// ==========================================================================

async function iniciarSesion(usuario, clave, rol) {
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

async function registrarProfesor(nuevoProfesor) {
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
    cedula: nuevoProfesor.cedula,
    fecha_nacimiento: nuevoProfesor.fechaNacimiento,
    genero: nuevoProfesor.genero,
    telefono: nuevoProfesor.telefono,
    correo: nuevoProfesor.correo,
    especialidad: nuevoProfesor.especialidad,
    foto: nuevoProfesor.foto,
    // Nuevos campos
    tipo_documento: nuevoProfesor.tipoDocumento,
    grupo_sanguineo: nuevoProfesor.grupoSanguineo,
    pais_nacimiento: nuevoProfesor.paisNacimiento,
    departamento_nacimiento: nuevoProfesor.departamentoNacimiento,
    municipio_nacimiento: nuevoProfesor.municipioNacimiento,
    grupo_etnico: nuevoProfesor.grupoEtnico,
    nivel_educativo: nuevoProfesor.nivelEducativo,
    eps: nuevoProfesor.eps,
    altura: nuevoProfesor.altura,
    peso: nuevoProfesor.peso,
    pais_residencia: nuevoProfesor.paisResidencia,
    departamento_residencia: nuevoProfesor.departamentoResidencia,
    municipio_residencia: nuevoProfesor.municipioResidencia,
    barrio: nuevoProfesor.barrio,
    direccion: nuevoProfesor.direccion,
    estrato: nuevoProfesor.estrato,
    telefono_fijo: nuevoProfesor.telefonoFijo,
    discapacidad: nuevoProfesor.discapacidad,
    usa_silla_ruedas: nuevoProfesor.usaSillaRuedas,
    usa_silla_atletica: nuevoProfesor.usaSillaAtletica,
    club: nuevoProfesor.club,
    fecha_afiliacion: nuevoProfesor.fechaAfiliacion,
    liga: nuevoProfesor.liga,
    clase_deportiva: nuevoProfesor.claseDeportiva,
    tipo_clase: nuevoProfesor.tipoClase,
    modalidad: nuevoProfesor.modalidad,
    pruebas_pista: nuevoProfesor.pruebasPista,
    pruebas_campo: nuevoProfesor.pruebasCampo,
    talla_tenis_presentacion: nuevoProfesor.tallaTenisPresentacion,
    talla_chaqueta: nuevoProfesor.tallaChaqueta,
    talla_pantalon: nuevoProfesor.tallaPantalon,
    talla_camibuso: nuevoProfesor.tallaCamibuso,
  };

  const { data, error } = await supabase.from('para_profesores').insert([payload]).select().single();
  if (error) {
    return { error: "Error al guardar perfil de profesor: " + error.message };
  }
  return data;
}

async function saveProfessor(professor) {
  let isUpdate = !!professor.id && !professor.id.startsWith("temp-");

  const payload = {
    nombre: professor.nombre,
    cedula: professor.cedula,
    fecha_nacimiento: professor.fechaNacimiento,
    genero: professor.genero,
    telefono: professor.telefono,
    correo: professor.correo,
    especialidad: professor.especialidad,
    foto: professor.foto,
    tipo_documento: professor.tipoDocumento,
    grupo_sanguineo: professor.grupoSanguineo,
    pais_nacimiento: professor.paisNacimiento,
    departamento_nacimiento: professor.departamentoNacimiento,
    municipio_nacimiento: professor.municipioNacimiento,
    grupo_etnico: professor.grupoEtnico,
    nivel_educativo: professor.nivelEducativo,
    eps: professor.eps,
    altura: professor.altura,
    peso: professor.peso,
    pais_residencia: professor.paisResidencia,
    departamento_residencia: professor.departamentoResidencia,
    municipio_residencia: professor.municipioResidencia,
    barrio: professor.barrio,
    direccion: professor.direccion,
    estrato: professor.estrato,
    telefono_fijo: professor.telefonoFijo,
    discapacidad: professor.discapacidad,
    usa_silla_ruedas: professor.usaSillaRuedas,
    usa_silla_atletica: professor.usaSillaAtletica,
    club: professor.club,
    fecha_afiliacion: professor.fechaAfiliacion,
    liga: professor.liga,
    clase_deportiva: professor.claseDeportiva,
    tipo_clase: professor.tipoClase,
    modalidad: professor.modalidad,
    pruebas_pista: professor.pruebasPista,
    pruebas_campo: professor.pruebasCampo,
    talla_tenis_presentacion: professor.tallaTenisPresentacion,
    talla_chaqueta: professor.tallaChaqueta,
    talla_pantalon: professor.tallaPantalon,
    talla_camibuso: professor.tallaCamibuso,
  };

  if (isUpdate) {
    const { data, error } = await supabase.from('para_profesores').update(payload).eq('id', professor.id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`No se encontró el profesor con id ${professor.id} para actualizar.`);
    return data;
  } else {
    return registrarProfesor(professor);
  }
}


// ==========================================================================
// CRUD DE LOGROS DE PROFESORES
// ==========================================================================

async function obtenerLogros(profesorId = null) {
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

async function eliminarLogro(logroId) {
  const { error } = await supabase.from('para_logros').delete().eq('id', logroId);
  if (error) {
    return { error: "Error al eliminar logro: " + error.message };
  }
  return true;
}

async function actualizarLogro(logroId, datosLogro) {
  const payload = {
    campeonato: datosLogro.campeonato,
    logro: datosLogro.logro,
    ano: datosLogro.ano
  };

  const { data, error } = await supabase
    .from('para_logros')
    .update(payload)
    .eq('id', logroId)
    .select()
    .single();

  if (error) {
    return { error: "Error al actualizar logro: " + error.message };
  }
  return data;
}

export { actualizarLogro as a, saveAthlete as b, eliminarLogro as e, iniciarSesion as i, obtenerLogros as o, saveProfessor as s };
