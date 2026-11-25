import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// En local, Vite responde /admin y /admin/ con la app (index.html raíz).
// Esto los manda al panel, igual que hace GitHub Pages.
const abrirAdmin = (req, res, next) => {
  const [ruta, query] = req.url.split("?");
  // Sin barra final, Decap buscaría config.yml en la raíz: redirigir como GitHub Pages.
  if (/\/admin$/.test(ruta)) {
    res.statusCode = 301;
    res.setHeader("Location", `${ruta}/${query ? `?${query}` : ""}`);
    return res.end();
  }
  if (/\/admin\/$/.test(ruta)) req.url = `${ruta}index.html${query ? `?${query}` : ""}`;
  next();
};
const panelAdmin = {
  name: "panel-admin",
  // Llaves sin return: si el hook devuelve una función, Vite la toma como "post hook".
  configureServer(server) {
    server.middlewares.use(abrirAdmin);
  },
  configurePreviewServer(server) {
    server.middlewares.use(abrirAdmin);
  },
};

export default defineConfig({
  // Rutas relativas: la app funciona servida desde cualquier carpeta (por ejemplo GitHub Pages).
  base: "./",
  plugins: [
    panelAdmin,
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // El registro lo hace src/main.jsx para recargar apenas hay una versión nueva.
      injectRegister: false,
      includeAssets: ["icon.svg"],
      workbox: {
        // Guarda todo en el celular para que abra sin señal.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        // El panel /admin no se guarda sin conexión ni lo atiende la app.
        globIgnores: ["admin/**"],
        // Con y sin barra final: si no, "/admin" lo responde el service worker con la home
        // y nunca llega a GitHub Pages, que es quien redirige a "/admin/".
        navigateFallbackDenylist: [/\/admin(\/|$)/],
      },
      manifest: {
        name: "Atlas Gym Rutinas",
        short_name: "Atlas Rutinas",
        lang: "es",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#22201f",
        theme_color: "#22201f",
        icons: [{ src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
    }),
  ],
});
