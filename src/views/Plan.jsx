import { useLayoutEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Barra from "../components/Barra.jsx";
import Icon from "../components/Icon.jsx";
import NoEncontrada from "./NoEncontrada.jsx";
import { NIVELES, PLANES, SECCIONES, bloquesDelDia, diasTexto } from "../lib.js";

function DiasTabs({ plan, diaIdx, base }) {
  const nav = useRef(null);
  const primeraVez = useRef(true);

  useLayoutEffect(() => {
    const activa = nav.current?.querySelector('[aria-current="page"]');
    if (!activa) return;
    if (primeraVez.current) {
      // Al entrar al plan, dejar la pestaña del día a la vista sin animación.
      nav.current.scrollLeft = Math.max(0, activa.offsetLeft - nav.current.offsetLeft - 16);
      primeraVez.current = false;
    } else {
      // Cambio de día: el carrusel queda donde estaba y el foco va a la pestaña.
      activa.focus({ preventScroll: true });
      activa.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [diaIdx]);

  return (
    <nav className="dias" aria-label="Días del plan" ref={nav}>
      {plan.days.map((d, i) => (
        <Link
          key={i}
          className="dia-tab"
          to={`${base}/${i + 1}`}
          replace
          aria-current={i === diaIdx ? "page" : undefined}
        >
          <span className="dia-tab-nombre">{d.name}</span>
          <span className="dia-tab-foco">{d.focus}</span>
        </Link>
      ))}
    </nav>
  );
}

function Hoja({ plan, diaIdx }) {
  const dia = plan.days[diaIdx];
  const bloques = bloquesDelDia(plan, diaIdx);

  return (
    <article className={`hoja${diaIdx > 0 ? " empieza-medio" : ""}`} aria-labelledby="hoja-foco">
      <div className="hoja-cabeza">
        <h2 className="hoja-foco" id="hoja-foco">
          {dia.focus}
        </h2>
      </div>

      {bloques.map((bl) => (
        <section className="bloque" key={bl.key}>
          <h3 className="bloque-titulo">{bl.title}</h3>
          <ul>
            {bl.items.map((it, j) => (
              <li className="ejercicio" key={j}>
                <span className="ej-texto">
                  <span className="ej-nombre">{it.n}</span>
                  {it.d && <span className="ej-detalle">{it.d}</span>}
                </span>
                {it.p && <span className="ej-series">{it.p}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {dia.cooldown && <p className="cierre">Al terminar: {dia.cooldown}</p>}
    </article>
  );
}

function Notas({ plan }) {
  const hayNotas = plan.notes?.length > 0;
  const hayGlosario = plan.glossary?.length > 0;
  if (!hayNotas && !hayGlosario) return null;

  return (
    <div className="notas">
      {hayNotas && (
        <details className="nota">
          <summary>
            Cómo progresar <Icon name="down" />
          </summary>
          <ul className="nota-cuerpo">
            {plan.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </details>
      )}
      {hayGlosario && (
        <details className="nota">
          <summary>
            Qué significa cada sigla <Icon name="down" />
          </summary>
          <ul className="nota-cuerpo">
            {plan.glossary.map((g) => (
              <li key={g.term}>
                <span className="termino">{g.term}</span> {g.text}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default function Plan() {
  const { seccion, nivel: nivelRaw, planId, dia: diaRaw } = useParams();
  const plan = PLANES.find((p) => p.id === planId && p.sections.includes(seccion));
  const n = parseInt(diaRaw, 10);
  const diaIdx = plan && n >= 1 && n <= plan.days.length ? n - 1 : 0;

  if (!SECCIONES[seccion] || !plan) return <NoEncontrada />;

  const nivel = NIVELES[nivelRaw] ? nivelRaw : "principiante";
  const dia = plan.days[diaIdx];
  const base = `/${seccion}/${nivel}/${plan.id}`;

  return (
    <>
      <title>{`${plan.title}, ${dia.name}, Atlas Gym`}</title>
      <Barra to={`/${seccion}/${nivel}`}>{SECCIONES[seccion].nombre}</Barra>
      <h1 className="titulo" tabIndex={-1} data-foco="">
        {plan.title}
      </h1>
      <p className="bajada">
        {NIVELES[plan.level].nombre}, {diasTexto(plan.days.length)}. {plan.subtitle}.
      </p>
      <DiasTabs plan={plan} diaIdx={diaIdx} base={base} />
      <Hoja plan={plan} diaIdx={diaIdx} />
      <Notas plan={plan} />
    </>
  );
}
