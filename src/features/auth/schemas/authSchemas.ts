import { z } from "zod";

// Esquema de Login general para Atletas y Profesores
export const loginSchema = z.object({
  usuario: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  clave: z.string().min(1, "La contraseña es requerida"),
  rol: z.enum(["atleta", "profesor"], {
    required_error: "Debe seleccionar un rol",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Esquema de Login para Administradores
export const adminLoginSchema = z.object({
  usuario: z.string().min(1, "El usuario administrador es requerido"),
  clave: z.string().min(1, "La contraseña es requerida"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Esquema de Registro de Profesores
export const registerCoachSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  cedula: z
    .string()
    .min(5, "La cédula debe tener al menos 5 dígitos")
    .regex(/^\d+$/, "La cédula debe contener únicamente números"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida"),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    errorMap: () => ({ message: "Seleccione un género válido" }),
  }),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[+\d\s-]+$/.test(val), {
      message: "Ingrese un número de teléfono válido",
    }),
  especialidad: z.string().min(1, "La especialidad/modalidad es requerida"),
  correo: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  foto: z.string().optional(),
});

export type RegisterCoachInput = z.infer<typeof registerCoachSchema>;

// Esquema de Edición de Profesores
export const editCoachSchema = registerCoachSchema.extend({
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
});

export type EditCoachInput = z.infer<typeof editCoachSchema>;


// Esquema de Registro de Atletas
export const registerAthleteSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  cedula: z
    .string()
    .min(5, "La cédula debe tener al menos 5 dígitos")
    .regex(/^\d+$/, "La cédula debe contener únicamente números"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida"),
  genero: z.enum(["Masculino", "Femenino", "Otro"], {
    errorMap: () => ({ message: "Seleccione un género válido" }),
  }),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[+\d\s-]+$/.test(val), {
      message: "Ingrese un número de teléfono válido",
    }),
  correo: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingrese un correo electrónico válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  club: z.string().min(1, "El club es requerido"),
  discapacidad: z.string().min(1, "El tipo de discapacidad es requerido"),
  tipoClase: z.enum(["pista", "campo"], {
    errorMap: () => ({ message: "Seleccione una modalidad válida" }),
  }),
  claseDeportiva: z.string().min(1, "La clase deportiva es requerida"),
  foto: z.string().optional(),
});

export type RegisterAthleteInput = z.infer<typeof registerAthleteSchema>;

// Esquema de Edición de Atletas (Contraseña opcional)
export const editAthleteSchema = registerAthleteSchema.extend({
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional()
    .or(z.literal("")),
});

export type EditAthleteInput = z.infer<typeof editAthleteSchema>;

