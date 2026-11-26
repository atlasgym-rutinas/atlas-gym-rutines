import { useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Barra from "../components/Barra.jsx";
import Icon from "../components/Icon.jsx";
import NoEncontrada from "./NoEncontrada.jsx";
import { NIVELES, PLANES, SECCIONES, bloquesDelDia, diasTexto, fotosDe } from "../lib.js";

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

function altDeFoto(nombre, k, total) {
  if (total < 2) return nombre;
  return `${nombre}, ${k === 0 ? "posición inicial" : "posición final"}`;
}

function Ejercicio({ it, fotos, id }) {
  const [abierto, setAbierto] = useState(false);
  // Las fotos se piden recién la primera vez que se abre la fila.
  const [cargar, setCargar] = useState(false);

  const fila = (
    <>
      <span className="ej-texto">
        <span className="ej-nombre">{it.n}</span>
        {it.d && <span className="ej-detalle">{it.d}</span>}
      </span>
      {it.p && <span className="ej-series">{it.p}</span>}
    </>
  );

  if (fotos.length === 0) {
    return (
      <li>
        <div className="ejercicio">{fila}</div>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className="ejercicio con-foto"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => {
          setCargar(true);
          setAbierto((a) => !a);
        }}
      >
        {fila}
        <Icon name="down" />
      </button>
      <div className="ej-fotos" id={id} data-abierto={abierto || undefined} inert={!abierto}>
        <div className="ej-fotos-dentro">
          {cargar &&
            fotos.map((f) => (
              <figure className="ej-figura" key={f.nombre}>
                {fotos.length > 1 && <figcaption>{f.nombre}</figcaption>}
                <div className="ej-imgs" data-cantidad={f.fotos.length}>
                  {f.fotos.map((src, k) => (
                    <img key={src} src={src} alt={altDeFoto(f.nombre, k, f.fotos.length)} decoding="async" />
                  ))}
                </div>
              </figure>
            ))}
        </div>
      </div>
    </li>
  );
}

function Hoja({ plan, diaIdx }) {
  const dia = plan.days[diaIdx];
  const bloques = bloquesDelDia(plan, diaIdx).map((bl) => ({
    ...bl,
    items: bl.items.map((it) => ({ it, fotos: fotosDe(it.n) })),
  }));
  const conFotos = bloques.some((bl) => bl.items.some((x) => x.fotos.length > 0));

  return (
    <article
      className={`hoja${diaIdx > 0 ? " empieza-medio" : ""}${conFotos ? " con-fotos" : ""}`}
      aria-labelledby="hoja-foco"
    >
      <div className="hoja-cabeza">
        <h2 className="hoja-foco" id="hoja-foco">
          {dia.focus}
        </h2>
      </div>
      {conFotos && <p className="hoja-ayuda">Tocá los ejercicios con flecha para ver cómo se hacen.</p>}

      {bloques.map((bl) => (
        <section className="bloque" key={bl.key}>
          <h3 className="bloque-titulo">{bl.title}</h3>
          <ul>
            {bl.items.map(({ it, fotos }, j) => (
              <Ejercicio key={j} it={it} fotos={fotos} id={`fotos-${bl.key}-${j}`} />
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
  const plan = PLANES.find((p) => p.id === planId && p.sections?.includes(seccion));
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
      {/* key: al cambiar de día las filas abiertas se cierran */}
      <Hoja key={diaIdx} plan={plan} diaIdx={diaIdx} />
      <Notas plan={plan} />
    </>
  );
}
