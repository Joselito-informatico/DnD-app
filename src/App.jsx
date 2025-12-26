import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { CharacterCreator } from './pages/CharacterCreator';

function App() {
  // Estado para controlar qué pantalla vemos. Por defecto: 'dashboard'
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-100 font-sans p-6">
      
      {/* Si la vista es 'dashboard', mostramos el Dashboard */}
      {currentView === 'dashboard' && (
        <Dashboard onNavigate={(screen) => setCurrentView(screen)} />
      )}

      {/* Si la vista es 'creator', mostramos el Creador */}
      {currentView === 'creator' && (
        <CharacterCreator onBack={() => setCurrentView('dashboard')} />
      )}

      {/* Placeholder para cuando hagamos la vista de combate */}
      {currentView === 'combat' && (
        <div className="text-center mt-20">
          <h2 className="text-xl font-bold">Combat View</h2>
          <p className="text-stone-500 mb-4">Work in progress...</p>
          <button onClick={() => setCurrentView('dashboard')} className="text-yellow-500 underline">Back</button>
        </div>
      )}

    </div>
  );
}

export default App;