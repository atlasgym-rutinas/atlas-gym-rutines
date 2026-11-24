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

// La entrada en calor del plan se repite al principio de cada día.
export function bloquesDelDia(plan, diaIdx) {
  const dia = plan.days[diaIdx];
  return [
    ...(plan.warmup || []).map((bl, i) => ({ key: `w${i}`, ...bl })),
    ...(dia.blocks || []).map((bl, i) => ({ key: `b${i}`, ...bl })),
  ];
}
