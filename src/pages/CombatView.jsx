import { useState } from 'react';
import { ArrowLeft, Shield, Heart, Zap, Sword, X, Activity, Settings, Moon, Trash2, User, ScrollText, Backpack, Plus, Flame, BookOpen } from 'lucide-react';
import { CLASSES, SKILLS, SPELLS } from '../data/srd';

export function CombatView({ hero, onBack, onUpdateHero, onDeleteHero }) {
  const [activeTab, setActiveTab] = useState('combat');
  const [rollResult, setRollResult] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  // --- REGLAS & CALCULOS ---
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = 2;

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

  const heroClassData = CLASSES.find(c => c.name === hero.class);
  const saveProficiencies = heroClassData ? heroClassData.saves : [];

  // DATOS PERSISTENTES
  const weapons = hero.weapons || [{ id: 'def', name: 'Unarmed', type: 'melee', damage: '1', stat: 'str' }];
  const details = hero.details || { alignment: 'Unknown', background: 'Unknown' };
  const inventory = hero.inventory || []; 
  const money = hero.money || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  
  // MAGIA (NUEVO)
  const spellSlots = hero.spellSlots || { 1: { total: 2, used: 0 } }; // Por defecto 2 slots de nivel 1
  // Detectar atributo mágico según clase (simplificado)
  const spellCastingStat = hero.class === 'Wizard' ? 'int' : (hero.class === 'Bard' ? 'cha' : 'wis');
  const spellAttackBonus = mods[spellCastingStat] + proficiencyBonus;
  const spellSaveDC = 8 + proficiencyBonus + mods[spellCastingStat];

  // --- ACCIONES ---
  const handleLongRest = () => {
    // Restaurar HP y Slots
    const resetSlots = { ...spellSlots };
    Object.keys(resetSlots).forEach(level => resetSlots[level].used = 0);
    
    onUpdateHero({ ...hero, currentHP: maxHP, spellSlots: resetSlots });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this hero permanently?")) {
      onDeleteHero(hero.id);
    }
  };

  const updateMoney = (currency, value) => {
    const newMoney = { ...money, [currency]: parseInt(value) || 0 };
    onUpdateHero({ ...hero, money: newMoney });
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem = { id: Date.now(), name: newItemName, qty: 1 };
    onUpdateHero({ ...hero, inventory: [...inventory, newItem] });
    setNewItemName("");
  };

  const removeItem = (itemId) => {
    onUpdateHero({ ...hero, inventory: inventory.filter(i => i.id !== itemId) });
  };

  const toggleSlot = (level, slotIndex) => {
    const currentLevel = spellSlots[level] || { total: 0, used: 0 };
    // Si clicamos un slot usado, lo recuperamos. Si está libre, lo gastamos.
    // Lógica visual: SlotIndex < Used => Está gastado.
    const isUsed = slotIndex < currentLevel.used;
    
    const newUsed = isUsed ? currentLevel.used - 1 : currentLevel.used + 1;
    const newSlots = { ...spellSlots, [level]: { ...currentLevel, used: Math.max(0, Math.min(currentLevel.total, newUsed)) } };
    onUpdateHero({ ...hero, spellSlots: newSlots });
  };

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
    <div className="flex flex-col h-screen bg-neutral-900 pb-20 relative">
      
      {/* HEADER & MENU (Igual) */}
      <header className="flex items-center justify-between p-6 pb-2 bg-neutral-900 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition"><ArrowLeft /></button>
          <div><h1 className="text-xl font-bold text-stone-100">{hero.name}</h1><p className="text-xs text-stone-500">Lvl {hero.level} {hero.race} {hero.class}</p></div>
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition ${showMenu ? 'bg-yellow-500 text-stone-900' : 'text-stone-400 hover:bg-stone-800'}`}><Settings size={20} /></button>
      </header>

      {/* MENÚ OVERLAY */}
      {showMenu && (
        <div className="absolute top-20 right-6 z-20 w-48 bg-stone-800 border border-stone-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <button onClick={handleLongRest} className="w-full text-left px-4 py-3 text-stone-200 hover:bg-stone-700 flex items-center gap-3 border-b border-stone-700/50"><Moon size={16} className="text-blue-400" /> Long Rest (Heal)</button>
          <button onClick={handleDelete} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 flex items-center gap-3"><Trash2 size={16} /> Delete Hero</button>
        </div>
      )}

      {/* TABS (5 PESTAÑAS) */}
      <div className="flex px-4 border-b border-stone-800 mb-4 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('combat')} className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${activeTab === 'combat' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}>COMBAT</button>
        <button onClick={() => setActiveTab('skills')} className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${activeTab === 'skills' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}>SKILLS</button>
        <button onClick={() => setActiveTab('spells')} className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${activeTab === 'spells' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}>SPELLS</button>
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${activeTab === 'inventory' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}>EQUIP</button>
        <button onClick={() => setActiveTab('profile')} className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${activeTab === 'profile' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-stone-500'}`}>PROFILE</button>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-24" onClick={() => setShowMenu(false)}>
        
        {/* === COMBAT === */}
        {activeTab === 'combat' && (
          <div className="space-y-6 animate-in slide-in-from-left duration-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center"><Shield className="text-stone-600 mb-1 w-5 h-5" /><span className="text-xs text-stone-400 font-bold uppercase">AC</span><span className="text-2xl font-bold text-stone-100">{armorClass}</span></div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center"><Zap className="text-yellow-600 mb-1 w-5 h-5" /><span className="text-xs text-stone-400 font-bold uppercase">Init</span><span className="text-2xl font-bold text-yellow-500">{initiative}</span></div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center"><Heart className="text-red-500 mb-1 w-5 h-5" /><span className="text-xs text-stone-400 font-bold uppercase">HP</span><span className="text-xl font-bold text-stone-100">{currentHP}</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => changeHP(-1)} className="flex-1 py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg font-bold hover:bg-red-900/40">- DMG</button>
              <button onClick={() => changeHP(1)} className="flex-1 py-3 bg-green-900/20 text-green-400 border border-green-900/50 rounded-lg font-bold hover:bg-green-900/40">+ HEAL</button>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider">Attacks</h3>
              <div className="space-y-2">
                {weapons.map((w) => {
                  const mod = mods[w.stat] + proficiencyBonus;
                  return (
                    <div key={w.id} onClick={() => rollDice(`${w.name} Attack`, mod)} className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="bg-stone-900 p-2 rounded-lg text-stone-500"><Sword size={20} /></div>
                        <div><h4 className="font-bold text-stone-200">{w.name}</h4><p className="text-xs text-stone-500">{w.damage} {w.stat.toUpperCase()}</p></div>
                      </div>
                      <div className="bg-stone-900 px-3 py-1 rounded-lg font-bold text-stone-300">+{mod}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === SKILLS === */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
             <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><Shield size={16} /> Saving Throws</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(mods).map((stat) => {
                  const fullStatName = {str:'Strength', dex:'Dexterity', con:'Constitution', int:'Intelligence', wis:'Wisdom', cha:'Charisma'}[stat];
                  const isSaveProficient = saveProficiencies.includes(fullStatName);
                  const saveMod = mods[stat] + (isSaveProficient ? proficiencyBonus : 0);
                  return (
                    <button key={stat} onClick={() => rollDice(`${stat.toUpperCase()} Save`, saveMod)} className={`p-3 rounded-lg border flex justify-between items-center ${isSaveProficient ? 'bg-stone-800 border-yellow-600/50' : 'bg-stone-800/50 border-stone-700'}`}>
                      <span className={`font-bold uppercase text-sm ${isSaveProficient ? 'text-yellow-500' : 'text-stone-400'}`}>{stat}</span>
                      <span className="font-mono text-stone-200">{saveMod >= 0 ? '+' : ''}{saveMod}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><Activity size={16} /> Skills</h3>
              <div className="bg-stone-800 rounded-xl border border-stone-700 divide-y divide-stone-700/50">
                {SKILLS.map((skill) => {
                  const mod = mods[skill.stat];
                  return (
                    <div key={skill.name} onClick={() => rollDice(skill.name, mod)} className="p-3 flex justify-between items-center cursor-pointer hover:bg-stone-700/50 transition">
                      <div className="flex items-center gap-3"><span className="text-stone-300 text-sm font-medium">{skill.name}</span><span className="text-xs text-stone-600 uppercase">({skill.stat})</span></div>
                      <span className="text-stone-400 font-mono text-sm">{mod >= 0 ? '+' : ''}{mod}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === SPELLS (NUEVO) === */}
        {activeTab === 'spells' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            
            {/* Header Mágico (Page 3 Header) */}
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center border-r border-stone-700">
                <span className="text-[10px] uppercase font-bold text-stone-500">Spell Save DC</span>
                <span className="text-2xl font-bold text-stone-100">{spellSaveDC}</span>
                <span className="text-[10px] text-stone-600">8 + Prof + {spellCastingStat.toUpperCase()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-stone-500">Attack Bonus</span>
                <span className="text-2xl font-bold text-yellow-500">+{spellAttackBonus}</span>
                <span className="text-[10px] text-stone-600">Prof + {spellCastingStat.toUpperCase()}</span>
              </div>
            </div>

            {/* Slots de Nivel 1 */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-stone-400 font-bold text-sm uppercase flex items-center gap-2"><Flame size={16} /> Level 1 Slots</h3>
                <span className="text-xs text-stone-500">{spellSlots[1]?.used || 0} / {spellSlots[1]?.total || 0} Used</span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: spellSlots[1]?.total || 0 }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => toggleSlot(1, i)}
                    className={`w-8 h-8 rounded-full border-2 transition ${i < (spellSlots[1]?.used || 0) ? 'bg-stone-900 border-stone-700' : 'bg-yellow-500 border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]'}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Lista de Conjuros */}
            <div className="space-y-4">
               {/* Cantrips */}
               <div>
                  <h3 className="text-stone-500 font-bold text-xs uppercase mb-2">Cantrips (0)</h3>
                  <div className="space-y-2">
                    {SPELLS.filter(s => s.level === 0).map(spell => (
                      <div key={spell.id} className="bg-stone-800 p-3 rounded-lg border border-stone-700 flex justify-between items-center group cursor-pointer hover:border-yellow-500/50" onClick={() => rollDice(`${spell.name}`, spellAttackBonus)}>
                        <div>
                          <p className="font-bold text-stone-200 text-sm">{spell.name}</p>
                          <p className="text-[10px] text-stone-500">{spell.school} • {spell.time}</p>
                        </div>
                        <BookOpen size={16} className="text-stone-600 group-hover:text-yellow-500" />
                      </div>
                    ))}
                  </div>
               </div>

               {/* Level 1 */}
               <div>
                  <h3 className="text-stone-500 font-bold text-xs uppercase mb-2">Level 1</h3>
                  <div className="space-y-2">
                    {SPELLS.filter(s => s.level === 1).map(spell => (
                      <div key={spell.id} className="bg-stone-800 p-3 rounded-lg border border-stone-700 flex justify-between items-center group cursor-pointer hover:border-yellow-500/50" onClick={() => rollDice(`${spell.name}`, spellAttackBonus)}>
                        <div>
                          <p className="font-bold text-stone-200 text-sm">{spell.name}</p>
                          <p className="text-[10px] text-stone-500">{spell.desc}</p>
                        </div>
                         {/* Botón para lanzar dado si es de ataque */}
                         {spell.desc.includes('damage') && (
                           <div className="bg-stone-900 px-2 py-1 rounded text-xs font-bold text-stone-400 group-hover:text-yellow-500">
                             Roll
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        )}

        {/* === INVENTORY === */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
              <h3 className="text-stone-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><span className="text-yellow-500">●</span> Currency</h3>
              <div className="grid grid-cols-5 gap-2">
                {['cp', 'sp', 'ep', 'gp', 'pp'].map((coin) => (
                  <div key={coin} className="flex flex-col items-center">
                     <label className="text-[10px] uppercase font-bold text-stone-500 mb-1">{coin}</label>
                     <input type="number" value={money[coin]} onChange={(e) => updateMoney(coin, e.target.value)} className="w-full bg-stone-900 border border-stone-600 rounded-lg p-1 text-center text-sm font-bold text-stone-200 focus:border-yellow-500 outline-none" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><Backpack size={16} /> Equipment</h3>
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Add item..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-500 focus:border-yellow-500 outline-none" />
                <button onClick={addItem} className="bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-200 w-12 rounded-xl flex items-center justify-center transition"><Plus /></button>
              </div>
              <div className="space-y-2">
                {inventory.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700/50 hover:bg-stone-800 transition">
                    <span className="text-stone-200">{item.name}</span>
                    <button onClick={() => removeItem(item.id)} className="text-stone-600 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === PROFILE === */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="bg-stone-800 p-5 rounded-xl border border-stone-700">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-700">
                <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center border-2 border-yellow-500/50"><User size={32} className="text-stone-400" /></div>
                <div><h2 className="text-xl font-bold text-stone-100">{hero.name}</h2><p className="text-stone-400 text-sm">{details.alignment} {hero.race} {hero.class}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-stone-500 uppercase font-bold">Background</span><p className="text-stone-200">{details.background || 'Unknown'}</p></div>
                <div><span className="text-xs text-stone-500 uppercase font-bold">Experience</span><p className="text-stone-200">0 XP</p></div>
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"><Settings size={16} /> Appearance</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Age</span><span className="text-sm font-bold text-stone-200">{details.age || '--'}</span></div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Height</span><span className="text-sm font-bold text-stone-200">{details.height || '--'}</span></div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Weight</span><span className="text-sm font-bold text-stone-200">{details.weight || '--'}</span></div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Eyes</span><span className="text-sm font-bold text-stone-200">{details.eyes || '--'}</span></div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Skin</span><span className="text-sm font-bold text-stone-200">{details.skin || '--'}</span></div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700"><span className="block text-[10px] text-stone-500 uppercase">Hair</span><span className="text-sm font-bold text-stone-200">{details.hair || '--'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL RESULTADOS (IGUAL) */}
      {rollResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative text-center">
            <button onClick={() => setRollResult(null)} className="absolute top-4 right-4 text-stone-500 hover:text-white"><X /></button>
            <h3 className="text-stone-400 text-sm uppercase font-bold tracking-widest mb-4">{rollResult.title}</h3>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 text-4xl font-bold ${rollResult.isCrit ? 'border-yellow-500 text-yellow-500 shadow-yellow-500/20 shadow-lg' : ''} ${rollResult.isFail ? 'border-red-600 text-red-600' : 'border-stone-600 text-stone-200'}`}>{rollResult.roll}</div>
            <div className="text-stone-500 text-sm mb-6 flex justify-center gap-2 items-center font-mono bg-stone-950/50 py-2 rounded-lg"><span>Roll {rollResult.roll}</span><span>{rollResult.mod >= 0 ? '+' : '-'} {Math.abs(rollResult.mod)}</span><span>=</span><span className="text-xl font-bold text-stone-200">{rollResult.total}</span></div>
            <button onClick={() => setRollResult(null)} className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}