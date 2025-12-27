import { useState } from 'react';
import { ArrowLeft, Check, Shield, Sword, Zap, Heart, Brain, Eye, MessageCircle } from 'lucide-react';
import { RACES, CLASSES } from '../data/srd';

export function CharacterCreator({ onBack, onSave }) {
  const [step, setStep] = useState(1);
  
  // Estados de selección
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // NUEVO: Estado para los atributos (Empiezan en 10)
  const [stats, setStats] = useState({
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10
  });

  // Función auxiliar para calcular modificador visualmente
  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod > 0 ? `+${mod}` : mod;
  };

  // Función para cambiar atributos
  const updateStat = (key, value) => {
    setStats(prev => ({ ...prev, [key]: Math.max(1, Math.min(20, prev[key] + value)) }));
  };

  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    else if (step === 2 && selectedClass) setStep(3);
    else if (step === 3) {
      
      // 1. DEFINIMOS EL EQUIPO INICIAL SEGÚN LA CLASE
      let starterWeapons = [];
      
      if (selectedClass.id === 'fighter') {
        starterWeapons.push({ id: 'w1', name: 'Greatsword', type: 'melee', damage: '2d6', stat: 'str' });
        starterWeapons.push({ id: 'w2', name: 'Handaxe', type: 'thrown', damage: '1d6', stat: 'str' });
      } else if (selectedClass.id === 'rogue') {
        starterWeapons.push({ id: 'w1', name: 'Rapier', type: 'melee', damage: '1d8', stat: 'dex' }); // Finesse usa Dex
        starterWeapons.push({ id: 'w2', name: 'Shortbow', type: 'ranged', damage: '1d6', stat: 'dex' });
      } else if (selectedClass.id === 'wizard') {
        starterWeapons.push({ id: 'w1', name: 'Quarterstaff', type: 'melee', damage: '1d6', stat: 'str' });
        starterWeapons.push({ id: 's1', name: 'Firebolt', type: 'spell', damage: '1d10', stat: 'int' }); // Hechizo básico
      }

      // 2. CREAMOS EL HÉROE CON SU INVENTARIO
      const newHero = {
        name: `${selectedRace.name} ${selectedClass.name}`,
        race: selectedRace.name,
        class: selectedClass.name,
        stats: stats,
        weapons: starterWeapons // <--- Guardamos las armas aquí
      };
      
      onSave(newHero); 
    }
  };

  // Configuración visual de los atributos
  const statConfig = [
    { id: 'str', label: 'Strength', icon: Sword, color: 'text-red-400' },
    { id: 'dex', label: 'Dexterity', icon: Zap, color: 'text-yellow-400' },
    { id: 'con', label: 'Constitution', icon: Heart, color: 'text-orange-400' },
    { id: 'int', label: 'Intelligence', icon: Brain, color: 'text-blue-400' },
    { id: 'wis', label: 'Wisdom', icon: Eye, color: 'text-emerald-400' },
    { id: 'cha', label: 'Charisma', icon: MessageCircle, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-100">
              {step === 1 && "Choose Ancestry"}
              {step === 2 && "Choose Class"}
              {step === 3 && "Assign Abilities"}
            </h1>
            <p className="text-xs text-stone-500">Step {step} of 3</p>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* PASO 1: RAZAS */}
        {step === 1 && RACES.map((race) => (
          <div 
            key={race.id}
            onClick={() => setSelectedRace(race)}
            className={`p-4 rounded-xl border-2 transition cursor-pointer relative overflow-hidden ${
              selectedRace?.id === race.id 
                ? 'bg-stone-800 border-yellow-500 shadow-lg shadow-yellow-500/10' 
                : 'bg-stone-800/50 border-stone-700 hover:border-stone-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-stone-100">{race.name}</h3>
              {selectedRace?.id === race.id && <div className="bg-yellow-500 text-black rounded-full p-1"><Check size={14} strokeWidth={3} /></div>}
            </div>
            <p className="text-stone-400 text-sm mb-3">{race.description}</p>
            <div className="flex flex-wrap gap-2">
              {race.traits.map(trait => (
                <span key={trait} className="text-xs px-2 py-1 bg-stone-900 rounded border border-stone-700 text-stone-300">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* PASO 2: CLASES */}
        {step === 2 && CLASSES.map((cls) => (
          <div 
            key={cls.id}
            onClick={() => setSelectedClass(cls)}
            className={`p-4 rounded-xl border-2 transition cursor-pointer ${
              selectedClass?.id === cls.id 
                ? 'bg-stone-800 border-yellow-500' 
                : 'bg-stone-800/50 border-stone-700 hover:border-stone-600'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-stone-100">{cls.name}</h3>
              {cls.id === 'fighter' && <Sword size={18} className="text-stone-500" />}
              {cls.id === 'rogue' && <Shield size={18} className="text-stone-500" />}
              {cls.id === 'wizard' && <Zap size={18} className="text-stone-500" />}
            </div>
            <div className="text-sm text-stone-400 space-y-1">
              <p><span className="text-stone-500">Hit Die:</span> {cls.hitDie}</p>
              <p><span className="text-stone-500">Primary:</span> {cls.primaryStat}</p>
            </div>
          </div>
        ))}

        {/* PASO 3: ATRIBUTOS (NUEVO) */}
        {step === 3 && (
          <div className="space-y-3">
             <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 mb-4 text-center">
                <p className="text-stone-400 text-sm">Use the buttons to set your rolled scores.</p>
             </div>
             
             {statConfig.map((stat) => (
               <div key={stat.id} className="flex items-center justify-between bg-stone-800 p-3 rounded-xl border border-stone-700">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg bg-stone-900 ${stat.color}`}>
                     <stat.icon size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-stone-200">{stat.label}</p>
                     <p className="text-xs text-stone-500 font-mono">MOD: {getMod(stats[stat.id])}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 bg-stone-900 rounded-lg p-1">
                   <button 
                    onClick={() => updateStat(stat.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 rounded transition"
                   >-</button>
                   <span className="font-bold text-xl w-6 text-center">{stats[stat.id]}</span>
                   <button 
                    onClick={() => updateStat(stat.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 rounded transition"
                   >+</button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* FOOTER BUTTON */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-neutral-900 via-neutral-900 to-transparent">
        <button
          onClick={handleNext}
          disabled={step === 1 ? !selectedRace : !selectedClass}
          className="w-full py-4 bg-yellow-500 text-stone-900 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition flex items-center justify-center gap-2"
        >
          {step === 3 ? "Complete Hero" : "Next Step"} 
          {step !== 3 && <ArrowLeft className="rotate-180" size={20} />}
        </button>
      </div>

    </div>
  );
}