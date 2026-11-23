import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./styles.css";

// Modo sin conexión con actualización automática: cuando se publica una versión nueva,
// la app la descarga y se recarga sola. También busca cambios cada vez que se vuelve
// a la app desde segundo plano (en iPhone la app instalada casi nunca se cierra del todo).
registerSW({
  immediate: true,
  onRegisteredSW(_url, registro) {
    if (!registro) return;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine) registro.update();
    });
  },
});

// HashRouter: las rutas viven después del # y funcionan en hosting estático sin configuración.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
