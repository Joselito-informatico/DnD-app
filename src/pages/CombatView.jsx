import { useState } from 'react';
import { ArrowLeft, Shield, Heart, Zap, Sword, Dices, X } from 'lucide-react';

export function CombatView({ hero, onBack, onUpdateHero }) {
  // Estado para el resultado del dado (null = no se está lanzando)
  const [rollResult, setRollResult] = useState(null);

  const getModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = 2; 

  const dexMod = getModifier(hero.stats.dex);
  const strMod = getModifier(hero.stats.str);
  const conMod = getModifier(hero.stats.con);
  const intMod = getModifier(hero.stats.int);

  const maxHP = (10 + conMod) + ((hero.level - 1) * 6);
  const currentHP = hero.currentHP ?? maxHP; // Si es null/undefined, usa maxHP
  const armorClass = 10 + dexMod; 
  const initiative = dexMod >= 0 ? `+${dexMod}` : dexMod;

  // Si el héroe es antiguo y no tiene armas, le damos un puñetazo por defecto
  const weapons = hero.weapons || [
    { id: 'default', name: 'Unarmed Strike', type: 'melee', damage: '1', stat: 'str' }
  ];

  // --- LÓGICA DE DADOS ---
  const handleRollAttack = (weapon) => {
    // 1. Determinar qué stat usa el arma
    let mod = 0;
    if (weapon.stat === 'str') mod = strMod;
    if (weapon.stat === 'dex') mod = dexMod;
    if (weapon.stat === 'int') mod = intMod;

    // 2. Lanzar el d20
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + mod + proficiencyBonus;

    // 3. Mostrar resultado
    setRollResult({
      weaponName: weapon.name,
      roll: d20,
      mod: mod + proficiencyBonus,
      total: total,
      isCrit: d20 === 20,
      isFail: d20 === 1
    });
  };

  const changeHP = (amount) => {
    const newHP = Math.min(maxHP, Math.max(0, currentHP + amount));
    onUpdateHero({ ...hero, currentHP: newHP });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20 relative">
      
      {/* HEADER & STATS (Igual que antes) */}
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition"><ArrowLeft /></button>
        <div>
          <h1 className="text-xl font-bold text-stone-100">{hero.name}</h1>
          <p className="text-xs text-stone-500">Lvl {hero.level} {hero.race} {hero.class}</p>
        </div>
      </header>

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

      {/* HP BAR (Simplificada para ahorrar espacio en código) */}
      <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 shadow-lg">
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-sm text-red-400 flex gap-2"><Heart size={18} fill="currentColor"/> HP</span>
          <span className="text-xl font-bold text-stone-100">{currentHP} <span className="text-stone-500 text-sm">/ {maxHP}</span></span>
        </div>
        <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden mb-3">
          <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(currentHP/maxHP)*100}%` }}></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeHP(-1)} className="flex-1 py-2 bg-stone-900 text-red-400 rounded-lg font-bold text-xs">- DMG</button>
          <button onClick={() => changeHP(1)} className="flex-1 py-2 bg-stone-900 text-green-400 rounded-lg font-bold text-xs">+ HEAL</button>
        </div>
      </div>

      {/* --- SECCIÓN DE ATAQUES DINÁMICA --- */}
      <div>
        <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider">Attacks & Spells</h3>
        <div className="space-y-2">
          
          {weapons.map((weapon) => {
            // Calculamos el bono visualmente para mostrarlo en el botón
            let statVal = hero.stats[weapon.stat] || 10;
            let mod = Math.floor((statVal - 10) / 2);
            let totalBonus = mod + proficiencyBonus;
            let sign = totalBonus >= 0 ? '+' : '';

            return (
              <div 
                key={weapon.id}
                onClick={() => handleRollAttack(weapon)}
                className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex justify-between items-center cursor-pointer hover:bg-stone-700 hover:border-yellow-500/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-stone-900 p-2 rounded-lg text-stone-500 group-hover:text-yellow-500 transition">
                    {weapon.type === 'spell' ? <Dices size={20} /> : <Sword size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-200">{weapon.name}</h4>
                    <p className="text-xs text-stone-500 capitalize">{weapon.type} • {weapon.damage} {weapon.stat}</p>
                  </div>
                </div>
                
                {/* Badge de Ataque (Clickable visualmente) */}
                <div className="bg-stone-900 border border-stone-600 px-3 py-1 rounded-lg font-bold text-stone-300 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition">
                  {sign}{totalBonus}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL DE RESULTADO DE DADOS (Popup) --- */}
      {rollResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative text-center">
            
            {/* Botón cerrar */}
            <button 
              onClick={() => setRollResult(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white"
            >
              <X />
            </button>

            <h3 className="text-stone-400 text-sm uppercase font-bold tracking-widest mb-4">
              {rollResult.weaponName} Attack
            </h3>

            {/* Círculo del Dado */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 text-4xl font-bold
              ${rollResult.isCrit ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : ''}
              ${rollResult.isFail ? 'border-red-600 text-red-600 bg-red-600/10' : ''}
              ${!rollResult.isCrit && !rollResult.isFail ? 'border-stone-600 text-stone-200 bg-stone-800' : ''}
            `}>
              {rollResult.roll}
            </div>

            {/* Cálculo Matemático */}
            <div className="text-stone-500 text-sm mb-6 flex justify-center gap-2 items-center font-mono bg-stone-950/50 py-2 rounded-lg">
              <span>Roll ({rollResult.roll})</span>
              <span>+</span>
              <span>Bonus ({rollResult.mod})</span>
              <span>=</span>
              <span className="text-xl font-bold text-stone-200">{rollResult.total}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setRollResult(null)}
                className="col-span-2 py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}