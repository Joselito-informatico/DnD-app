import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { CharacterCreator } from './pages/CharacterCreator';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // 1. ESTADO: Aquí viven los héroes.
  // Intentamos leer del localStorage primero, si no hay nada, array vacío.
  const [heroes, setHeroes] = useState(() => {
    const saved = localStorage.getItem('dnd_heroes');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. EFECTO: Cada vez que 'heroes' cambie, guardamos en localStorage automáticamente.
  useEffect(() => {
    localStorage.setItem('dnd_heroes', JSON.stringify(heroes));
  }, [heroes]);

  // 3. ACCIÓN: Función para agregar un nuevo héroe
  const handleSaveHero = (newHeroData) => {
    const newHero = {
      id: Date.now(), // Usamos la hora como ID único temporal
      ...newHeroData,
      level: 1, // Todos empiezan en nivel 1
    };
    
    setHeroes([...heroes, newHero]); // Agregamos al final de la lista
    setCurrentView('dashboard'); // Volvemos a la pantalla principal
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      
      {currentView === 'dashboard' && (
        <Dashboard 
          heroes={heroes} // Le pasamos la lista para que la muestre
          onNavigate={setCurrentView} 
        />
      )}

      {currentView === 'creator' && (
        <CharacterCreator 
          onBack={() => setCurrentView('dashboard')}
          onSave={handleSaveHero} // Le pasamos la función para guardar
        />
      )}

      {currentView === 'combat' && (
        <div className="text-center mt-20">
          <h2 className="text-xl font-bold">Combat View</h2>
          <button onClick={() => setCurrentView('dashboard')} className="text-yellow-500 underline mt-4">Back</button>
        </div>
      )}

    </div>
  );
}

export default App;