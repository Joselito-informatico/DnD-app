import { ArrowLeft, Shield, Heart, Zap, Sword } from 'lucide-react';

// Recibimos 'onUpdateHero' para poder guardar los cambios
export function CombatView({ hero, onBack, onUpdateHero }) {
  
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = 2; 

  const dexMod = getModifier(hero.stats.dex);
  const strMod = getModifier(hero.stats.str);
  const conMod = getModifier(hero.stats.con);

  // CÁLCULO DE VIDA MÁXIMA (Regla simple: 10 + CON al nivel 1 + promedio después)
  // Para MVP simplificamos: Base 10 + CON + (Nivel * 6)
  const maxHP = (10 + conMod) + ((hero.level - 1) * 6);
  
  // VIDA ACTUAL: Si no existe en la base de datos, empezamos con la Máxima
  const currentHP = hero.currentHP !== undefined && hero.currentHP !== null 
    ? hero.currentHP 
    : maxHP;

  // Stats derivados
  const armorClass = 10 + dexMod; 
  const initiative = dexMod >= 0 ? `+${dexMod}` : dexMod;

  // LÓGICA DE BARRA DE VIDA
  const healthPercentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  let healthColor = 'bg-green-500';
  if (healthPercentage < 50) healthColor = 'bg-yellow-500';
  if (healthPercentage < 25) healthColor = 'bg-red-600';

  // FUNCIONES DE ACCIÓN
  const changeHP = (amount) => {
    const newHP = Math.min(maxHP, Math.max(0, currentHP + amount));
    // Guardamos el cambio en la base de datos principal
    onUpdateHero({ ...hero, currentHP: newHP });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      
      {/* HEADER */}
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-100">{hero.name}</h1>
          <p className="text-xs text-stone-500">Lvl {hero.level} {hero.race} {hero.class}</p>
        </div>
      </header>

      {/* STATS PRINCIPALES */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center relative overflow-hidden">
          <Shield className="text-stone-600 absolute opacity-20 -right-2 -bottom-2 w-16 h-16" />
          <span className="text-xs text-stone-400 font-bold uppercase">Armor</span>
          <span className="text-3xl font-bold text-stone-100">{armorClass}</span>
        </div>

        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
          <Zap className="text-yellow-600 mb-1 w-5 h-5" />
          <span className="text-xs text-stone-400 font-bold uppercase">Init</span>
          <span className="text-2xl font-bold text-yellow-500">{initiative}</span>
        </div>

        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
          <span className="text-xs text-stone-400 font-bold uppercase">Speed</span>
          <span className="text-2xl font-bold text-stone-100">30<span className="text-sm font-normal text-stone-500">ft</span></span>
        </div>
      </div>

      {/* GESTIÓN DE VIDA (INTERACTIVA) */}
      <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 shadow-lg">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2 text-stone-300">
            <Heart size={18} className="text-red-500" fill="currentColor" />
            <span className="font-bold text-sm">Hit Points</span>
          </div>
          <span className="text-xl font-bold text-stone-100">
            {currentHP} <span className="text-stone-500 text-sm">/ {maxHP}</span>
          </span>
        </div>
        
        {/* Barra Visual Dinámica */}
        <div className="w-full bg-stone-900 h-4 rounded-full overflow-hidden border border-stone-700/50 mb-4 relative">
          <div 
            className={`h-full transition-all duration-500 ease-out ${healthColor}`} 
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => changeHP(-1)}
            className="py-3 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg font-bold hover:bg-red-900/50 active:scale-95 transition flex items-center justify-center gap-2"
          >
            Damage (-1)
          </button>
          <button 
            onClick={() => changeHP(1)}
            className="py-3 bg-green-900/30 text-green-400 border border-green-900/50 rounded-lg font-bold hover:bg-green-900/50 active:scale-95 transition flex items-center justify-center gap-2"
          >
            Heal (+1)
          </button>
        </div>
      </div>

      {/* LISTA DE ATAQUES (Aún estática pero con datos reales de stats) */}
      <div>
        <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider">Actions</h3>
        <div className="bg-stone-800 rounded-xl border border-stone-700 divide-y divide-stone-700/50">
          <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-stone-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="bg-stone-900 p-2 rounded-lg text-stone-500">
                <Sword size={20} />
              </div>
              <div>
                <h4 className="font-bold text-stone-200">Unarmed Strike</h4>
                <p className="text-xs text-stone-500">Melee • 1d4 + {strMod} Bludgeoning</p>
              </div>
            </div>
            <div className="bg-stone-700 text-stone-300 border border-stone-600 px-3 py-1 rounded-lg font-bold">
              {strMod + proficiencyBonus >= 0 ? '+' : ''}{strMod + proficiencyBonus}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}