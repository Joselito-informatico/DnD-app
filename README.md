# DnD 5e Suite (Monorepo Ecosystem)

Un ecosistema de herramientas modernas para Dungeons & Dragons 5e, construido con arquitectura escalable y enfoque Offline-First.

![License](https://img.shields.io/badge/License-CC--BY--4.0-blue.svg)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-yellow)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green)

## ⚔️ App del Jugador (@dnd/player-app)
Una Progressive Web App (PWA) diseñada para reemplazar la hoja de papel en la mesa de juego. Se puede instalar en iOS y Android.

# Características Principales
- Offline-First: Funciona 100% sin internet gracias a Service Workers y caché inteligente.

- Motor de Reglas SRD 5.2: * Cálculo automático de Clase de Armadura (Soporte para Monje, Bárbaro, Escudos).

-- Estadísticas derivadas (Percepción Pasiva, Iniciativa, Salvaciones).

- Gestión de Inventario Avanzada: * Control de Peso (Encumbrance) automático.

-- Conversión de monedas y cálculo de valor total.

- Compendio Híbrido: * Buscador instantáneo de Hechizos, Objetos, Reglas y Clases.

-- Fallback Inteligente: Si no encuentra el dato en local, consulta la API de Open5e automáticamente.

- Dados 3D: Lanzador de dados integrado con bandeja y modificadores.

- Persistencia: Todo se guarda automáticamente en el navegador (LocalStorage).

## 🛠 Comandos Disponibles
Desde la raíz del proyecto:

- npm run player: Inicia el servidor de desarrollo para la App de Jugador.

- npm run build:player: Compila la App de Jugador para producción (genera la PWA).

## ⚖️ Licencia y Legal
- Código Fuente: Propiedad del autor.

- Reglas de Juego (SRD 5.1/5.2): Utilizadas bajo la licencia CC-BY-4.0 de Wizards of the Coast.

- API Externa: Utiliza Open5e API para consultas remotas de respaldo.

## 🏗 Arquitectura del Proyecto

Este proyecto utiliza **NPM Workspaces** para gestionar múltiples aplicaciones y paquetes compartidos en un solo repositorio.

```text
/
├── apps/
│   └── player/       # App PWA para Jugadores (Hoja, Combate, Compendio)
│
├── packages/
│   └── dnd-core/     # Lógica de reglas SRD 5.2 pura (Cálculo CA, Stats, Dados)
│
└── package.json      # Orquestador del Monorepo