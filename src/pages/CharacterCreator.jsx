import { useState, useEffect } from "react";
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
  Dices,
  RotateCcw,
} from "lucide-react";
import { RACES, CLASSES } from "../data/srd";
import { getRandomDetails } from "../utils/randomizer";
import { useLanguage } from "../context/LanguageContext";
import { searchSpells } from "../utils/dndApi";

export function CharacterCreator({ onBack, onSave }) {
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // STATS: Guardamos la BASE (sin bonos raciales)
  const [baseStats, setBaseStats] = useState({
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  });
  const [rolledPool, setRolledPool] = useState([]); // Almacena los resultados de los dados

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

  const isCaster = selectedClass?.spellcasting !== undefined;

  // --- LÓGICA DE DADOS (5d6 drop lowest 2) ---
  const rollAttributePool = () => {
    const newPool = Array.from({ length: 6 }, () => {
      // Tirar 5 dados de 6 caras
      const rolls = Array.from(
        { length: 5 },
        () => Math.floor(Math.random() * 6) + 1
      );
      // Ordenar descendente (Mayores primero)
      rolls.sort((a, b) => b - a);
      // Tomar los 3 mejores y sumar
      return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
    });
    setRolledPool(newPool);
    // Resetear stats a 0 para obligar a asignar
    setBaseStats({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
  };

  const assignFromPool = (value, statKey) => {
    // Asignar valor al stat
    setBaseStats((prev) => ({ ...prev, [statKey]: value }));
    // Eliminar ese valor del pool (visualmente lo marcaremos como usado)
    const index = rolledPool.indexOf(value);
    if (index > -1) {
      const newPool = [...rolledPool];
      newPool.splice(index, 1); // Lo quitamos del pool disponible
      setRolledPool(newPool);
    }
  };

  const updateBaseStat = (key, value) => {
    // Edición manual (Límite 18 por reglas de dados)
    const newVal = parseInt(value) || 0;
    setBaseStats((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(18, newVal)),
    }));
  };

  // Obtener el bono racial para una stat específica
  const getRaceBonus = (statKey) => {
    if (!selectedRace || !selectedRace.bonuses) return 0;
    return selectedRace.bonuses[statKey] || 0;
  };

  // Calcular el total final (Base + Raza)
  const getTotalStat = (statKey) => {
    return baseStats[statKey] + getRaceBonus(statKey);
  };

  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod > 0 ? `+${mod}` : mod;
  };

  const handleAutoFill = () => {
    const random = getRandomDetails();
    setDetails((prev) => ({
      ...random,
      name: prev.name || random.name,
      avatar: prev.avatar,
    }));
  };

  // --- LÓGICA HECHIZOS ---
  const handleSpellSearch = async () => {
    if (!spellQuery) return;
    setIsSearchingSpell(true);
    const results = await searchSpells(spellQuery);
    setSpellResults(results);
    setIsSearchingSpell(false);
  };

  const addStarterSpell = (spell) => {
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
    else if (step === 2 && selectedClass) setStep(3);
    else if (step === 3) {
      // Validar que no haya stats en 0
      if (Object.values(baseStats).some((val) => val === 0)) {
        if (!confirm("Some stats are 0. Continue anyway?")) return;
      }
      if (isCaster) setStep(4);
      else setStep(5);
    } else if (step === 4 && isCaster) setStep(5);
    else if (step === 5 || (!isCaster && step === 4)) {
      finishCreation();
    }
  };

  const finishCreation = () => {
    // Calcular stats finales
    const finalStats = {
      str: getTotalStat("str"),
      dex: getTotalStat("dex"),
      con: getTotalStat("con"),
      int: getTotalStat("int"),
      wis: getTotalStat("wis"),
      cha: getTotalStat("cha"),
    };

    const hitDieMax = parseInt(selectedClass.hitDie.substring(1));
    const conMod = Math.floor((finalStats.con - 10) / 2);
    const startHP = Math.max(1, hitDieMax + conMod);

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

    const spellSlots = selectedClass.spellcasting
      ? selectedClass.spellcasting.slots
      : {};

    const newHero = {
      name: details.name.trim() || `${selectedRace.name} ${selectedClass.name}`,
      race: selectedRace.name,
      class: selectedClass.name,
      level: 1,
      xp: 0,
      stats: finalStats, // Guardamos YA sumado
      currentHP: startHP,
      maxHP: startHP,
      weapons: starterWeapons,
      inventory: starterInventory,
      spellSlots: spellSlots,
      spells: startingSpells,
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

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return t("step1");
      case 2:
        return t("step2");
      case 3:
        return "Assign Attributes";
      case 4:
        return isCaster ? t("cantrips") + " & Spells" : "Error";
      case 5:
        return t("step4");
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

        {/* PASO 3: STATS & DADOS */}
        {step === 3 && (
          <div className="space-y-4">
            {/* BANDEJA DE DADOS PARA TIRAR */}
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 text-center">
              {rolledPool.length === 0 ? (
                <div className="py-4">
                  <Dices size={48} className="mx-auto text-stone-600 mb-2" />
                  <p className="text-stone-400 text-sm mb-4">
                    Roll 5d6 (keep 3) for your stats pool.
                  </p>
                  <button
                    onClick={rollAttributePool}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-full transition shadow-lg"
                  >
                    ROLL STATS
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-stone-500 uppercase">
                      Available Scores
                    </span>
                    <button
                      onClick={rollAttributePool}
                      className="text-xs text-yellow-500 flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw size={12} /> Reroll
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {rolledPool.map((val, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg flex items-center justify-center font-bold text-lg animate-in zoom-in duration-300"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-500 mt-2">
                    Type these numbers below manually.
                  </p>
                </div>
              )}
            </div>

            {/* INPUTS DE ATRIBUTOS */}
            <div className="space-y-3">
              {statConfig.map((stat) => {
                const raceBonus = getRaceBonus(stat.id);
                const total = getTotalStat(stat.id);
                return (
                  <div
                    key={stat.id}
                    className="flex items-center justify-between bg-stone-800 p-3 rounded-xl border border-stone-700"
                  >
                    {/* Icono y Nombre */}
                    <div className="flex items-center gap-3 w-1/3">
                      <div
                        className={`p-2 rounded-lg bg-stone-900 ${stat.color}`}
                      >
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-stone-200">{stat.label}</p>
                        <p className="text-[10px] text-stone-500">
                          MOD: {getMod(total)}
                        </p>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      {/* Input Base */}
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={
                            baseStats[stat.id] === 0 ? "" : baseStats[stat.id]
                          }
                          onChange={(e) =>
                            updateBaseStat(stat.id, e.target.value)
                          }
                          placeholder="0"
                          className="w-12 h-10 bg-stone-900 border border-stone-600 rounded text-center text-stone-100 outline-none focus:border-yellow-500 font-bold"
                        />
                        <span className="text-[9px] text-stone-500 uppercase mt-1">
                          Base
                        </span>
                      </div>

                      {/* Race Bonus */}
                      {raceBonus > 0 && (
                        <div className="flex flex-col items-center text-yellow-500">
                          <span className="h-10 flex items-center font-bold">
                            + {raceBonus}
                          </span>
                          <span className="text-[9px] text-stone-500 uppercase mt-1">
                            Race
                          </span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex flex-col items-center ml-2">
                        <div className="w-10 h-10 flex items-center justify-center bg-stone-700 rounded font-bold text-stone-100 text-lg border border-stone-600">
                          {total}
                        </div>
                        <span className="text-[9px] text-stone-500 uppercase mt-1">
                          Total
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
