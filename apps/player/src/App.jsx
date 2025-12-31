import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { CharacterCreator } from "./pages/CharacterCreator";
import { CombatView } from "./pages/CombatView";
import { DicePage } from "./pages/DicePage";
import { Compendium } from "./pages/Compendium";
import { BottomNav } from "./components/BottomNav";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";

// Componente para controlar la visibilidad de la navegación
function NavigationController({ children }) {
  const location = useLocation();
  // Rutas donde NO queremos ver la barra de navegación (Modo inmersivo)
  const hideNavRoutes = ["/play", "/create"];

  if (hideNavRoutes.includes(location.pathname)) {
    return null;
  }

  return children;
}

export default function App() {
  // Estado persistente: Carga héroes guardados o inicia array vacío
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem("dnd_heroes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHeroId, setSelectedHeroId] = useState(null);

  // Efecto: Guarda automáticamente en LocalStorage cada vez que cambian los héroes
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
          <div className="bg-neutral-900 min-h-screen text-stone-200 font-sans pb-20">
            <Routes>
              {/* DASHBOARD: Pantalla Principal */}
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

              {/* CREATOR: Crear Personaje */}
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

              {/* COMBAT: Hoja de Personaje y Juego */}
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

              {/* COMPENDIUM: Manual de Reglas y Hechizos */}
              <Route path="/compendium" element={<Compendium />} />

              {/* DICE: Lanzador de Dados */}
              <Route path="/dice" element={<DicePage />} />

              {/* Fallback: Redirigir a Home si la ruta no existe */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* BARRA DE NAVEGACIÓN INFERIOR (Visible solo fuera de combate/creación) */}
            <NavigationController>
              <BottomNav />
            </NavigationController>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </LanguageProvider>
  );
}
