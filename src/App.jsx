import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { generateRandomHero } from "./utils/randomizer";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedHeroId, setSelectedHeroId] = useState(null);

  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dnd_heroes", JSON.stringify(heroes));
  }, [heroes]);

  // --- CRUD ---
  const handleSaveHero = (newHeroData) => {
    const newHero = {
      id: Date.now(),
      ...newHeroData,
      level: 1,
      xp: 0,
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

  // --- BACKUP & RANDOM ---
  const handleImportHeroes = (importedHeroes) => {
    if (
      confirm(
        `This backup contains ${importedHeroes.length} heroes.\n\nClick OK to REPLACE your current list.\nClick CANCEL to MERGE.`
      )
    ) {
      setHeroes(importedHeroes);
    } else {
      const currentIds = new Set(heroes.map((h) => h.id));
      const uniqueNewHeroes = importedHeroes.filter(
        (h) => !currentIds.has(h.id)
      );
      if (uniqueNewHeroes.length > 0) {
        setHeroes([...heroes, ...uniqueNewHeroes]);
        alert(`Added ${uniqueNewHeroes.length} heroes.`);
      } else {
        alert("No new heroes found.");
      }
    }
  };

  const handleCreateRandom = () => {
    const randomHero = generateRandomHero();
    setHeroes([...heroes, randomHero]);
    alert(`Random hero "${randomHero.name}" created!`);
  };

  // --- NAVEGACIÓN ---
  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView("combat");
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      {currentView === "dashboard" && (
        <Dashboard
          heroes={heroes}
          onNavigate={handleSelectHero}
          onCreate={() => setCurrentView("creator")}
          onImport={handleImportHeroes}
          onRandom={handleCreateRandom}
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
