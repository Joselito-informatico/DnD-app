import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'D&D 5e Manager', // Nombre largo (en la tienda/splash)
        short_name: 'D&D Mgr',  // Nombre corto (debajo del icono)
        description: 'Gestor de personajes offline para D&D 5e',
        theme_color: '#1c1917', // Color de la barra de sistema (coincide con bg-stone-900)
        background_color: '#1c1917', // Color de fondo al abrir
        display: 'standalone', // ¡ESTO QUITA LA BARRA DE NAVEGACIÓN!
        orientation: 'portrait', // Bloquea la rotación (opcional, mejor para móviles)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})