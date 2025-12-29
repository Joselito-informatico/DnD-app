import { useState, useEffect } from "react";
// AQUI ESTABA EL ERROR: Faltaba Trash2 en la lista de abajo
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
  Sparkles,
  Image as ImageIcon,
  Search,
  BookOpen,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { RACES, CLASSES } from "../data/srd";
import { getRandomDetails } from "../utils/randomizer";
import { useLanguage } from "../context/LanguageContext";
import { searchSpells } from "../utils/dndApi";

export function CharacterCreator({ onBack, onSave }) {
  const { t } = useLanguage();

  // Pasos: 1. Raza, 2. Clase, 3. Stats, 4. Hechizos (Opcional), 5. Detalles
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

  // Estado para hechizos iniciales
  const [startingSpells, setStartingSpells] = useState([]);
  const [spellQuery, setSpellQuery] = useState("");
  const [spellResults, setSpellResults] = useState([]);
  const [isSearchingSpell, setIsSearchingSpell] = useState(false);

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
    traits: "",
    ideals: "",
    bonds: "",
    flaws: "",
    avatar: "",
  });

  // Detectar si la clase es mágica para habilitar el paso 4
  const isCaster = selectedClass?.spellcasting !== undefined;

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

  const handleAutoFill = () => {
    const random = getRandomDetails();
    setDetails((prev) => ({
      ...random,
      name: prev.name || random.name,
      avatar: prev.avatar,
    }));
  };

  // --- LÓGICA DE BÚSQUEDA DE HECHIZOS ---
  const handleSpellSearch = async () => {
    if (!spellQuery) return;
    setIsSearchingSpell(true);
    const results = await searchSpells(spellQuery);
    setSpellResults(results);
    setIsSearchingSpell(false);
  };

  const addStarterSpell = (spell) => {
    // Evitar duplicados
    if (startingSpells.some((s) => s.name === spell.name)) return;

    const newSpell = {
      id: Date.now(),
      name: spell.name,
      level: spell.level,
      school: spell.school,
      desc: spell.desc,
      time: spell.time,
    };
    setStartingSpells([...startingSpells, newSpell]);
    setSpellResults([]);
    setSpellQuery("");
  };

  const removeStarterSpell = (id) => {
    setStartingSpells(startingSpells.filter((s) => s.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    else if (step === 2 && selectedClass) {
      setStep(3);
    } else if (step === 3) {
      // Si es mago, vamos al paso 4 (Hechizos), si no, al paso final (Detalles)
      if (isCaster) setStep(4);
      else setStep(5); // Saltamos el 4
    } else if (step === 4 && isCaster) setStep(5);
    else if (step === 5 || (!isCaster && step === 4)) {
      finishCreation();
    }
  };

  const finishCreation = () => {
    // 1. CALCULAR HP
    const hitDieMax = parseInt(selectedClass.hitDie.substring(1));
    const conMod = Math.floor((stats.con - 10) / 2);
    const startHP = Math.max(1, hitDieMax + conMod);

    // 2. EQUIPO INICIAL
    let starterInventory = [];
    let starterWeapons = [];

    if (selectedClass.startingEquipment) {
      selectedClass.startingEquipment.forEach((item, index) => {
        starterInventory.push({
          id: Date.now() + index,
          name: item.name,
          qty: item.qty || 1,
          desc:
            item.type === "armor"
              ? `AC ${item.ac}`
              : item.type === "weapon"
              ? `${item.damage}`
              : "",
        });

        if (item.type === "weapon") {
          starterWeapons.push({
            id: Date.now() + index + 100,
            name: item.name,
            type: "melee",
            damage: item.damage,
            stat: item.stat,
          });
        }
      });
    }

    // 3. MAGIA
    const spellSlots = selectedClass.spellcasting
      ? selectedClass.spellcasting.slots
      : {};

    // 4. OBJETO FINAL
    const newHero = {
      name: details.name.trim() || `${selectedRace.name} ${selectedClass.name}`,
      race: selectedRace.name,
      class: selectedClass.name,
      level: 1,
      xp: 0,
      stats: stats,
      currentHP: startHP,
      maxHP: startHP,
      weapons: starterWeapons,
      inventory: starterInventory,
      spellSlots: spellSlots,
      spells: startingSpells, // <--- HECHIZOS ELEGIDOS
      features: selectedClass.features || [],
      saveProficiencies: selectedClass.saves,
      details: {
        ...details,
        background: details.background || "Unknown",
        alignment: details.alignment || "Neutral",
      },
    };

    onSave(newHero);
  };

  // Títulos dinámicos de los pasos
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return t("step1");
      case 2:
        return t("step2");
      case 3:
        return t("step3");
      case 4:
        return isCaster ? t("cantrips") + " & Spells" : "Error";
      case 5:
        return t("step4"); // Identity
      default:
        return "";
    }
  };

  const statConfig = [
    { id: "str", label: t("str"), icon: Sword, color: "text-red-400" },
    { id: "dex", label: t("dex"), icon: Zap, color: "text-yellow-400" },
    { id: "con", label: t("con"), icon: Heart, color: "text-orange-400" },
    { id: "int", label: t("int"), icon: Brain, color: "text-blue-400" },
    { id: "wis", label: t("wis"), icon: Eye, color: "text-emerald-400" },
    {
      id: "cha",
      label: t("cha"),
      icon: MessageCircle,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24 px-6 pt-6">
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
              {getStepTitle()}
            </h1>
            <p className="text-xs text-stone-500">
              {t("level")} {isCaster && step === 5 ? "4" : step} /{" "}
              {isCaster ? 5 : 4}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {/* PASO 1: RAZA */}
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

        {/* PASO 2: CLASE */}
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
                  {cls.primaryStat.toUpperCase()}
                </p>
              </div>
            </div>
          ))}

        {/* PASO 3: STATS */}
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

        {/* PASO 4: HECHIZOS (SOLO CASTERS) */}
        {step === 4 && isCaster && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 mb-2 text-center">
              <p className="text-stone-400 text-sm">
                Search and add your starting Cantrips & Lvl 1 Spells.
              </p>
            </div>

            {/* Buscador */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-stone-800 border border-stone-600 rounded-lg p-3 focus-within:border-yellow-500">
                <Search size={18} className="text-stone-500" />
                <input
                  type="text"
                  placeholder="Fireball, Cure Wounds..."
                  className="bg-transparent w-full text-sm text-stone-100 outline-none"
                  value={spellQuery}
                  onChange={(e) => setSpellQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSpellSearch()}
                />
                <button
                  onClick={handleSpellSearch}
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-500 uppercase"
                >
                  {isSearchingSpell ? "..." : "SEARCH"}
                </button>
              </div>
              {/* Resultados */}
              {spellResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-stone-800 border border-stone-600 rounded-b-lg shadow-xl z-20 max-h-48 overflow-y-auto mt-1">
                  {spellResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => addStarterSpell(res)}
                      className="w-full text-left p-3 text-sm text-stone-300 hover:bg-stone-700 border-b border-stone-700/50 last:border-0 flex justify-between items-center"
                    >
                      <span>{res.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 text-xs">
                          {res.level === 0 ? "Cantrip" : `Lvl ${res.level}`}
                        </span>
                        <Plus size={14} className="text-yellow-500" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de Elegidos */}
            <div className="space-y-2">
              {startingSpells.map((spell) => (
                <div
                  key={spell.id}
                  className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex justify-between items-center group"
                >
                  <div>
                    <p className="font-bold text-stone-200 text-sm">
                      {spell.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} •{" "}
                      {spell.school}
                    </p>
                  </div>
                  {/* AQUÍ ESTABA EL ERROR: Trash2 ahora está importado */}
                  <button
                    onClick={() => removeStarterSpell(spell.id)}
                    className="p-2 text-stone-500 hover:text-red-500 bg-stone-900 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {startingSpells.length === 0 && (
                <div className="text-center py-8 text-stone-600 italic border-2 border-dashed border-stone-800 rounded-xl">
                  Spellbook is empty.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 5: DETALLES */}
        {((isCaster && step === 5) || (!isCaster && step === 4)) && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex justify-end">
              <button
                onClick={handleAutoFill}
                className="flex items-center gap-2 text-xs bg-purple-900/30 text-purple-400 border border-purple-500/50 px-3 py-2 rounded-lg hover:bg-purple-900/50 transition"
              >
                <Sparkles size={14} /> {t("autoFill")}
              </button>
            </div>

            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-900 rounded-full flex-shrink-0 border-2 border-stone-600 overflow-hidden flex items-center justify-center">
                  {details.avatar ? (
                    <img
                      src={details.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <ImageIcon className="text-stone-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">
                    {t("avatarLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("avatarPlaceholder")}
                    value={details.avatar}
                    onChange={(e) =>
                      setDetails({ ...details, avatar: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-2">
              <label className="text-sm font-bold text-stone-300 flex items-center gap-2">
                <User size={16} /> {t("charName")}
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
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t("alignment")}
                  value={details.alignment}
                  onChange={(e) =>
                    setDetails({ ...details, alignment: e.target.value })
                  }
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 focus:border-yellow-500 outline-none"
                />
                <input
                  type="text"
                  placeholder={t("background")}
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
                  placeholder={t("age")}
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.age}
                  onChange={(e) =>
                    setDetails({ ...details, age: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder={t("height")}
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.height}
                  onChange={(e) =>
                    setDetails({ ...details, height: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder={t("weight")}
                  className="bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none"
                  value={details.weight}
                  onChange={(e) =>
                    setDetails({ ...details, weight: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                <ScrollText size={14} /> {t("roleplayTitle")}
              </h3>
              <textarea
                placeholder={t("traits")}
                value={details.traits}
                onChange={(e) =>
                  setDetails({ ...details, traits: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />
              <textarea
                placeholder={t("ideals")}
                value={details.ideals}
                onChange={(e) =>
                  setDetails({ ...details, ideals: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />
              <textarea
                placeholder={t("bonds")}
                value={details.bonds}
                onChange={(e) =>
                  setDetails({ ...details, bonds: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 h-16 resize-none outline-none focus:border-yellow-500"
              />
              <textarea
                placeholder={t("flaws")}
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
          {(isCaster && step === 5) || (!isCaster && step === 4)
            ? t("complete")
            : t("next")}{" "}
          {((isCaster && step !== 5) || (!isCaster && step !== 4)) && (
            <ArrowLeft className="rotate-180" size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
