import { PLANES, ORDEN } from "./data.js";

export { PLANES };

export const SECCIONES = {
  hombres: { nombre: "Hombres" },
  mujeres: { nombre: "Mujeres" },
};

export const NIVELES = {
  principiante: { nombre: "Principiante" },
  avanzado: { nombre: "Avanzado" },
};

const posicion = (seccion, p) => {
  const i = (ORDEN[seccion] || []).indexOf(p.id);
  return i === -1 ? 1000 + PLANES.indexOf(p) : i;
};

export const planesDe = (seccion, nivel) =>
  PLANES.filter((p) => p.sections.includes(seccion) && (!nivel || p.level === nivel)).sort(
    (a, b) => posicion(seccion, a) - posicion(seccion, b)
  );

export const diasTexto = (n) => (n === 1 ? "1 día" : `${n} días`);
export const planesTexto = (n) => (n === 1 ? "1 plan" : `${n} planes`);

// La entrada en calor del plan se repite al principio de cada día.
export function bloquesDelDia(plan, diaIdx) {
  const dia = plan.days[diaIdx];
  return [
    ...(plan.warmup || []).map((bl, i) => ({ key: `w${i}`, ...bl })),
    ...dia.blocks.map((bl, i) => ({ key: `b${i}`, ...bl })),
  ];
}
