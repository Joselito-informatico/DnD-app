import { Plus, ChevronRight, User } from 'lucide-react';

export function Dashboard({ onNavigate, onCreate, heroes }) {

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">My Heroes</h1>
        <button className="p-2 bg-stone-800 rounded-full hover:bg-stone-700 transition">
          <div className="w-6 h-6 flex items-center justify-center text-stone-400">⚙️</div>
        </button>
      </header>

      {/* ESTADO VACÍO: Si no hay héroes, mostramos un mensaje amigable */}
      {heroes.length === 0 ? (
        <div className="text-center py-12 bg-stone-800/30 rounded-2xl border-2 border-dashed border-stone-800">
          <p className="text-stone-500 mb-2">No heroes yet.</p>
          <p className="text-sm text-stone-600">Click the + button to begin your adventure.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {heroes.map((hero) => (
            <div 
              key={hero.id} 
              onClick={() => onNavigate(hero.id)}
              className="group flex items-center justify-between p-4 bg-stone-800 rounded-2xl border border-stone-700/50 hover:border-yellow-600/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-700 flex items-center justify-center border-2 border-stone-600 group-hover:border-yellow-500 transition text-xl font-bold text-stone-500">
                  {/* Inicial del nombre */}
                  {hero.name.charAt(0)}
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
      )}

      <button 
        onClick={onCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-stone-900 rounded-full shadow-lg shadow-yellow-500/20 flex items-center justify-center transition transform hover:scale-105 active:scale-95"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
    </div>
  );
}