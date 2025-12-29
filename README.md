# ⚔️ D&D 5e Character Manager

Una aplicación web progresiva (PWA) diseñada para jugadores de Dungeons & Dragons 5e. Enfocada en la simplicidad, velocidad y uso offline. Permite crear personajes, gestionar la hoja completa (combate, hechizos, inventario, rol) y lanzar dados sin barreras de entrada.

> 🚀 **Probar Demo en Vivo:** [https://dnd-app-one.vercel.app/](https://dnd-app-one.vercel.app/)

> **Estado del Proyecto:** v1.7 (International & Mobile Ready)
> **Arquitectura:** Single Page Application (SPA) sin backend (Client-side logic).

---

## 🛠 Tech Stack

Este proyecto utiliza un stack moderno y ligero para facilitar el despliegue y mantenimiento:

* **Core:** React 18 + Vite (Velocidad de desarrollo).
* **Estilos:** Tailwind CSS v3 (Diseño "Utility-first").
* **Iconos:** Lucide React.
* **Persistencia:** `localStorage` (Navegador) + Exportación JSON.
* **Estado Global:** React Context API (Para Idiomas y Notificaciones).
* **PWA:** Vite PWA Plugin (Instalable y Offline).

---

## ✨ Funcionalidades Principales

### 1. Gestión, Seguridad y Accesibilidad
* **🌍 Bilingüe:** Soporte completo Español / Inglés con cambio instantáneo.
* **📱 PWA Instalable:** Funciona como app nativa en Android/iOS y opera sin internet.
* **🍞 Notificaciones Toast:** Sistema de alertas no intrusivas para confirmaciones y tiradas críticas.
* **💾 Backup:** Importar y Exportar todos tus personajes mediante archivos JSON.

### 2. Creador de Personajes (Wizard)
* **🎲 Generador Aleatorio:** Botón "Voy a tener suerte" para crear personajes completos al instante.
* **🪄 Autocompletado:** Botón mágico para rellenar trasfondos y detalles de rol si te falta inspiración.
* **🖼️ Avatares:** Soporte para URLs de imágenes personalizadas.
* **Flujo Guiado:** Selección visual de Raza, Clase, Atributos y Detalles.

### 3. Hoja de Personaje Interactiva (5 Pestañas)

#### ⚔️ Combat (Combate)
* **Dashboard Táctico:** Vista clara de AC, Iniciativa, HP y Velocidad.
* **Estados Alterados:** Panel visual para Condiciones (Cegado, Paralizado...) y Agotamiento.
* **Recursos de Clase:** Contadores personalizados (Rage, Ki Points, Sorcery Points) que se recargan al descansar.
* **Lanzador de Dados:** Al hacer click en un arma, lanza 1d20 + Modificadores con detección de Críticos.

#### 🎲 Skills (Habilidades)
* **Competencias (Proficiency):** Sistema de "estrellas" para marcar habilidades entrenadas.
* **Percepción Pasiva:** Cálculo automático basado en Sabiduría y competencia.

#### 🔥 Spells (Magia)
* **Grimorio Interactivo:** Añadir y borrar hechizos personalizados.
* **Gestor de Slots:** Configuración manual de espacios máximos (Nivel 1-9) y seguimiento de gastos.

#### 🎒 Equip (Inventario)
* **Monedero:** Gestión de divisas (CP, SP, EP, GP, PP).
* **Mochila:** Añadir y eliminar objetos del inventario rápidamente.

#### 📜 Profile (Perfil y Rol)
* **Progresión:** Edición de Nivel, XP y Atributos Base (ASI).
* **Identidad:** Rasgos de personalidad, Ideales, Vínculos, Defectos e Historia.

#### 🗺 Roadmap (Completado)
[x] Subida de Nivel: Edición dinámica de nivel y stats.

[x] Gestor de Hechizos: Crear base de datos de spells y slots.

[x] Exportar/Importar: Guardar personajes en archivos JSON.

[x] PWA Manifest: Instalable en móviles y soporte Offline.

[x] Internacionalización: Soporte ES/EN.

[x] Recursos de Clase: Trackers para Ki, Furia, etc.

---

## 📂 Estructura del Proyecto

```text
dnd-app/
├── src/
│   ├── context/          # Lógica global (Idiomas, Toasts)
│   ├── data/
│   │   ├── srd.js        # Base de datos estática (Reglas 5e)
│   │   └── locales.js    # Diccionarios de traducción (ES/EN)
│   ├── pages/
│   │   ├── Dashboard.jsx        # Home: Lista, Randomizer, Import/Export
│   │   ├── CharacterCreator.jsx # Wizard de creación
│   │   └── CombatView.jsx       # Hoja de personaje completa
│   ├── utils/            # Funciones de aleatoriedad
│   ├── App.jsx           # Enrutador principal
│   └── main.jsx          # Punto de entrada (Providers)
├── public/               # Iconos PWA y assets
└── vite.config.js        # Configuración PWA