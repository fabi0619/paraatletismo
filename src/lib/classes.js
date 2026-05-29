// Catálogo de Clasificaciones de Paraatletismo (Dividido en Pista (T) y Campo (F))

export const DISCAPACIDADES = {
  fisica: {
    id: "fisica",
    nombre: "Discapacidad Física",
    descripcion: "Atletas con limitaciones motoras, amputaciones, talla baja, parálisis cerebral o lesiones medulares."
  },
  visual: {
    id: "visual",
    nombre: "Discapacidad Visual",
    descripcion: "Atletas con pérdida de visión parcial o total (Categorías 11-13)."
  },
  intelectual: {
    id: "intelectual",
    nombre: "Discapacidad Intelectual",
    descripcion: "Atletas con limitaciones significativas en el funcionamiento intelectual y conducta adaptativa (Categoría 20)."
  },
  auditiva: {
    id: "auditiva",
    nombre: "Discapacidad Auditiva",
    descripcion: "Atletas con pérdida auditiva de diversa intensidad (Categoría 15)."
  }
};

export const CLASES_DEPORTIVAS = [
  // ==================== DISCAPACIDAD VISUAL ====================
  // Pista (T)
  { clase: "T11", tipo: "pista", discapacidad: "visual", descripcion: "Ceguera casi total o total. Compiten con antifaz obligatorio y guía en pista." },
  { clase: "T12", tipo: "pista", discapacidad: "visual", descripcion: "Discapacidad visual grave. Capacidad para reconocer un objeto hasta a 2 metros. Opción de correr con guía." },
  { clase: "T13", tipo: "pista", discapacidad: "visual", descripcion: "Discapacidad visual leve. Capacidad de reconocer objetos entre 2 y 6 metros. Compiten sin guía." },
  // Campo (F)
  { clase: "F11", tipo: "campo", discapacidad: "visual", descripcion: "Ceguera casi total o total. Pruebas de campo (saltos y lanzamientos) con llamador." },
  { clase: "F12", tipo: "campo", discapacidad: "visual", descripcion: "Discapacidad visual grave. Competiciones de campo con asistencia visual y llamador." },
  { clase: "F13", tipo: "campo", discapacidad: "visual", descripcion: "Discapacidad visual leve. Compiten en campo de forma autónoma con apoyo visual estándar." },
  
  // ==================== DISCAPACIDAD INTELECTUAL ====================
  { clase: "T20", tipo: "pista", discapacidad: "intelectual", descripcion: "Limitaciones en el funcionamiento intelectual y en habilidades adaptativas. Pruebas de pista." },
  { clase: "F20", tipo: "campo", discapacidad: "intelectual", descripcion: "Limitaciones en el funcionamiento intelectual y en habilidades adaptativas. Pruebas de campo (Lanzamiento de bala, salto largo)." },
  
  // ==================== PARÁLISIS CEREBRAL / COORDINACIÓN ====================
  // Pista (T)
  { clase: "T32", tipo: "pista", discapacidad: "fisica", descripcion: "Parálisis cerebral grave. Compite en silla de ruedas, empuje con pies o fuerza muy reducida en brazos." },
  { clase: "T33", tipo: "pista", discapacidad: "fisica", descripcion: "Fuerza de empuje moderada-limitada en silla. Afectación de tronco y tres extremidades." },
  { clase: "T34", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación moderada-leve. Buen control de tronco en silla de ruedas. Carreras de velocidad y fondo." },
  { clase: "T35", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación de coordinación moderada en piernas. Compiten de pie en velocidad." },
  { clase: "T36", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación en las cuatro extremidades de pie. Movimientos incontrolados (atetosis/ataxia) al correr." },
  { clase: "T37", tipo: "pista", discapacidad: "fisica", descripcion: "Hemiplejia (afectación de un lado del cuerpo). Compiten de pie en carreras." },
  { clase: "T38", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación mínima o leve de coordinación. Compiten de pie en carreras." },
  // Campo (F)
  { clase: "F32", tipo: "campo", discapacidad: "fisica", descripcion: "Afectación en las cuatro extremidades. Lanzamiento sentado. Uso de jabalina, bala y maza." },
  { clase: "F33", tipo: "campo", discapacidad: "fisica", descripcion: "Lanzamiento sentado. Afectación moderada de tronco y tres extremidades." },
  { clase: "F34", tipo: "campo", discapacidad: "fisica", descripcion: "Lanzamiento sentado. Buen control de tronco, afectación leve-moderada. Fuerza asimétrica en brazos." },
  { clase: "F35", tipo: "campo", discapacidad: "fisica", descripcion: "Coordinación moderada en piernas. Lanzamiento de pie (disco, bala, jabalina)." },
  { clase: "F36", tipo: "campo", discapacidad: "fisica", descripcion: "Movimientos incontrolados de pie. Afecta el equilibrio en giros de lanzamiento." },
  { clase: "F37", tipo: "campo", discapacidad: "fisica", descripcion: "Hemiplejia. Lanzamientos y saltos de pie con soporte asimétrico del cuerpo." },
  { clase: "F38", tipo: "campo", discapacidad: "fisica", descripcion: "Afectación mínima de coordinación de pie. Lanzamiento y saltos con balance casi normal." },
  
  // ==================== ESTATURA BAJA ====================
  { clase: "T40", tipo: "pista", discapacidad: "fisica", descripcion: "Estatura baja con proporciones corporales específicas (velocidad y saltos de pie)." },
  { clase: "T41", tipo: "pista", discapacidad: "fisica", descripcion: "Estatura baja de grado menor (velocidad y saltos de pie)." },
  { clase: "F40", tipo: "campo", discapacidad: "fisica", descripcion: "Estatura baja. Lanzamiento de disco, jabalina y bala sentado o de pie." },
  { clase: "F41", tipo: "campo", discapacidad: "fisica", descripcion: "Estatura baja de grado menor. Lanzamientos de disco, jabalina y bala de pie." },
  
  // ==================== DEFICIENCIAS EXTREMIDADES (MIEMBRO SUPERIOR / SIN PRÓTESIS) ====================
  // Pista (T)
  { clase: "T42", tipo: "pista", discapacidad: "fisica", descripcion: "Deficiencia en una o ambas extremidades inferiores sin prótesis (o afectación severa de rodilla)." },
  { clase: "T43", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación bilateral en extremidades inferiores (compiten de pie sin prótesis)." },
  { clase: "T44", tipo: "pista", discapacidad: "fisica", descripcion: "Afectación unilateral por debajo de la rodilla o rango de tobillo muy limitado." },
  { clase: "T45", tipo: "pista", discapacidad: "fisica", descripcion: "Deficiencia doble en miembros superiores (amputación bilateral de brazos)." },
  { clase: "T46", tipo: "pista", discapacidad: "fisica", descripcion: "Deficiencia en un miembro superior (amputación unilateral de brazo o rango de hombro)." },
  { clase: "T47", tipo: "pista", discapacidad: "fisica", descripcion: "Deficiencia unilateral leve en miembro superior (asimilable a muñeca/mano)." },
  // Campo (F)
  { clase: "F42", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia en extremidades inferiores sin prótesis. Saltos o lanzamientos de pie." },
  { clase: "F43", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia bilateral inferior de pie. Saltos o lanzamientos." },
  { clase: "F44", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia unilateral de tobillo/pantorrilla. Pruebas de campo." },
  { clase: "F45", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia doble en miembros superiores. Lanzamientos de pie." },
  { clase: "F46", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia en un miembro superior. Lanzamientos y saltos de pie." },
  { clase: "F47", tipo: "campo", discapacidad: "fisica", descripcion: "Deficiencia unilateral leve en miembro superior. Lanzamientos y saltos." },
  
  // ==================== SILLA DE RUEDAS / LANZAMIENTOS SENTADOS ====================
  // Pista (T)
  { clase: "T51", tipo: "pista", discapacidad: "fisica", descripcion: "Lesión cervical grave. Fuerza muy limitada en hombros y codos. Carreras en silla." },
  { clase: "T52", tipo: "pista", discapacidad: "fisica", descripcion: "Fuerza normal de hombros y codos, limitación severa en manos. Carreras en silla." },
  { clase: "T53", tipo: "pista", discapacidad: "fisica", descripcion: "Fuerza normal en brazos, sin fuerza abdominal ni control de tronco. Carreras en silla." },
  { clase: "T54", tipo: "pista", discapacidad: "fisica", descripcion: "Fuerza de tronco normal a parcial. Carreras en silla de ruedas en pista y ruta." },
  // Campo (F)
  { clase: "F51", tipo: "campo", discapacidad: "fisica", descripcion: "Lesión cervical grave. Lanzamiento sentado de maza y disco con fuerza limitada de codo/hombro." },
  { clase: "F52", tipo: "campo", discapacidad: "fisica", descripcion: "Fuerza normal de brazos, sin manos. Lanzamiento sentado de disco y bala." },
  { clase: "F53", tipo: "campo", discapacidad: "fisica", descripcion: "Fuerza normal de brazos, sin tronco. Lanzamiento de bala, disco y jabalina sentado." },
  { clase: "F54", tipo: "campo", discapacidad: "fisica", descripcion: "Tronco parcial a normal. Lanzamientos sentados con soporte abdominal básico." },
  { clase: "F55", tipo: "campo", discapacidad: "fisica", descripcion: "Lanzamiento sentado. Fuerza normal en brazos y tronco parcial. Sin función de piernas." },
  { clase: "F56", tipo: "campo", discapacidad: "fisica", descripcion: "Lanzamiento sentado. Fuerza de tronco normal, extensión parcial de caderas." },
  { clase: "F57", tipo: "campo", discapacidad: "fisica", descripcion: "Lanzamiento sentado. Afectación asimétrica o leve en piernas. Excelente control de tronco." },
  
  // ==================== PRÓTESIS (MIEMBRO INFERIOR DE PIE) ====================
  // Pista (T)
  { clase: "T61", tipo: "pista", discapacidad: "fisica", descripcion: "Amputación bilateral sobre la rodilla. Compiten en pista con prótesis dobles." },
  { clase: "T62", tipo: "pista", discapacidad: "fisica", descripcion: "Amputación bilateral bajo la rodilla. Compiten con prótesis dobles en pista." },
  { clase: "T63", tipo: "pista", discapacidad: "fisica", descripcion: "Amputación unilateral sobre la rodilla. Compiten en pista con prótesis simple." },
  { clase: "T64", tipo: "pista", discapacidad: "fisica", descripcion: "Amputación unilateral bajo la rodilla. Compiten con prótesis simple en pista." },
  // Campo (F)
  { clase: "F61", tipo: "campo", discapacidad: "fisica", descripcion: "Amputación sobre la rodilla bilateral. Lanzamientos y saltos con prótesis." },
  { clase: "F62", tipo: "campo", discapacidad: "fisica", descripcion: "Amputación bilateral bajo la rodilla. Lanzamientos y saltos de pie con prótesis." },
  { clase: "F63", tipo: "campo", discapacidad: "fisica", descripcion: "Amputación unilateral sobre la rodilla. Saltos y lanzamientos con prótesis." },
  { clase: "F64", tipo: "campo", discapacidad: "fisica", descripcion: "Amputación unilateral bajo la rodilla. Saltos y lanzamientos con prótesis." },
  
  // ==================== DISCAPACIDAD AUDITIVA ====================
  { clase: "T15", tipo: "pista", discapacidad: "auditiva", descripcion: "Atletas con pérdida auditiva superior a 55 dB. Pruebas de pista." },
  { clase: "F15", tipo: "campo", discapacidad: "auditiva", descripcion: "Atletas con pérdida auditiva superior a 55 dB. Pruebas de campo." }
];
