# ⚔️ D&D 5e Character Manager (MVP)

Una aplicación web progresiva (PWA) diseñada para jugadores de Dungeons & Dragons 5e. Enfocada en la simplicidad, velocidad y uso offline. Permite crear personajes, gestionar hojas de combate y lanzar dados sin barreras de entrada.

> **Estado del Proyecto:** MVP 1.0 (Funcional y Persistente)
> **Arquitectura:** Single Page Application (SPA) sin backend (Client-side logic).

---

## 🛠 Tech Stack

Este proyecto utiliza un stack moderno y ligero para facilitar el despliegue y mantenimiento:

* **Core:** React 18 + Vite (Velocidad de desarrollo).
* **Estilos:** Tailwind CSS v3 (Diseño "Utility-first").
* **Iconos:** Lucide React.
* **Persistencia:** `localStorage` (Navegador).
* **Lenguaje:** JavaScript (ES6+).
* **Control de Versiones:** Git + GitHub.

---

## ✨ Funcionalidades Principales

### 1. Gestión de Héroes
* **Dashboard:** Visualización rápida de todos los personajes creados.
* **Persistencia:** Los datos se guardan automáticamente en el navegador. No requiere login ni internet.
* **CRUD:** Crear, Leer, Actualizar (HP) y Borrar personajes.

### 2. Creador de Personajes (Wizard)
* **Flujo paso a paso:** Selección visual de Raza -> Clase -> Atributos.
* **Datos SRD:** Utiliza un archivo local (`src/data/srd.js`) con reglas oficiales (OGL) para Razas (Human, Elf, etc.) y Clases (Fighter, Rogue, Wizard).
* **Cálculos Automáticos:** Modificadores de atributo y HP base calculados al vuelo.
* **Auto-Equipamiento:** Asigna armas iniciales basadas en la clase elegida.

### 3. Vista de Combate (Session Mode)
* **Dashboard Táctico:** Vista clara de AC, Iniciativa, Velocidad y HP.
* **Gestión de Salud:** Barra de vida interactiva con botones rápidos de Daño/Cura y cambios de color según el estado (Verde/Amarillo/Rojo).
* **Lanzador de Dados:**
    * Al hacer click en un arma/skill, lanza un d20 + Modificadores.
    * Detecta Críticos (Nat 20) y Fallos Críticos (Nat 1).
    * Muestra el desglose matemático (Dado + Mod = Total).
* **Pestañas (Tabs):** Separación entre "Combate" (Ataques) y "Skills/Saves".
* **Reglas Inteligentes:** Detecta competencias en Salvaciones según la clase.
* **Menú de Utilidad:** Funciones para Descanso Largo (Curar todo) y Borrado.

---

## 📂 Estructura del Proyecto

Para facilitar la navegación a futuros desarrolladores:

```text
dnd-app/
├── src/
│   ├── components/       # (Pendiente de refactorización modular)
│   ├── data/
│   │   └── srd.js        # Base de datos estática (Razas, Clases, Skills)
│   ├── pages/
│   │   ├── Dashboard.jsx        # Lista de héroes (Home)
│   │   ├── CharacterCreator.jsx # Formulario de creación
│   │   └── CombatView.jsx       # Hoja de personaje jugable
│   ├── App.jsx           # Controlador principal y Estado Global (Lifted State)
│   ├── main.jsx          # Punto de entrada Vite
│   └── index.css         # Configuración Tailwind
├── public/               # Assets estáticos
├── index.html            # HTML raíz
├── package.json          # Dependencias
└── tailwind.config.js    # Configuración de diseño
