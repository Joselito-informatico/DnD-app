# ⚔️ D&D 5e Character Manager

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow?logo=vite) ![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-green)

Una aplicación web progresiva (PWA) diseñada para jugadores de **Dungeons & Dragons 5e**. Enfocada en la simplicidad, velocidad y uso **offline-first**. Permite crear personajes, gestionar la hoja completa (combate, hechizos, inventario, rol) y lanzar dados con físicas matemáticas reales sin barreras de entrada.

> 🚀 **Probar Demo en Vivo:** [https://dnd-app-one.vercel.app/](https://dnd-app-one.vercel.app/)

---

## ✨ Funcionalidades Principales

### 1. Gestión y Tecnología
* **🌍 Bilingüe:** Soporte completo Español / Inglés con cambio instantáneo.
* **📱 PWA Instalable:** Funciona como app nativa en Android/iOS, pantalla completa y opera 100% sin internet.
* **☁️ API Open5e:** Integración para buscar hechizos y objetos oficiales del SRD automáticamente.
* **💾 Persistencia Local:** Tus datos viven en tu dispositivo. Opción de **Exportar/Importar JSON** para backups.

### 2. Creador de Personajes (Wizard)
* **🎲 Rolled Stats:** Sistema interactivo de tirada de atributos (5d6, descartar los 2 peores) con asignación táctil.
* **🪄 Quick Build:** Generador aleatorio para crear NPCs o personajes al instante.
* **📚 SRD Integrado:** Carga automática de rasgos de clase, equipo inicial y espacios de conjuro según las reglas oficiales.

### 3. Hoja de Personaje Interactiva

#### ⚔️ Combat (Combate Avanzado)
* **🛡️ AC Dinámica:** Cálculo automático de Clase de Armadura basado en el equipo actual (Armadura Ligera/Media/Pesada + Escudos).
* **🎲 Motor de Dados:**
    * Tiradas de Ataque y Daño con un clic.
    * **Toggle Ventaja/Desventaja:** Tira dos d20 y selecciona el correcto automáticamente.
    * **Críticos:** Detección de "Natural 20" y duplicación automática de dados de daño.
* **🏥 Salud y Descanso:**
    * Barra visual de HP interactiva.
    * **Descanso Corto:** Interfaz para gastar Dados de Golpe y recuperar vida.
    * **Descanso Largo:** Restaura espacios de conjuro y recursos automáticamente.

#### 🔥 Spells (Magia)
* **Buscador API:** Encuentra y añade hechizos del SRD con sus descripciones completas.
* **Gestor de Slots:** Rastreo visual de espacios de conjuro gastados y disponibles.

#### 🎒 Equip (Inventario)
* **Equipamiento Inteligente:** Botón *Switch* para equipar/desequipar armaduras y armas, afectando las estadísticas en tiempo real.
* **Buscador de Objetos:** Base de datos completa de armas y equipo de aventuras.

#### 📜 Profile (Progresión)
* **Barra de XP:** Visualización del progreso hacia el siguiente nivel.
* **Auto-Level Up:** Detección automática de subida de nivel al modificar la experiencia.

#### 🛠️ Herramientas Extra
* **Bandeja de Dados Flotante:** Un botón siempre visible para lanzar d4, d6, d8, d10, d12 o d20 en cualquier momento.
* **Compendio:** Consulta rápida de reglas (Razas, Clases, Condiciones y Acciones de Combate).

---

## 🛠 Tech Stack

Este proyecto utiliza un stack moderno y ligero para facilitar el despliegue y mantenimiento:

* **Core:** React 18 + Vite.
* **Estilos:** Tailwind CSS v3 (Diseño "Utility-first").
* **Iconos:** Lucide React.
* **Datos:** Open5e API (para contenido) + SRD 5.1 local (para reglas).
* **PWA:** Vite PWA Plugin (Manifiesto y Service Workers).

---

## 📂 Estructura del Proyecto

```text
dnd-app/
├── public/               # Assets estáticos e iconos PWA
├── src/
│   ├── components/       # Componentes UI reutilizables (BottomNav, etc.)
│   ├── context/          # Estado global (LanguageContext, ToastContext)
│   ├── data/
│   │   ├── srd.js        # Reglas estáticas (Razas, Clases, XP Table)
│   │   └── locales.js    # Diccionarios de traducción (ES/EN)
│   ├── pages/
│   │   ├── Dashboard.jsx        # Selección de personaje
│   │   ├── CharacterCreator.jsx # Wizard de creación paso a paso
│   │   ├── CombatView.jsx       # Hoja principal (Lógica pesada)
│   │   ├── DicePage.jsx         # Lanzador de dados independiente
│   │   └── Compendium.jsx       # Lector de reglas SRD
│   ├── utils/
│   │   ├── dice.js       # Motor matemático de dados (parsers de daño)
│   │   ├── rules.js      # Reglas de D&D (Cálculo de AC)
│   │   ├── dndApi.js     # Conexión con Open5e
│   │   └── randomizer.js # Generador aleatorio
│   ├── App.jsx           # Enrutador y Layout principal
│   └── main.jsx          # Punto de entrada
└── vite.config.js        # Configuración de Vite y PWA