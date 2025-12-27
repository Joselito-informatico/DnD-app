import { useState } from 'react';
import { ArrowLeft, Shield, Heart, Zap, Sword, Dices, X, Scroll, Activity } from 'lucide-react';
import { CLASSES, SKILLS } from '../data/srd'; // <--- Importamos SKILLS

export function CombatView({ hero, onBack, onUpdateHero }) {
  const [activeTab, setActiveTab] = useState('combat'); // 'combat' o 'skills'
  const [rollResult, setRollResult] = useState(null);

  // --- LÓGICA MATEMÁTICA ---
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = 2; // Nivel 1-4

  const stats = hero.stats;
  const mods = {
    str: getModifier(stats.str),
    dex: getModifier(stats.dex),
    con: getModifier(stats.con),
    int: getModifier(stats.int),
    wis: getModifier(stats.wis),
    cha: getModifier(stats.cha),
  };

  const maxHP = (10 + mods.con) + ((hero.level - 1) * 6);
  const currentHP = hero.currentHP ?? maxHP;
  const armorClass = 10 + mods.dex; 
  const initiative = mods.dex >= 0 ? `+${mods.dex}` : mods.dex;

  // Encontrar datos de la clase para saber las competencias
  const heroClassData = CLASSES.find(c => c.name === hero.class);
  const saveProficiencies = heroClassData ? heroClassData.saves : [];

  const weapons = hero.weapons || [
    { id: 'def', name: 'Unarmed', type: 'melee', damage: '1', stat: 'str' }
  ];

  // --- LANZADOR DE DADOS GENÉRICO ---
  const rollDice = (name, modifier) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setRollResult({
      title: name,
      roll: d20,
      mod: modifier,
      total: d20 + modifier,
      isCrit: d20 === 20,
      isFail: d20 === 1
    });
  };

  const changeHP = (val) => {
    const newHP = Math.min(maxHP, Math.max(0, currentHP + val));
    onUpdateHero({ ...hero, currentHP: newHP });
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 pb-20">
      
      {/* HEADER FIJO */}
      <header className="flex items-center gap-4 p-6 pb-2 bg-neutral-900 z-10">
        <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition"><ArrowLeft /></button>
        <div>
          <h1 className="text-xl font-bold text-stone-100">{hero.name}</h1>
          <p className="text-xs text-stone-500">Lvl {hero.level} {hero.race} {hero.class}</p>
        </div>
      </header>

      {/* TABS (PESTAÑAS) */}
      <div className="flex px-6 border-b border-stone-800 mb-4">
        <button 
          onClick={() => setActiveTab('combat')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'combat' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}
        >
          COMBAT
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'skills' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}
        >
          SKILLS & SAVES
        </button>
      </div>

      {/* CONTENIDO CON SCROLL */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-24">
        
        {/* === PESTAÑA 1: COMBATE === */}
        {activeTab === 'combat' && (
          <div className="space-y-6 animate-in slide-in-from-left duration-200">
            {/* Stats Rápidos */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center relative overflow-hidden">
                <Shield className="text-stone-600 absolute opacity-20 -right-2 -bottom-2 w-16 h-16" />
                <span className="text-xs text-stone-400 font-bold uppercase">AC</span>
                <span className="text-3xl font-bold text-stone-100">{armorClass}</span>
              </div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
                <Zap className="text-yellow-600 mb-1 w-5 h-5" />
                <span className="text-xs text-stone-400 font-bold uppercase">Init</span>
                <span className="text-2xl font-bold text-yellow-500">{initiative}</span>
              </div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center">
                <Heart className="text-red-500 mb-1 w-5 h-5" />
                <span className="text-xs text-stone-400 font-bold uppercase">HP</span>
                <span className="text-xl font-bold text-stone-100">{currentHP}<span className="text-stone-500 text-sm">/{maxHP}</span></span>
              </div>
            </div>

            {/* Gestión de Vida */}
            <div className="flex gap-2">
              <button onClick={() => changeHP(-1)} className="flex-1 py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg font-bold hover:bg-red-900/40">- DMG</button>
              <button onClick={() => changeHP(1)} className="flex-1 py-3 bg-green-900/20 text-green-400 border border-green-900/50 rounded-lg font-bold hover:bg-green-900/40">+ HEAL</button>
            </div>

            {/* Lista de Ataques */}
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider">Attacks</h3>
              <div className="space-y-2">
                {weapons.map((w) => {
                  const mod = mods[w.stat] + proficiencyBonus;
                  return (
                    <div key={w.id} onClick={() => rollDice(`${w.name} Attack`, mod)} className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-stone-900 p-2 rounded-lg text-stone-500"><Sword size={20} /></div>
                        <div>
                          <h4 className="font-bold text-stone-200">{w.name}</h4>
                          <p className="text-xs text-stone-500">{w.damage} {w.stat.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="bg-stone-900 px-3 py-1 rounded-lg font-bold text-stone-300">+{mod}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === PESTAÑA 2: HABILIDADES === */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            
            {/* Salvaciones (Saving Throws) */}
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Shield size={16} /> Saving Throws
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(mods).map((stat) => {
                  const isProficient = saveProficiencies.map(s => s.toLowerCase()).includes(stat); // Revisamos si la clase es competente
                  // Mapeamos 'str' -> 'Strength' para comparar con el array de saves que guardamos
                  const fullStatName = {str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma'}[stat];
                  const isSaveProficient = saveProficiencies.includes(fullStatName);
                  
                  const saveMod = mods[stat] + (isSaveProficient ? proficiencyBonus : 0);
                  
                  return (
                    <button 
                      key={stat}
                      onClick={() => rollDice(`${stat.toUpperCase()} Save`, saveMod)}
                      className={`p-3 rounded-lg border flex justify-between items-center ${isSaveProficient ? 'bg-stone-800 border-yellow-600/50' : 'bg-stone-800/50 border-stone-700'}`}
                    >
                      <span className={`font-bold uppercase text-sm ${isSaveProficient ? 'text-yellow-500' : 'text-stone-400'}`}>{stat}</span>
                      <span className="font-mono text-stone-200">{saveMod >= 0 ? '+' : ''}{saveMod}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista de Skills */}
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> Skills
              </h3>
              <div className="bg-stone-800 rounded-xl border border-stone-700 divide-y divide-stone-700/50">
                {SKILLS.map((skill) => {
                  const mod = mods[skill.stat]; // Por ahora sin competencia (MVP)
                  return (
                    <div 
                      key={skill.name} 
                      onClick={() => rollDice(skill.name, mod)}
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-stone-700/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-stone-300 text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-stone-600 uppercase">({skill.stat})</span>
                      </div>
                      <span className="text-stone-400 font-mono text-sm">{mod >= 0 ? '+' : ''}{mod}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL DE RESULTADO (POPUP) */}
      {rollResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative text-center">
            <button onClick={() => setRollResult(null)} className="absolute top-4 right-4 text-stone-500 hover:text-white"><X /></button>
            <h3 className="text-stone-400 text-sm uppercase font-bold tracking-widest mb-4">{rollResult.title}</h3>
            
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 text-4xl font-bold
              ${rollResult.isCrit ? 'border-yellow-500 text-yellow-500 shadow-yellow-500/20 shadow-lg' : ''}
              ${rollResult.isFail ? 'border-red-600 text-red-600' : 'border-stone-600 text-stone-200'}
            `}>
              {rollResult.roll}
            </div>

            <div className="text-stone-500 text-sm mb-6 flex justify-center gap-2 items-center font-mono bg-stone-950/50 py-2 rounded-lg">
              <span>Roll {rollResult.roll}</span>
              <span>{rollResult.mod >= 0 ? '+' : '-'} {Math.abs(rollResult.mod)}</span>
              <span>=</span>
              <span className="text-xl font-bold text-stone-200">{rollResult.total}</span>
            </div>
            
            <button onClick={() => setRollResult(null)} className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}