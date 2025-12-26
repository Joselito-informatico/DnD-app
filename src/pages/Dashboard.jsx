import { Plus, ChevronRight, User } from 'lucide-react';

// Recibimos "onNavigate" como una herramienta para cambiar de pantalla
export function Dashboard({ onNavigate }) {
  const heroes = [
    { id: 1, name: "Valeros", race: "Human", class: "Fighter", level: 4 },
    { id: 2, name: "Lyra Silvertongue", race: "Tiefling", class: "Bard", level: 2 },
    { id: 3, name: "Ezren", race: "Human", class: "Wizard", level: 5 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">My Heroes</h1>
        <button className="p-2 bg-stone-800 rounded-full hover:bg-stone-700 transition">
          <div className="w-6 h-6 flex items-center justify-center text-stone-400">⚙️</div>
        </button>
      </header>

      <div className="space-y-4">
        {heroes.map((hero) => (
          <div 
            key={hero.id} 
            // Al hacer click en un héroe, vamos a la pantalla de combate (futuro)
            onClick={() => onNavigate('combat')} 
            className="group flex items-center justify-between p-4 bg-stone-800 rounded-2xl border border-stone-700/50 hover:border-yellow-600/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-700 flex items-center justify-center border-2 border-stone-600 group-hover:border-yellow-500 transition">
                <User className="text-stone-400 w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-100 group-hover:text-yellow-400 transition">{hero.name}</h2>
                <p className="text-stone-400 text-sm">Level {hero.level} {hero.race} {hero.class}</p>
              </div>
            </div>
            <ChevronRight className="text-stone-600 group-hover:text-yellow-500 transition" />
          </div>
        ))}
      </div>

      {/* Al hacer click en +, vamos a la pantalla 'creator' */}
      <button 
        onClick={() => onNavigate('creator')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-stone-900 rounded-full shadow-lg shadow-yellow-500/20 flex items-center justify-center transition transform hover:scale-105 active:scale-95"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
}