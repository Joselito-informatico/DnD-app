import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedHeroId, setSelectedHeroId] = useState(null);

  // Cargar datos del LocalStorage al inicio
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar datos en LocalStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("dnd_heroes", JSON.stringify(heroes));
  }, [heroes]);

  // --- CRUD (Crear, Leer, Actualizar, Borrar) ---

  const handleSaveHero = (newHeroData) => {
    const newHero = {
      id: Date.now(),
      ...newHeroData,
      level: 1,
      xp: 0,
      // Inicializamos HP como null para que CombatView calcule el máximo la primera vez
      currentHP: null,
    };
    setHeroes([...heroes, newHero]);
    setCurrentView("dashboard");
  };

  const handleUpdateHero = (updatedHero) => {
    const newHeroes = heroes.map((h) =>
      h.id === updatedHero.id ? updatedHero : h
    );
    setHeroes(newHeroes);
  };

  const handleDeleteHero = (heroId) => {
    const newHeroes = heroes.filter((h) => h.id !== heroId);
    setHeroes(newHeroes);
    setSelectedHeroId(null);
    setCurrentView("dashboard");
  };

  // --- GESTIÓN DE BACKUP (NUEVO) ---

  const handleImportHeroes = (importedHeroes) => {
    // Preguntamos al usuario si quiere reemplazar o fusionar
    if (
      confirm(
        `This backup contains ${importedHeroes.length} heroes.\n\nClick OK to REPLACE your current list.\nClick CANCEL to MERGE (add them to your list).`
      )
    ) {
      // Opción A: Reemplazo total (Restauración limpia)
      setHeroes(importedHeroes);
    } else {
      // Opción B: Fusión (Evitar duplicados por ID)
      const currentIds = new Set(heroes.map((h) => h.id));
      const uniqueNewHeroes = importedHeroes.filter(
        (h) => !currentIds.has(h.id)
      );

      if (uniqueNewHeroes.length > 0) {
        setHeroes([...heroes, ...uniqueNewHeroes]);
        alert(
          `Added ${uniqueNewHeroes.length} heroes. (Duplicates were skipped)`
        );
      } else {
        alert("No new heroes found (all IDs already exist).");
      }
    }
  };

  // --- NAVEGACIÓN ---

  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView("combat");
  };

  // Buscamos el objeto completo del héroe activo
  const activeHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      {currentView === "dashboard" && (
        <Dashboard
          heroes={heroes}
          onNavigate={handleSelectHero}
          onCreate={() => setCurrentView("creator")}
          onImport={handleImportHeroes} // <--- Pasamos la función de importar
        />
      )}

      {currentView === "creator" && (
        <CharacterCreator
          onBack={() => setCurrentView("dashboard")}
          onSave={handleSaveHero}
        />
      )}

      {currentView === "combat" && activeHero && (
        <CombatView
          hero={activeHero}
          onUpdateHero={handleUpdateHero}
          onDeleteHero={handleDeleteHero}
          onBack={() => setCurrentView("dashboard")}
        />
      )}
    </div>
  );
}

export default App;
