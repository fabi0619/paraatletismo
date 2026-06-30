export const TIPOS_DOCUMENTO = [
  "Registro Civil",
  "Tarjeta de Identidad",
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Pasaporte"
];

export const GRUPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const GRUPOS_ETNICOS = [
  "No pertenece a ninguno",
  "Indígena",
  "Afrocolombiano",
  "Raizal",
  "Palenquero",
  "Rrom (Gitano)"
];

export const NIVELES_EDUCATIVOS = [
  "Primaria Incompleta",
  "Primaria Completa",
  "Secundaria Incompleta",
  "Secundaria Completa (Bachiller)",
  "Técnico",
  "Tecnólogo",
  "Pregrado (Universitario)",
  "Postgrado / Especialización",
  "Maestría",
  "Doctorado"
];

export const EPS_COLOMBIA = [
  "Aliansalud",
  "Asmet Salud",
  "Cajacopi EPS",
  "Capital Salud",
  "Capresoca",
  "Comfenalco Valle",
  "Compensar EPS",
  "Coosalud",
  "Emssanar EPS",
  "EPS Sanitas",
  "EPS Sura",
  "EPS Famisanar",
  "EPS Servicio Occidental de Salud (SOS)",
  "Mutual Ser",
  "Nueva EPS",
  "Salud Total EPS",
  "Savia Salud EPS",
  "Sanidad Policía Nacional",
  "Sanidad Militar",
  "Otra"
];

export const LIGAS = [
  "LIVALPARAATLETISMO - Visuales, PC, Físicos y Guías",
  "LIVADISMEN - Intelectual",
  "LIVADESOR - Sordos"
];

export const PAISES = ["Colombia", "Venezuela", "Ecuador", "Perú", "Brasil", "Argentina", "Chile", "México", "Estados Unidos", "España", "Otro"];

export const DEPARTAMENTOS_COLOMBIA = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada", "Bogotá D.C."
];

export const MUNICIPIOS_VALLE = [
  "Cali", "Buenaventura", "Palmira", "Tuluá", "Yumbo", "Cartago", "Jamundí", "Buga", "Dagua", "Zarzal", "Roldanillo", "Sevilla", "Florida", "Pradera", "El Cerrito", "Candelaria"
];

export const CLUBS = [
  "Club Deportivo Imparables a la Meta",
  "Club Deportivo Minas del Paraatletismo",
  "Club Deportivo Discatle",
  "Club Deportivo de Paraatletismo PC Yumbo",
  "Club Deportivo Casin",
];

// Modalidades
export const MODALIDADES = ["Pista", "Campo", "Pista y Campo"];

// Clases Deportivas (Pista)
export const CLASES_PISTA = [
  "T11", "T12", "T13", "T20", 
  "T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38",
  "T40", "T41", "T42", "T43", "T44", "T45", "T46", "T47",
  "T51", "T52", "T53", "T54",
  "T61", "T62", "T63", "T64",
  "T71", "T72"
];

// Clases Deportivas (Campo)
export const CLASES_CAMPO = [
  "F11", "F12", "F13", "F20", 
  "F31", "F32", "F33", "F34", "F35", "F36", "F37", "F38",
  "F40", "F41", "F42", "F43", "F44", "F45", "F46",
  "F51", "F52", "F53", "F54", "F55", "F56", "F57",
  "F61", "F62", "F63", "F64"
];

// Pruebas (Pista)
export const PRUEBAS_PISTA = [
  "100m", "200m", "400m", "800m", "1500m", "5000m", "10000m", "Relevos"
];

// Pruebas (Campo)
export const PRUEBAS_CAMPO = [
  "Lanzamiento de Bala", 
  "Lanzamiento de Jabalina", 
  "Lanzamiento de Disco", 
  "Lanzamiento de Clava",
  "Salto de Longitud", 
  "Salto de Altura"
];

// Tallas Calzado US
export const TALLAS_US = Array.from({ length: 31 }, (_, i) => 5 + i * 0.5).map(s => String(s)); // 5.0 to 20.0

// Tallas Ropa
export const TALLAS_ROPA = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
