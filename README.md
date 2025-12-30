# ⚔️ D&D 5e Character Manager

![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow?logo=vite) ![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-green)

Una aplicación web progresiva (PWA) diseñada para jugadores de **Dungeons & Dragons 5e**. Enfocada en la simplicidad, velocidad y arquitectura **offline-first**. Permite crear personajes, gestionar la hoja completa (combate, hechizos, inventario, rol) y lanzar dados con precisión matemática sin barreras de entrada.

> 🚀 **Probar Demo en Vivo:** [https://dnd-app-one.vercel.app/](https://dnd-app-one.vercel.app/)

---

## ✨ Funcionalidades Principales

### 1. Gestión y Tecnología
* **🌍 Bilingüe:** Soporte completo Español / Inglés con cambio instantáneo (Context API).
* **📱 PWA Instalable:** Funciona como app nativa en Android/iOS, pantalla completa y opera 100% sin internet gracias a Vite PWA.
* **☁️ API Open5e:** Integración para buscar hechizos y objetos oficiales del SRD automáticamente.
* **💾 Persistencia Local:** Sin bases de datos complejas. Tus datos viven en `localStorage` de tu dispositivo. Opción de **Exportar/Importar JSON** para copias de seguridad.

### 2. Creador de Personajes (Wizard)
* **🎲 Rolled Stats:** Sistema interactivo de tirada de atributos (5d6, descartar los 2 peores) con asignación táctil.
* **🪄 Quick Build:** Generador aleatorio optimizado (carga diferida) para crear NPCs o personajes al instante.
* **📚 SRD Integrado:** Carga automática de rasgos de clase, equipo inicial y espacios de conjuro según las reglas oficiales 5.1.

### 3. Hoja de Personaje Interactiva

#### ⚔️ Combat (Combate Avanzado)
* **🛡️ AC Dinámica:** Cálculo automático de Clase de Armadura basado en el equipo actual (Armadura Ligera/Media/Pesada + Escudos) y modificadores de Destreza.
* **🎲 Motor de Dados:**
    * Tiradas de Ataque y Daño con un clic.
    * **Toggle Ventaja/Desventaja:** Tira dos d20 y selecciona el resultado correcto automáticamente.
    * **Críticos:** Detección de "Natural 20" y duplicación automática de dados de daño.
* **🏥 Salud y Descanso:**
    * Barra visual de HP interactiva.
    * **Descanso Corto:** Interfaz para gastar Dados de Golpe y recuperar vida.
    * **Descanso Largo:** Restaura espacios de conjuro y recursos automáticamente.

#### 🔥 Spells (Magia)
* **Buscador API:** Encuentra y añade hechizos del SRD con sus descripciones completas.
* **Gestor de Slots:** Rastreo visual de espacios de conjuro gastados y disponibles por nivel.

#### 🎒 Equip (Inventario)
* **Equipamiento Inteligente:** Botón *Switch* para equipar/desequipar armaduras y armas, afectando las estadísticas en tiempo real.
* **Buscador de Objetos:** Base de datos completa de armas y equipo de aventuras.

---

## 🛠 Tech Stack

Este proyecto utiliza un stack moderno y ligero para facilitar el despliegue y mantenimiento, evitando el "over-engineering":

* **Core:** React 19 + Vite.
* **Estilos:** Tailwind CSS v3 (Diseño "Utility-first").
* **Iconos:** Lucide React.
* **Estado:** React Hooks (`useState`, `useContext`) + LocalStorage.
* **Navegación:** State-based Routing (SPA ligera sin recargas).
* **PWA:** Vite PWA Plugin (Manifiesto, Service Workers y Cache Strategy).

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu máquina:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/joselito-informatico/dnd-app.git](https://github.com/joselito-informatico/dnd-app.git)
   cd dnd-app

---

## 📂 Estructura del Proyecto

```dnd-app/
├── public/               # Assets estáticos e iconos PWA
├── src/
│   ├── components/       # Componentes UI reutilizables (BottomNav, etc.)
│   ├── context/          # Estado global (LanguageContext, ToastContext)
│   ├── data/
│   │   ├── srd.js        # Reglas estáticas (Razas, Clases, XP Table)
│   │   └── locales.js    # Diccionarios de traducción (ES/EN)
│   ├── pages/
│   │   ├── Dashboard.jsx        # Selección de personaje y Home
│   │   ├── CharacterCreator.jsx # Wizard de creación paso a paso
│   │   ├── CombatView.jsx       # Hoja principal (Lógica de combate)
│   │   ├── DicePage.jsx         # Lanzador de dados independiente
│   │   └── Compendium.jsx       # Lector de reglas SRD
│   ├── utils/
│   │   ├── dice.js       # Motor matemático de dados (parsers de daño)
│   │   ├── rules.js      # Lógica de negocio D&D (Cálculo de AC, Modificadores)
│   │   ├── dndApi.js     # Cliente para Open5e API
│   │   └── randomizer.js # Generador aleatorio (Lazy loaded)
│   ├── App.jsx           # Enrutador manual y Layout principal
│   └── main.jsx          # Punto de entrada
└── vite.config.js        # Configuración de Vite y PWA