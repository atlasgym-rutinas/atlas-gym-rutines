// Cada plan es un archivo en content/planes/<id>.json, editable desde /admin.
// El nombre del archivo es el id del plan y forma parte de la dirección.
const archivos = import.meta.glob("../content/planes/*.json", { eager: true, import: "default" });

export const PLANES = Object.entries(archivos)
  .map(([ruta, plan]) => ({ ...plan, id: ruta.split("/").pop().replace(/\.json$/, "") }))
  .filter((p) => p.days?.length > 0);

export const SECCIONES = {
  hombres: { nombre: "Hombres" },
  mujeres: { nombre: "Mujeres" },
};

export const NIVELES = {
  principiante: { nombre: "Principiante" },
  avanzado: { nombre: "Avanzado" },
};

export const planesDe = (seccion, nivel) =>
  PLANES.filter((p) => p.sections?.includes(seccion) && (!nivel || p.level === nivel)).sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title, "es")
  );

export const diasTexto = (n) => (n === 1 ? "1 día" : `${n} días`);
export const planesTexto = (n) => (n === 1 ? "1 plan" : `${n} planes`);

// Catálogo de ejercicios: content/ejercicios/<id>.json, también editable desde /admin.
// Cada ejercicio tiene fotos y "otros nombres", porque los planes escriben el mismo
// ejercicio de varias formas ("Cortitos", "Crunch (cortitos)", "Abdominales cortos").
const archivosEj = import.meta.glob("../content/ejercicios/*.json", { eager: true, import: "default" });

const normalizar = (s) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();

// Decap guarda "/uploads/..." (raíz del sitio); la app vive en una subcarpeta de GitHub Pages.
const rutaFoto = (src) => `${import.meta.env.BASE_URL}${src.replace(/^\/+/, "")}`;

const CATALOGO = new Map();
for (const ej of Object.values(archivosEj)) {
  const fotos = (ej.images || []).filter(Boolean).map(rutaFoto);
  if (!ej.title || fotos.length === 0) continue;
  const entrada = { nombre: ej.title, fotos };
  for (const nombre of [ej.title, ...(ej.aliases || [])]) {
    if (nombre) CATALOGO.set(normalizar(nombre), entrada);
  }
}

function buscarUno(nombre) {
  const n = normalizar(nombre);
  return (
    CATALOGO.get(n) ||
    // "Superman (espinales)" -> "superman"
    CATALOGO.get(normalizar(n.replace(/\([^)]*\)/g, " "))) ||
    // restos de un paréntesis partido por una superserie: "crunch)"
    CATALOGO.get(normalizar(n.replace(/[()]/g, " ")))
  );
}

const conMayuscula = (s) => s.charAt(0).toLocaleUpperCase("es") + s.slice(1);

// Fotos de un ejercicio del plan. Las superseries ("Press plano + aperturas")
// devuelven una entrada por cada ejercicio que tenga fotos. El nombre es el que
// escribe el plan, para que coincida con lo que se lee en la fila.
export function fotosDe(nombre) {
  if (!nombre || CATALOGO.size === 0) return [];
  const entero = buscarUno(nombre);
  if (entero) return [{ nombre, fotos: entero.fotos }];
  const partes = nombre.split(/\s+\+\s+/);
  if (partes.length < 2) return [];
  const vistas = new Set();
  return partes.flatMap((parte) => {
    const e = buscarUno(parte);
    if (!e || vistas.has(e)) return [];
    vistas.add(e);
    return [{ nombre: conMayuscula(parte.trim()), fotos: e.fotos }];
  });
}

// La entrada en calor del plan se repite al principio de cada día.
export function bloquesDelDia(plan, diaIdx) {
  const dia = plan.days[diaIdx];
  return [
    ...(plan.warmup || []).map((bl, i) => ({ key: `w${i}`, ...bl })),
    ...(dia.blocks || []).map((bl, i) => ({ key: `b${i}`, ...bl })),
  ];
}
