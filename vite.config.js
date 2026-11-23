import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Rutas relativas: la app funciona servida desde cualquier carpeta (por ejemplo GitHub Pages).
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["icon.svg"],
      workbox: {
        // Guarda todo en el celular para que abra sin señal.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
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
