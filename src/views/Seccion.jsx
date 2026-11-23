import { Link, useParams } from "react-router-dom";
import Barra from "../components/Barra.jsx";
import Icon from "../components/Icon.jsx";
import NoEncontrada from "./NoEncontrada.jsx";
import { NIVELES, SECCIONES, diasTexto, planesDe } from "../lib.js";

export default function Seccion() {
  const { seccion, nivel: nivelRaw } = useParams();
  const s = SECCIONES[seccion];
  if (!s) return <NoEncontrada />;
  const nivel = NIVELES[nivelRaw] ? nivelRaw : "principiante";
  const nombreNivel = NIVELES[nivel].nombre.toLowerCase();

  return (
    <>
      <title>{`${s.nombre} ${nombreNivel}, Atlas Gym`}</title>
      <Barra to="/">Inicio</Barra>
      <h1 className="titulo" tabIndex={-1} data-foco="">
        {s.nombre}
      </h1>
      <nav className="niveles" aria-label="Nivel">
        {Object.entries(NIVELES).map(([id, n]) => (
          <Link
            key={id}
            className="nivel"
            to={`/${seccion}/${id}`}
            replace
            aria-current={id === nivel ? "page" : undefined}
          >
            {n.nombre} <span className="nivel-cuenta">{planesDe(seccion, id).length}</span>
          </Link>
        ))}
      </nav>
      <ul className="planes" aria-label={`Planes ${nombreNivel}`}>
        {planesDe(seccion, nivel).map((p) => (
          <li key={p.id}>
            <Link className="plan-link" to={`/${seccion}/${nivel}/${p.id}/1`}>
              <span className="plan-texto">
                <span className="plan-titulo">{p.title}</span>
                <span className="plan-sub">{p.subtitle}</span>
              </span>
              <span className="plan-dias">
                {diasTexto(p.days.length)} <Icon name="chevron" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
