import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { SECCIONES, planesDe, planesTexto } from "../lib.js";

export default function Inicio() {
  return (
    <section className="portada">
      <title>Atlas Gym Rutinas</title>
      <h1 className="marca" tabIndex={-1} data-foco="">
        Atlas
      </h1>
      <p className="marca-sub">Gym &amp; Fitness. Tus rutinas, día por día.</p>
      <nav className="secciones" aria-label="Secciones">
        {Object.entries(SECCIONES).map(([id, s]) => (
          <Link key={id} className="seccion-link" to={`/${id}/principiante`}>
            <span className="seccion-nombre">{s.nombre}</span>
            <span className="seccion-cuenta">
              {planesTexto(planesDe(id).length)} <Icon name="chevron" />
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
