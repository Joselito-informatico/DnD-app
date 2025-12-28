import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Shield,
  Sword,
  Zap,
  Heart,
  Brain,
  Eye,
  MessageCircle,
  User,
  ScrollText,
} from "lucide-react";
import { RACES, CLASSES } from "../data/srd";

export function CharacterCreator({ onBack, onSave }) {
  const [step, setStep] = useState(1);

  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [stats, setStats] = useState({
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  });

  // AHORA INCLUIMOS LOS 4 PILARES DE ROL
  const [details, setDetails] = useState({
    name: "",
    alignment: "",
    background: "",
    age: "",
    height: "",
    weight: "",
    eyes: "",
    skin: "",
    hair: "",
    traits: "", // Nuevo
    ideals: "", // Nuevo
    bonds: "", // Nuevo
    flaws: "", // Nuevo
  });

  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod > 0 ? `+${mod}` : mod;
  };

  const updateStat = (key, value) => {
    setStats((prev) => ({
      ...prev,
      [key]: Math.max(1, Math.min(20, prev[key] + value)),
    }));
  };

  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    else if (step === 2 && selectedClass) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) {
      let starterWeapons = [];
      if (selectedClass.id === "fighter") {
        starterWeapons.push({
          id: "w1",
          name: "Greatsword",
          type: "melee",
          damage: "2d6",
          stat: "str",
        });
        starterWeapons.push({
          id: "w2",
          name: "Handaxe",
          type: "thrown",
          damage: "1d6",
          stat: "str",
        });
      } else if (selectedClass.id === "rogue") {
        starterWeapons.push({
          id: "w1",
          name: "Rapier",
          type: "melee",
          damage: "1d8",
          stat: "dex",
        });
        starterWeapons.push({
          id: "w2",
          name: "Shortbow",
          type: "ranged",
          damage: "1d6",
          stat: "dex",
        });
      } else if (selectedClass.id === "wizard") {
        starterWeapons.push({
          id: "w1",
          name: "Quarterstaff",
          type: "melee",
          damage: "1d6",
          stat: "str",
        });
        starterWeapons.push({
          id: "s1",
          name: "Firebolt",
          type: "spell",
          damage: "1d10",
          stat: "int",
        });
      }

      const newHero = {
        name:
          details.name.trim() || `${selectedRace.name} ${selectedClass.name}`,
        race: selectedRace.name,
        class: selectedClass.name,
        stats: stats,
        weapons: starterWeapons,
        features: selectedClass.features || [],
        details: {
          ...details,
          background: details.background || "Unknown",
          alignment: details.alignment || "Neutral",
        },
      };

      onSave(newHero);
    }
  };

  const statConfig = [
    { id: "str", label: "Strength", icon: Sword, color: "text-red-400" },
    { id: "dex", label: "Dexterity", icon: Zap, color: "text-yellow-400" },
    { id: "con", label: "Constitution", icon: Heart, color: "text-orange-400" },
    { id: "int", label: "Intelligence", icon: Brain, color: "text-blue-400" },
    { id: "wis", label: "Wisdom", icon: Eye, color: "text-emerald-400" },
    {
      id: "cha",
      label: "Charisma",
      icon: MessageCircle,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-stone-400 hover:text-stone-100 transition"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-100">
              {step === 1 && "Choose Ancestry"}
              {step === 2 && "Choose Class"}
              {step === 3 && "Assign Abilities"}
              {step === 4 && "Identity & Details"}
            </h1>
            <p className="text-xs text-stone-500">Step {step} of 4</p>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 gap-4">
        {/* PASO 1, 2 y 3 (Se mantienen igual visualmente, lógica interna ya cargada arriba) */}
        {step === 1 &&
          RACES.map((race) => (
            <div
              key={race.id}
              onClick={() => setSelectedRace(race)}
              className={`p-4 rounded-xl border-2 transition cursor-pointer relative overflow-hidden ${
                selectedRace?.id === race.id
                  ? "bg-stone-800 border-yellow-500 shadow-lg shadow-yellow-500/10"
                  : "bg-stone-800/50 border-stone-700 hover:border-stone-600"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-stone-100">
                  {race.name}
                </h3>
                {selectedRace?.id === race.id && (
                  <div className="bg-yellow-500 text-black rounded-full p-1">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
              <p className="text-stone-400 text-sm mb-3">{race.description}</p>
              <div className="flex flex-wrap gap-2">
                {race.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs px-2 py-1 bg-stone-900 rounded border border-stone-700 text-stone-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ))}

        {step === 2 &&
          CLASSES.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                selectedClass?.id === cls.id
                  ? "bg-stone-800 border-yellow-500"
                  : "bg-stone-800/50 border-stone-700 hover:border-stone-600"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-stone-100">{cls.name}</h3>
                {cls.id === "fighter" && (
                  <Sword size={18} className="text-stone-500" />
                )}
                {cls.id === "rogue" && (
                  <Shield size={18} className="text-stone-500" />
                )}
                {cls.id === "wizard" && (
                  <Zap size={18} className="text-stone-500" />
                )}
              </div>
              <div className="text-sm text-stone-400 space-y-1">
                <p>
                  <span className="text-stone-500">Hit Die:</span> {cls.hitDie}
                </p>
                <p>
                  <span className="text-stone-500">Primary:</span>{" "}
                  {cls.primaryStat}
                </p>
              </div>
            </div>
          ))}

        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 mb-4 text-center">
              <p className="text-stone-400 text-sm">
                Use the buttons to set your rolled scores.
              </p>
            </div>
            {statConfig.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between bg-stone-800 p-3 rounded-xl border border-stone-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-stone-900 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-200">{stat.label}</p>
                    <p className="text-xs text-stone-500 font-mono">
                      MOD: {getMod(stats[stat.id])}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-stone-900 rounded-lg p-1">
                  <button
                    onClick={() => updateStat(stat.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 rounded transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl w-6 text-center">
                    {stats[stat.id]}
                  </span>
                  <button
                    onClick={() => updateStat(stat.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 rounded transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PASO 4: IDENTITY & PERSONALITY (ACTUALIZADO) */}
        {step === 4 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-2">
              <label className="text-sm font-bold text-stone-300 flex items-center gap-2">
                <User size={16} /> Character Name
              </label>
              <input
                type="text"
                placeholder="Ex: Valeros the Brave"
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {/* Físico y Trasfondo */}
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Alignment"
                  value={details.alignment}
                  onChange={(e) =>
                    setDetails({ ...details, alignment: e.target.value })
                  }
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 focus:border-yellow-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Background"
                  value={details.background}
                  onChange={(e) =>
                    setDetails({ ...details, background: e.target.value })
                  }
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 focus:border-yellow-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Age"
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.age}
                  onChange={(e) =>
                    setDetails({ ...details, age: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Height"
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.height}
                  onChange={(e) =>
                    setDetails({ ...details, height: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Weight"
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.weight}
                  onChange={(e) =>
                    setDetails({ ...details, weight: e.target.value })
                  }
                />
              </div>
            </div>

            {/* NUEVO: PERSONALITY SECTION */}
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                <ScrollText size={14} /> Roleplay Characteristics
              </h3>

              <textarea
                placeholder="Personality Traits (Ex: I always have a plan)"
                value={details.traits}
                onChange={(e) =>
                  setDetails({ ...details, traits: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />

              <textarea
                placeholder="Ideals (Ex: Freedom, Respect)"
                value={details.ideals}
                onChange={(e) =>
                  setDetails({ ...details, ideals: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />

              <textarea
                placeholder="Bonds (Ex: My sword belongs to my father)"
                value={details.bonds}
                onChange={(e) =>
                  setDetails({ ...details, bonds: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />

              <textarea
                placeholder="Flaws (Ex: I can't resist gold)"
                value={details.flaws}
                onChange={(e) =>
                  setDetails({ ...details, flaws: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-red-500/50"
              />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-neutral-900 via-neutral-900 to-transparent">
        <button
          onClick={handleNext}
          disabled={step === 1 ? !selectedRace : !selectedClass}
          className="w-full py-4 bg-yellow-500 text-stone-900 font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition flex items-center justify-center gap-2"
        >
          {step === 4 ? "Create Character Sheet" : "Next Step"}
          {step !== 4 && <ArrowLeft className="rotate-180" size={20} />}
        </button>
      </div>
    </div>
  );
}
