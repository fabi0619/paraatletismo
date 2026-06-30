import { z } from "zod";

// Esquema de Login general para Atletas y Profesores
export const loginSchema = z.object({
  usuario: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  clave: z.string().min(1, "La contraseña es requerida"),
  rol: z.enum(["atleta", "profesor"]),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Esquema de Login para Administradores
export const adminLoginSchema = z.object({
  usuario: z.string().min(1, "El usuario administrador es requerido"),
  clave: z.string().min(1, "La contraseña es requerida"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;


// Esquema de Registro de Atletas
export const registerAthleteSchema = z.object({
  // Datos Básicos
  nombre: z.string().optional(),
  tipoDocumento: z.string().optional(),
  cedula: z.string().optional(),
  genero: z.string().optional(),
  grupoSanguineo: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  paisNacimiento: z.string().optional(),
  departamentoNacimiento: z.string().optional(),
  municipioNacimiento: z.string().optional(),
  grupoEtnico: z.string().optional(),
  nivelEducativo: z.string().optional(),
  eps: z.string().optional(),
  altura: z.string().optional(),
  peso: z.string().optional(),
  
  // Información de Contacto
  correo: z.string().min(1, "El correo electrónico es requerido").email("Ingrese un correo electrónico válido"),
  paisResidencia: z.string().optional(),
  departamentoResidencia: z.string().optional(),
  municipioResidencia: z.string().optional(),
  barrio: z.string().optional(),
  direccion: z.string().optional(),
  estrato: z.string().optional(),
  telefonoFijo: z.string().optional(),
  telefono: z.string().optional(),
  discapacidad: z.string().optional(),
  usaSillaRuedas: z.string().optional(),
  usaSillaAtletica: z.string().optional(),

  // Información Deportiva
  club: z.string().optional(),
  fechaAfiliacion: z.string().optional(),
  liga: z.string().optional(),
  certificadoAfiliacion: z.any().optional(),

  // Otros campos (existentes)
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  foto: z.string().optional(),

  // Nueva Información Deportiva Avanzada
  modalidad: z.string().optional(),
  claseDeportiva: z.string().optional(),
  tipoClase: z.string().optional(),
  
  // Pruebas (Arrays de strings con las pruebas seleccionadas)
  pruebasPista: z.array(z.string()).optional(),
  pruebasCampo: z.array(z.string()).optional(),

  // Tallas Calzado
  tallaSpikeVelocidad: z.string().optional(),
  tallaSpikeSemifondo: z.string().optional(),
  tallaSpikeFondo: z.string().optional(),
  tallaSpikeBala: z.string().optional(),
  tallaSpikeJabalina: z.string().optional(),
  tallaSpikeDisco: z.string().optional(),
  tallaSpikeClava: z.string().optional(),
  tallaSpikeSaltoLongitud: z.string().optional(),
  tallaSpikeSaltoAltura: z.string().optional(),
  tallaTenisPresentacion: z.string().optional(),

  // Tallas Uniformes
  tallaChaqueta: z.string().optional(),
  tallaPantalon: z.string().optional(),
  tallaCamibuso: z.string().optional(),
  tallaCamisilla: z.string().optional(),
  tallaLicraMedia: z.string().optional(),
  tallaLicraLarga: z.string().optional(),

  // Información Acudiente
  nombreAcudiente: z.string().optional(),
  correoAcudiente: z.string().optional(),
  departamentoAcudiente: z.string().optional(),
  municipioAcudiente: z.string().optional(),
  barrioAcudiente: z.string().optional(),
  direccionAcudiente: z.string().optional(),
  telefonoAcudiente: z.string().optional(),
});

export type RegisterAthleteInput = z.infer<typeof registerAthleteSchema>;

// Esquema de Edición de Atletas (Contraseña opcional)
export const editAthleteSchema = registerAthleteSchema.extend({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
});

export type EditAthleteInput = z.infer<typeof editAthleteSchema>;

// Esquema de Registro de Profesores
export const registerCoachSchema = registerAthleteSchema.omit({
  tallaSpikeVelocidad: true,
  tallaSpikeSemifondo: true,
  tallaSpikeFondo: true,
  tallaSpikeBala: true,
  tallaSpikeJabalina: true,
  tallaSpikeDisco: true,
  tallaSpikeClava: true,
  tallaSpikeSaltoLongitud: true,
  tallaSpikeSaltoAltura: true,
  tallaLicraMedia: true,
  tallaLicraLarga: true,
  tallaCamisilla: true,
  tallaChaqueta: true,
  tallaPantalon: true,
  club: true,
  fechaAfiliacion: true,
  liga: true,
  certificadoAfiliacion: true,
  claseDeportiva: true,
  pruebasPista: true,
  pruebasCampo: true,
  discapacidad: true,
  usaSillaRuedas: true,
  usaSillaAtletica: true,
}).extend({
  tallaPantaloneta: z.string().optional(),
});

export type RegisterCoachInput = z.infer<typeof registerCoachSchema>;

// Esquema de Edición de Profesores
export const editCoachSchema = registerCoachSchema.extend({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
});

export type EditCoachInput = z.infer<typeof editCoachSchema>;
