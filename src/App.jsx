import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { generateRandomHero } from "./utils/randomizer";
import { useLanguage } from "./context/LanguageContext";
import { useToast } from "./context/ToastContext"; // <--- Importar
import { Globe } from "lucide-react";

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const { showToast } = useToast(); // <--- Usar Hook

  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedHeroId, setSelectedHeroId] = useState(null);

  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dnd_heroes", JSON.stringify(heroes));
  }, [heroes]);

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
    showToast(t("successImport"), "success"); // Reutilizamos mensaje de éxito o pon uno custom
  };

  const handleUpdateHero = (updatedHero) => {
    setHeroes(heroes.map((h) => (h.id === updatedHero.id ? updatedHero : h)));
  };

  const handleDeleteHero = (heroId) => {
    setHeroes(heroes.filter((h) => h.id !== heroId));
    setSelectedHeroId(null);
    setCurrentView("dashboard");
    showToast("Hero deleted", "info");
  };

  const handleImportHeroes = (importedHeroes) => {
    if (confirm(t("confirmImport"))) {
      setHeroes(importedHeroes);
      showToast(t("successImport"), "success"); // <--- TOAST
    }
  };

  const handleCreateRandom = () => {
    const randomHero = generateRandomHero();
    setHeroes([...heroes, randomHero]);
    showToast(`${randomHero.name} joined the party!`, "success"); // <--- TOAST
  };

  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView("combat");
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 bg-stone-800 border border-stone-600 p-2 rounded-full hover:bg-yellow-600 hover:text-stone-900 transition flex items-center gap-2 text-xs font-bold shadow-lg"
      >
        <Globe size={16} /> {language.toUpperCase()}
      </button>

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
