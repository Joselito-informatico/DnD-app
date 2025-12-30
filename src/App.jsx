import { useState, useEffect } from "react";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { DicePage } from "./pages/DicePage";
import { Compendium } from "./pages/Compendium";
import { BottomNav } from "./components/BottomNav";

function AppContent() {
  // --- ESTADO DE LA APP ---
  const [view, setView] = useState("dashboard"); // 'dashboard', 'creator', 'hero', 'dice', 'compendium'
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeHero, setActiveHero] = useState(null);

  // Guardar automáticamente al cambiar héroes
  useEffect(() => {
    localStorage.setItem("dnd_heroes", JSON.stringify(heroes));
  }, [heroes]);

  // --- ACCIONES ---
  const handleSaveHero = (newHero) => {
    setHeroes([...heroes, newHero]);
    setView("dashboard");
  };

  const handleUpdateHero = (updatedHero) => {
    const updatedList = heroes.map((h) =>
      h.id === updatedHero.id ? updatedHero : h
    );
    setHeroes(updatedList);
    setActiveHero(updatedHero); // Mantener la vista actualizada
  };

  const handleDeleteHero = (heroId) => {
    const updatedList = heroes.filter((h) => h.id !== heroId);
    setHeroes(updatedList);
    setActiveHero(null);
    setView("dashboard");
  };

  const handleImport = (importedData) => {
    setHeroes(importedData);
    setView("dashboard");
  };

  const handleNavigate = (hero) => {
    setActiveHero(hero);
    setView("hero");
  };

  // --- RENDERIZADO DE VISTAS ---
  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans selection:bg-yellow-500 selection:text-stone-900">
      {/* VISTA: DASHBOARD (Lista de Héroes) */}
      {view === "dashboard" && (
        <Dashboard
          heroes={heroes}
          onNavigate={handleNavigate}
          onCreate={() => setView("creator")}
          onImport={handleImport}
          onRandom={() => {
            // Import dinámico para evitar ciclos si fuera necesario, o uso directo
            import("./utils/randomizer").then((mod) => {
              const randomHero = mod.generateRandomHero();
              handleSaveHero(randomHero);
            });
          }}
        />
      )}

      {/* VISTA: CREADOR DE PERSONAJES */}
      {view === "creator" && (
        <CharacterCreator
          onBack={() => setView("dashboard")}
          onSave={handleSaveHero}
        />
      )}

      {/* VISTA: HOJA DE PERSONAJE (COMBATE) */}
      {view === "hero" && activeHero && (
        <CombatView
          hero={activeHero}
          onBack={() => {
            setActiveHero(null);
            setView("dashboard");
          }}
          onUpdateHero={handleUpdateHero}
          onDeleteHero={handleDeleteHero}
        />
      )}

      {/* VISTA: DADOS RAPIDOS */}
      {view === "dice" && <DicePage />}

      {/* VISTA: COMPENDIO */}
      {view === "compendium" && (
        <Compendium onBack={() => setView("dashboard")} />
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR (Solo visible en dashboard, dados y compendio) */}
      {["dashboard", "dice", "compendium"].includes(view) && (
        <BottomNav activeTab={view} onChange={setView} />
      )}
    </div>
  );
}

// Punto de entrada con Proveedores de Contexto
export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </LanguageProvider>
  );
}
