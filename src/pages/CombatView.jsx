import { ArrowLeft, Shield, Heart, Zap, Sword } from 'lucide-react';

export function CombatView({ hero, onBack }) {
  
  // 1. Lógica de Reglas (Cálculos automáticos)
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = 2; // Fijo para nivel 1-4

  // Calculamos stats en vivo basados en los atributos guardados
  const dexMod = getModifier(hero.stats.dex);
  const strMod = getModifier(hero.stats.str);
  const conMod = getModifier(hero.stats.con);

  // Fórmulas básicas (luego las mejoraremos con equipo real)
  const armorClass = 10 + dexMod; 
  const maxHP = 10 + conMod; // Base genérica (luego usaremos el dado de golpe de la clase)
  const initiative = dexMod > 0 ? `+${dexMod}` : dexMod;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      
      {/* HEADER: Navegación y Resumen */}
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-100">{hero.name}</h1>
          <p className="text-xs text-stone-500">Lvl {hero.level} {hero.race} {hero.class}</p>
        </div>
      </header>

      {/* DASHBOARD PRINCIPAL: Stats de Supervivencia */}
      <div className="grid grid-cols-3 gap-3">
        {/* AC (Armor Class) */}
        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center relative overflow-hidden">
          <Shield className="text-stone-600 absolute opacity-20 -right-2 -bottom-2 w-16 h-16" />
          <span className="text-xs text-stone-400 font-bold uppercase">Armor</span>
          <span className="text-3xl font-bold text-stone-100">{armorClass}</span>
        </div>

        {/* INITIATIVA */}
        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
          <Zap className="text-yellow-600 mb-1 w-5 h-5" />
          <span className="text-xs text-stone-400 font-bold uppercase">Init</span>
          <span className="text-2xl font-bold text-yellow-500">{initiative}</span>
        </div>

        {/* SPEED (Velocidad base) */}
        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
          <span className="text-xs text-stone-400 font-bold uppercase">Speed</span>
          <span className="text-2xl font-bold text-stone-100">30<span className="text-sm font-normal text-stone-500">ft</span></span>
        </div>
      </div>

      {/* BARRA DE VIDA (HP) */}
      <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2 text-red-400">
            <Heart size={18} fill="currentColor" />
            <span className="font-bold text-sm">Hit Points</span>
          </div>
          <span className="text-xl font-bold text-stone-100">
            {maxHP} <span className="text-stone-500 text-sm">/ {maxHP}</span>
          </span>
        </div>
        {/* Barra visual */}
        <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full w-full"></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2 bg-stone-900 text-red-400 rounded-lg font-bold text-sm hover:bg-stone-950">- DMG</button>
          <button className="flex-1 py-2 bg-stone-900 text-green-400 rounded-lg font-bold text-sm hover:bg-stone-950">+ HEAL</button>
        </div>
      </div>

      {/* ATAQUES (Calculados automáticamente) */}
      <div>
        <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider">Actions</h3>
        <div className="bg-stone-800 rounded-xl border border-stone-700 divide-y divide-stone-700/50">
          
          {/* Ataque Melee (Usa Fuerza) */}
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
            <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-lg font-bold">
              +{strMod + proficiencyBonus}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}