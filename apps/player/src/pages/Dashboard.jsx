import { Plus, Trash2, Sword, Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Dashboard({ heroes, onSelectHero, onDeleteHero }) {
  const navigate = useNavigate();

  const handlePlay = (heroId) => {
    onSelectHero(heroId);
    navigate("/play");
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-stone-100 tracking-tight">
          Mis Héroes
        </h1>
        <p className="text-stone-500">Gestiona tus personajes y aventuras.</p>
      </header>

      {heroes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-stone-800 rounded-3xl bg-stone-900/50">
          <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-stone-600" />
          </div>
          <h3 className="text-xl font-bold text-stone-300 mb-2">Sin Héroes</h3>
          <p className="text-stone-500 text-sm max-w-[200px] mx-auto mb-6">
            Aún no has creado ningún personaje para tu aventura.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition shadow-lg shadow-yellow-900/20"
          >
            <Plus size={20} strokeWidth={3} />
            Crear Héroe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="group relative bg-stone-800 rounded-2xl border border-stone-700 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 shadow-lg"
            >
              {/* Fondo decorativo de clase (Opcional) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none" />

              <div className="p-5 flex items-center gap-4 relative z-10">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-stone-600 overflow-hidden flex-shrink-0 shadow-inner">
                  {hero.details?.avatar ? (
                    <img
                      src={hero.details.avatar}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="text-stone-700" size={32} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-stone-100 truncate leading-tight">
                    {hero.name}
                  </h2>
                  <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">
                    Nivel {hero.level} • {hero.class}
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    {hero.race} • {hero.details?.background || "Aventurero"}
                  </p>
                </div>
              </div>

              {/* Botonera inferior */}
              <div className="flex border-t border-stone-700 bg-stone-900/50">
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar este héroe permanentemente?")) {
                      onDeleteHero(hero.id);
                    }
                  }}
                  className="p-4 text-stone-500 hover:text-red-500 hover:bg-red-900/20 transition flex items-center justify-center border-r border-stone-700"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handlePlay(hero.id)}
                  className="flex-1 p-4 text-stone-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                >
                  <Sword size={16} /> Jugar
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/create"
            className="mt-4 p-4 border-2 border-dashed border-stone-700 rounded-2xl flex items-center justify-center gap-2 text-stone-500 hover:text-stone-300 hover:border-stone-500 hover:bg-stone-800 transition group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-stone-700">
              <Plus size={16} />
            </div>
            <span className="font-bold">Crear Nuevo Personaje</span>
          </Link>
        </div>
      )}
    </div>
  );
}
