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
      // Inicializamos la vida actual igual a la máxima teórica (luego se recalcula)
      currentHP: null 
    };
    setHeroes([...heroes, newHero]);
    setCurrentView('dashboard');
  };

  // NUEVO: Función para actualizar un héroe existente (Ej. recibir daño)
  const handleUpdateHero = (updatedHero) => {
    const newHeroes = heroes.map(h => 
      h.id === updatedHero.id ? updatedHero : h
    );
    setHeroes(newHeroes);
  };

  // NUEVO: Función para borrar héroe
  const handleDeleteHero = (heroId) => {
    // Filtramos la lista para dejar fuera al que queremos borrar
    const newHeroes = heroes.filter(h => h.id !== heroId);
    setHeroes(newHeroes);
    setSelectedHeroId(null); // Deseleccionamos
    setCurrentView('dashboard'); // Volvemos a casa
  };

  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setCurrentView('combat');
  };

  const activeHero = heroes.find(h => h.id === selectedHeroId);

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      
      {currentView === 'dashboard' && (
        <Dashboard 
          heroes={heroes} 
          onNavigate={handleSelectHero} 
          onCreate={() => setCurrentView('creator')} 
        />
      )}

      {currentView === 'creator' && (
        <CharacterCreator 
          onBack={() => setCurrentView('dashboard')}
          onSave={handleSaveHero} 
        />
      )}

      {currentView === 'combat' && activeHero && (
        <CombatView 
          hero={activeHero} 
          onUpdateHero={handleUpdateHero} 
          onDeleteHero={handleDeleteHero} // <--- Pasamos la nueva herramienta
          onBack={() => setCurrentView('dashboard')} 
        />
      )}

    </div>
  );
}

export default App;