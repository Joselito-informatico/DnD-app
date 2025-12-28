# ⚔️ D&D 5e Character Manager

Una aplicación web progresiva (PWA) diseñada para jugadores de Dungeons & Dragons 5e. Enfocada en la simplicidad, velocidad y uso offline. Permite crear personajes, gestionar la hoja completa (combate, hechizos, inventario, rol) y lanzar dados sin barreras de entrada.

> 🚀 **Probar Demo en Vivo:** [https://dnd-app-one.vercel.app/](https://dnd-app-one.vercel.app/)

> **Estado del Proyecto:** v1.5 (Feature Complete)
> **Arquitectura:** Single Page Application (SPA) sin backend (Client-side logic).

---

## 🛠 Tech Stack

Este proyecto utiliza un stack moderno y ligero para facilitar el despliegue y mantenimiento:

* **Core:** React 18 + Vite (Velocidad de desarrollo).
* **Estilos:** Tailwind CSS v3 (Diseño "Utility-first").
* **Iconos:** Lucide React.
* **Persistencia:** `localStorage` (Navegador) + Exportación JSON.
* **Lenguaje:** JavaScript (ES6+).
* **Control de Versiones:** Git + GitHub.

---

## ✨ Funcionalidades Principales

### 1. Gestión y Seguridad
* **Dashboard:** Visualización rápida de todos los personajes.
* **Sistema de Backup:** Importar y Exportar todos tus personajes mediante archivos JSON (para compartir con amigos o mover de dispositivo).
* **Persistencia Local:** Los datos se guardan automáticamente en el navegador.

### 2. Creador de Personajes (Wizard)
* **Flujo Guiado:** Selección visual de Raza, Clase, Atributos y Detalles de Rol.
* **Datos SRD:** Reglas oficiales integradas para Razas y Clases.
* **Auto-Equipamiento:** Asigna armas y rasgos de clase iniciales automáticamente.

### 3. Hoja de Personaje Interactiva (5 Pestañas)

#### ⚔️ Combat (Combate)
* **Dashboard Táctico:** Vista clara de AC, Iniciativa, HP y Velocidad.
* **Gestión de Salud:** Barra de vida dinámica, Death Saves (Salvaciones contra muerte) y Dados de Golpe (Hit Dice).
* **Lanzador de Dados:** Al hacer click en un arma, lanza 1d20 + Modificadores y detecta Críticos.
* **Gestión de Armas:** Crear armas personalizadas (Ej: "Espada +1") y borrarlas.
* **Inspiración y Descansos:** Botones para Inspiración, Short Rest (Gasto de dados) y Long Rest (Recuperación total).

#### 🎲 Skills (Habilidades)
* **Tiradas:** Lista completa de Skills y Saving Throws con cálculo automático de bonificadores.
* **Percepción Pasiva:** Cálculo automático basado en Sabiduría.
* **Competencias:** Visualización de idiomas y competencias de armadura/armas.

#### 🔥 Spells (Magia)
* **Grimorio Interactivo:** Añadir y borrar hechizos personalizados (Nombre, Nivel, Escuela, Daño).
* **Gestión de Slots:** Control de espacios de conjuro gastados/totales por nivel.
* **Calculadora Mágica:** Cálculo automático de Spell Save DC y Spell Attack Bonus según la clase.

#### 🎒 Equip (Inventario)
* **Monedero:** Gestión de divisas (CP, SP, EP, GP, PP).
* **Mochila:** Añadir y eliminar objetos del inventario rápidamente.

#### 📜 Profile (Perfil y Rol)
* **Progresión:** Edición de Nivel y XP (El Bono de Competencia se recalcula al subir de nivel).
* **Identidad:** Rasgos de personalidad, Ideales, Vínculos, Defectos e Historia.
* **Social:** Registro de Aliados, Organizaciones y Tesoros.

#### 🗺 Roadmap (Próximos Pasos)
[x] Subida de Nivel: Edición dinámica de nivel y stats.

[x] Gestor de Hechizos: Crear base de datos de spells y slots.

[x] Exportar/Importar: Guardar personajes en archivos JSON.

[ ] Multiclase: Soporte para tener niveles en varias clases.

[ ] PWA Manifest: Configurar iconos para instalación nativa en móviles.

[ ] API Externa: Conectar con una API de D&D 5e para tener todos los hechizos del juego.

---

## 📂 Estructura del Proyecto

```text
dnd-app/
├── src/
│   ├── data/
│   │   └── srd.js        # Base de datos estática (Razas, Clases, Skills, Hechizos Base)
│   ├── pages/
│   │   ├── Dashboard.jsx        # Home: Lista de héroes + Import/Export
│   │   ├── CharacterCreator.jsx # Wizard de creación paso a paso
│   │   └── CombatView.jsx       # Hoja de personaje completa (Tabs logic)
│   ├── App.jsx           # Controlador principal y Estado Global
│   ├── main.jsx          # Punto de entrada Vite
│   └── index.css         # Configuración Tailwind
├── public/               # Assets estáticos
├── index.html            # HTML raíz
└── package.json          # Dependencias