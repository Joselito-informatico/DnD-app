import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { DicePage } from "./pages/DicePage";
import { Compendium } from "./pages/Compendium";
import { BottomNav } from "./components/BottomNav"; // NUEVO COMPONENTE
import { generateRandomHero } from "./utils/randomizer";
import { useLanguage } from "./context/LanguageContext";
import { useToast } from "./context/ToastContext";
import { Globe } from "lucide-react";

function App() {
  const { t, language, toggleLanguage } = useLanguage();
  const { showToast } = useToast();

  // Estado de navegación global
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'creator', 'combat'
  const [mainTab, setMainTab] = useState("heroes"); // 'heroes', 'dice', 'compendium'
  const [selectedHeroId, setSelectedHeroId] = useState(null);

  // Persistencia de Héroes
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
    setMainTab("heroes"); // Volver a la lista al terminar
    showToast(t("successImport"), "success");
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
      showToast(t("successImport"), "success");
    }
  };

  const handleCreateRandom = () => {
    const randomHero = generateRandomHero();
    setHeroes([...heroes, randomHero]);
    showToast(`${randomHero.name} joined!`, "success");
  };

  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView("combat"); // Entra en modo "Pantalla completa"
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId);

  // RENDERIZADO DE LA VISTA PRINCIPAL (TABS)
  const renderMainContent = () => {
    if (mainTab === "dice") return <DicePage />;
    if (mainTab === "compendium") return <Compendium />;
    return (
      <Dashboard
        heroes={heroes}
        onNavigate={handleSelectHero}
        onCreate={() => setCurrentView("creator")}
        onImport={handleImportHeroes}
        onRandom={handleCreateRandom}
      />
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans pb-safe">
      {/* Botón de Idioma (Solo visible en Dashboard/Tabs) */}
      {currentView === "dashboard" && (
        <button
          onClick={toggleLanguage}
          className="fixed top-6 right-6 z-50 bg-stone-800 border border-stone-600 p-2 rounded-full hover:bg-yellow-600 hover:text-stone-900 transition flex items-center gap-2 text-xs font-bold shadow-lg"
        >
          <Globe size={16} /> {language.toUpperCase()}
        </button>
      )}

      {/* RUTAS */}

      {/* 1. MODO DASHBOARD (Con Tabs) */}
      {currentView === "dashboard" && (
        <>
          {renderMainContent()}
          <BottomNav activeTab={mainTab} onChange={setMainTab} />
        </>
      )}

      {/* 2. MODO CREADOR (Pantalla Completa) */}
      {currentView === "creator" && (
        <CharacterCreator
          onBack={() => setCurrentView("dashboard")}
          onSave={handleSaveHero}
        />
      )}

      {/* 3. MODO COMBATE (Pantalla Completa) */}
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
