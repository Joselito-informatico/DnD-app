import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { DicePage } from "./pages/DicePage";
import { Compendium } from "./pages/Compendium"; // <--- Tu nueva vista
import { BottomNav } from "./components/BottomNav";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  // Estado global de héroes (Persistencia en LocalStorage)
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHeroId, setSelectedHeroId] = useState(null);

  useEffect(() => {
    localStorage.setItem("dnd_heroes", JSON.stringify(heroes));
  }, [heroes]);

  const addHero = (hero) => {
    setHeroes([...heroes, hero]);
  };

  const updateHero = (updatedHero) => {
    setHeroes(heroes.map((h) => (h.id === updatedHero.id ? updatedHero : h)));
  };

  const deleteHero = (id) => {
    setHeroes(heroes.filter((h) => h.id !== id));
    if (selectedHeroId === id) setSelectedHeroId(null);
  };

  const activeHero = heroes.find((h) => h.id === selectedHeroId);

  return (
    <LanguageProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="bg-neutral-900 min-h-screen text-stone-200 font-sans">
            <Routes>
              {/* DASHBOARD: Lista de Personajes */}
              <Route
                path="/"
                element={
                  <Dashboard
                    heroes={heroes}
                    onSelectHero={(id) => setSelectedHeroId(id)}
                    onDeleteHero={deleteHero}
                  />
                }
              />

              {/* CREATOR: Nuevo Personaje */}
              <Route
                path="/create"
                element={
                  <CharacterCreator
                    onBack={() => window.history.back()}
                    onSave={(hero) => {
                      addHero(hero);
                      window.location.href = "/";
                    }}
                  />
                }
              />

              {/* COMBAT: La vista principal de juego */}
              <Route
                path="/play"
                element={
                  activeHero ? (
                    <CombatView
                      hero={activeHero}
                      onBack={() => setSelectedHeroId(null)}
                      onUpdateHero={updateHero}
                      onDeleteHero={(id) => {
                        deleteHero(id);
                        window.location.href = "/";
                      }}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* COMPENDIUM: Referencia Rápida */}
              <Route path="/compendium" element={<Compendium />} />

              {/* DICE: Lanzador de dados independiente */}
              <Route path="/dice" element={<DicePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* BARRA DE NAVEGACIÓN INFERIOR */}
            {/* Solo la mostramos si NO estamos en combate o creando personaje */}
            {/* (O puedes decidir mostrarla siempre. Aquí la mostramos para navegar entre Home/Compendio/Dados) */}
            <IsNavVisible>
              <BottomNav />
            </IsNavVisible>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </LanguageProvider>
  );
}

// Helper para ocultar la nav en vistas inmersivas
function IsNavVisible({ children }) {
  const path = window.location.pathname;
  // Ocultamos la nav en Combate (/play) y Creación (/create) para ganar espacio
  if (path === "/play" || path === "/create") return null;
  return children;
}
