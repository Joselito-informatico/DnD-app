import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Se actualiza sola al abrir
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "DnD 5e Player", // Nombre completo
        short_name: "DnD Player", // Nombre bajo el icono
        description: "Hoja de personaje y compendio SRD 5.2 Offline",
        theme_color: "#1c1917", // Coincide con bg-neutral-900
        background_color: "#1c1917",
        display: "standalone", // Se abre sin barra de navegador
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Para iconos adaptativos en Android
          },
        ],
      },
      workbox: {
        // Estrategia de Caché: Guardar todo lo generado y los datos estáticos
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        runtimeCaching: [
          {
            // Cachear fuentes de Google si las usas
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 días
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cachear la API de Open5e para búsquedas recurrentes
            urlPattern: /^https:\/\/api\.open5e\.com\/.*/i,
            handler: "StaleWhileRevalidate", // Usa caché vieja mientras busca nueva
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
