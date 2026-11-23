import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Inicio from "./views/Inicio.jsx";
import Seccion from "./views/Seccion.jsx";
import Plan from "./views/Plan.jsx";
import NoEncontrada from "./views/NoEncontrada.jsx";

// Clave de "pantalla": cambiar de día dentro del mismo plan no cuenta como pantalla nueva.
const claveDe = (pathname) => {
  const [seccion, , planId] = pathname.split("/").filter(Boolean);
  if (planId) return `p:${seccion}:${planId}`;
  return pathname;
};

export default function App() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const claveAnterior = useRef(null);

  useEffect(() => {
    const clave = claveDe(pathname);
    if (clave !== claveAnterior.current) {
      window.scrollTo(0, 0);
      // En la carga inicial no movemos el foco; en cada navegación, al título de la pantalla.
      if (claveAnterior.current !== null) main.current?.querySelector("[data-foco]")?.focus({ preventScroll: true });
    }
    claveAnterior.current = clave;
  }, [pathname]);

  return (
    <main id="main" className="app" tabIndex={-1} ref={main}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/:seccion/:nivel?" element={<Seccion />} />
        <Route path="/:seccion/:nivel/:planId/:dia?" element={<Plan />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </main>
  );
}
