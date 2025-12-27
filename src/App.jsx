import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { CharacterCreator } from './pages/CharacterCreator';
import { CombatView } from './pages/CombatView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedHeroId, setSelectedHeroId] = useState(null);
  
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem('dnd_heroes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dnd_heroes', JSON.stringify(heroes));
  }, [heroes]);

  const handleSaveHero = (newHeroData) => {
    const newHero = {
      id: Date.now(),
      ...newHeroData,
      level: 1,
    };
    setHeroes([...heroes, newHero]);
    setCurrentView('dashboard');
  };

  // NUEVO: Función para abrir un héroe específico
  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView('combat');
  };

  // Encontramos el objeto completo del héroe seleccionado
  const activeHero = heroes.find(h => h.id === selectedHeroId);

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      
      {currentView === 'dashboard' && (
        <Dashboard 
          heroes={heroes} 
          onNavigate={handleSelectHero} // <--- CAMBIO: Ahora pasamos la función de selección
          onCreate={() => setCurrentView('creator')} // Separamos la creación de la selección
        />
      )}

      {currentView === 'creator' && (
        <CharacterCreator 
          onBack={() => setCurrentView('dashboard')}
          onSave={handleSaveHero} 
        />
      )}

      {currentView === 'combat' && activeHero && ( // Solo mostramos si hay héroe válido
        <CombatView 
          hero={activeHero} 
          onBack={() => setCurrentView('dashboard')} 
        />
      )}

    </div>
  );
}

export default App;