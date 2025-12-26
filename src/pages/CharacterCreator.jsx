import { useState } from 'react';
import { ArrowLeft, Check, Shield, Sword, Zap } from 'lucide-react';
import { RACES, CLASSES } from '../data/srd';

export function CharacterCreator({ onBack }) {
  // Estado para saber en qué paso estamos: 1 = Raza, 2 = Clase
  const [step, setStep] = useState(1);
  
  // Estados para guardar lo que el usuario elige
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Función para avanzar paso a paso
  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    // Aquí añadiremos más pasos luego
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      
      {/* 1. Barra de Navegación Superior */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-stone-400 hover:text-stone-100 transition">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-100">
              {step === 1 ? "Choose Ancestry" : "Choose Class"}
            </h1>
            <p className="text-xs text-stone-500">Step {step} of 2</p>
          </div>
        </div>
      </header>

      {/* 2. Contenido Principal (Cambia según el paso) */}
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
              {/* Icono decorativo según la clase */}
              {cls.id === 'fighter' && <Sword size={18} className="text-stone-500" />}
              {cls.id === 'rogue' && <Shield size={18} className="text-stone-500" />}
              {cls.id === 'wizard' && <Zap size={18} className="text-stone-500" />}
            </div>
            <div className="text-sm text-stone-400 space-y-1">
              <p><span className="text-stone-500">Hit Die:</span> {cls.hitDie}</p>
              <p><span className="text-stone-500">Primary:</span> {cls.primaryStat}</p>
              <p><span className="text-stone-500">Saves:</span> {cls.saves.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Botón "Siguiente" Flotante */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-neutral-900 via-neutral-900 to-transparent">
        <button
          onClick={handleNext}
          disabled={step === 1 ? !selectedRace : !selectedClass}
          className="w-full py-4 bg-yellow-500 text-stone-900 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition flex items-center justify-center gap-2"
        >
          {step === 2 ? "Finish (Por ahora)" : "Next Step"} <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>

    </div>
  );
}