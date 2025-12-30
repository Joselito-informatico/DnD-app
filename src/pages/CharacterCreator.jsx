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
  Image as ImageIcon,
  Search,
  Plus,
  Trash2,
  Dices,
  RotateCcw,
  Book,
} from "lucide-react";
import { RACES, CLASSES, BACKGROUNDS } from "../data/character";
import { getRandomDetails } from "../utils/randomizer";
import { useLanguage } from "../context/LanguageContext";
import { searchSpells } from "../utils/dndApi";

export function CharacterCreator({ onBack, onSave }) {
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [baseStats, setBaseStats] = useState({
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  });
  const [rolledPool, setRolledPool] = useState([]);
  const [selectedRollId, setSelectedRollId] = useState(null);

  const [selectedBg, setSelectedBg] = useState(null);
  const [classSkills, setClassSkills] = useState([]);

  // --- NUEVO ESTADO PARA HECHIZOS ---
  const [startingSpells, setStartingSpells] = useState([]);
  const [availableSpells, setAvailableSpells] = useState({
    cantrips: [],
    level1: [],
  });
  const [loadingSpells, setLoadingSpells] = useState(false);
  // ----------------------------------

  const [details, setDetails] = useState({
    name: "",
    alignment: "",
    avatar: "",
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
    backstory: "",
  });

  const isCaster = selectedClass?.spellcasting !== undefined;

  // --- EFECTO PARA CARGAR HECHIZOS AUTOMÁTICAMENTE ---
  useEffect(() => {
    if (step === 5 && isCaster && selectedClass) {
      const loadSpells = async () => {
        setLoadingSpells(true);
        // Buscamos solo los hechizos válidos para la clase
        const cantrips = await searchSpells("", {
          class: selectedClass.name,
          level: 0,
        });
        const level1 = await searchSpells("", {
          class: selectedClass.name,
          level: 1,
        });
        setAvailableSpells({ cantrips, level1 });
        setLoadingSpells(false);
      };
      loadSpells();
    }
  }, [step, isCaster, selectedClass]);
  // ---------------------------------------------------

  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    else if (step === 2 && selectedClass) setStep(3);
    else if (step === 3) {
      if (Object.values(baseStats).some((v) => v === 0))
        if (!confirm("¿Algunos atributos son 0. Continuar?")) return;
      setStep(4);
    } else if (step === 4) {
      if (!selectedBg) {
        alert("Por favor selecciona un Trasfondo.");
        return;
      }
      const max = selectedClass?.skillInfo?.count || 2;
      if (classSkills.length < max) {
        alert(`Elige ${max} habilidades de tu clase.`);
        return;
      }
      setStep(isCaster ? 5 : 6);
    } else if (step === 5) setStep(6);
    else if (step === 6) finishCreation();
  };

  const handleBackStep = () => {
    if (step === 1) onBack();
    else if (step === 6 && !isCaster) setStep(4);
    else setStep(step - 1);
  };

  const toggleClassSkill = (skillName) => {
    const max = selectedClass?.skillInfo?.count || 2;
    const isSelected = classSkills.includes(skillName);
    if (isSelected) setClassSkills(classSkills.filter((s) => s !== skillName));
    else if (classSkills.length < max)
      setClassSkills([...classSkills, skillName]);
  };

  const rollAttributePool = () => {
    const newPool = Array.from({ length: 6 }, (_, i) => {
      const rolls = Array.from(
        { length: 5 },
        () => Math.floor(Math.random() * 6) + 1
      );
      rolls.sort((a, b) => b - a);
      const total = rolls.slice(0, 3).reduce((a, b) => a + b, 0);
      return { id: i, value: total, assignedTo: null };
    });
    setRolledPool(newPool);
    setBaseStats({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
    setSelectedRollId(null);
  };

  const handleAssignStat = (statKey) => {
    if (selectedRollId !== null) {
      const roll = rolledPool.find((r) => r.id === selectedRollId);
      if (!roll) return;
      const newPool = rolledPool.map((r) => {
        if (r.assignedTo === statKey) return { ...r, assignedTo: null };
        if (r.id === selectedRollId) return { ...r, assignedTo: statKey };
        return r;
      });
      setRolledPool(newPool);
      setBaseStats((prev) => ({ ...prev, [statKey]: roll.value }));
      setSelectedRollId(null);
    } else if (rolledPool.length > 0 && baseStats[statKey] > 0) {
      const newPool = rolledPool.map((r) => {
        if (r.assignedTo === statKey) return { ...r, assignedTo: null };
        return r;
      });
      setRolledPool(newPool);
      setBaseStats((prev) => ({ ...prev, [statKey]: 0 }));
    }
  };

  // --- NUEVA LÓGICA DE SELECCIÓN DE HECHIZOS ---
  const toggleSpell = (spell) => {
    const exists = startingSpells.some((s) => s.name === spell.name);
    if (exists) {
      setStartingSpells(startingSpells.filter((s) => s.name !== spell.name));
    } else {
      // Opcional: Podrías añadir validación de límites aquí (ej: máx 3 trucos)
      setStartingSpells([...startingSpells, { id: Date.now(), ...spell }]);
    }
  };
  // ---------------------------------------------

  const finishCreation = () => {
    const finalStats = {
      str: getTotalStat("str"),
      dex: getTotalStat("dex"),
      con: getTotalStat("con"),
      int: getTotalStat("int"),
      wis: getTotalStat("wis"),
      cha: getTotalStat("cha"),
    };
    const hitDieMax = parseInt(selectedClass.hitDie.substring(1));
    const startHP = Math.max(
      1,
      hitDieMax + Math.floor((finalStats.con - 10) / 2)
    );

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
              ? `CA ${item.ac}`
              : item.type === "weapon"
              ? `${item.damage}`
              : "",
          type: item.type,
          ac: item.ac,
          armorType: item.type === "armor" ? "Heavy" : null,
        });
        if (item.type === "weapon")
          starterWeapons.push({
            id: Date.now() + index + 100,
            name: item.name,
            type: "melee",
            damage: item.damage,
            stat: item.stat,
          });
      });
    }

    const bgSkills = selectedBg ? selectedBg.skills : [];
    const allSkills = [...new Set([...classSkills, ...bgSkills])];

    const newHero = {
      name: details.name.trim() || `${selectedRace.name} ${selectedClass.name}`,
      race: selectedRace.name,
      class: selectedClass.name,
      level: 1,
      xp: 0,
      stats: finalStats,
      currentHP: startHP,
      maxHP: startHP,
      weapons: starterWeapons,
      inventory: starterInventory,
      spellSlots: selectedClass.spellcasting?.slots || {},
      spells: startingSpells,
      features: selectedClass.features || [],
      skillProfs: allSkills,
      details: {
        ...details,
        background: selectedBg?.name || "Desconocido",
        alignment: details.alignment || "Neutral",
      },
    };
    onSave(newHero);
  };

  const getStepTitle = () => {
    if (step === 1) return "Elegir Especie";
    if (step === 2) return "Elegir Clase";
    if (step === 3) return "Asignar Atributos";
    if (step === 4) return "Trasfondo y Habilidades";
    if (step === 5) return "Libro de Conjuros"; // Actualizado
    if (step === 6) return "Identidad";
    return "";
  };

  const getRaceBonus = (statKey) => selectedRace?.bonuses?.[statKey] || 0;
  const getTotalStat = (statKey) => baseStats[statKey] + getRaceBonus(statKey);
  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod > 0 ? `+${mod}` : mod;
  };

  const statConfig = [
    { id: "str", label: "FUE", icon: Sword, color: "text-red-400" },
    { id: "dex", label: "DES", icon: Zap, color: "text-yellow-400" },
    { id: "con", label: "CON", icon: Heart, color: "text-orange-400" },
    { id: "int", label: "INT", icon: Brain, color: "text-blue-400" },
    { id: "wis", label: "SAB", icon: Eye, color: "text-emerald-400" },
    { id: "cha", label: "CAR", icon: MessageCircle, color: "text-purple-400" },
  ];

  const handleAutoFill = () => {
    const random = getRandomDetails();
    setDetails((prev) => ({
      ...random,
      name: prev.name || random.name,
      avatar: prev.avatar,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24 px-6 pt-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackStep}
            className="p-2 text-stone-400 hover:text-stone-100 transition"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-100">
              {getStepTitle()}
            </h1>
            <p className="text-xs text-stone-500">
              Paso {step} / {isCaster ? 6 : 5}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
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
                  <span className="text-stone-500">DG:</span> {cls.hitDie}
                </p>
                <p>
                  <span className="text-stone-500">Principal:</span>{" "}
                  {cls.primaryStat.toUpperCase()}
                </p>
              </div>
            </div>
          ))}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 text-center relative overflow-hidden">
              {rolledPool.length === 0 ? (
                <div className="py-4">
                  <Dices size={48} className="mx-auto text-stone-600 mb-2" />
                  <p className="text-stone-400 text-sm mb-4">
                    Tira 5d6 (guarda 3) seis veces.
                  </p>
                  <button
                    onClick={rollAttributePool}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-full transition shadow-lg"
                  >
                    TIRAR DADOS
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                      Reserva
                    </span>
                    <button
                      onClick={() => {
                        setRolledPool([]);
                        setBaseStats({
                          str: 0,
                          dex: 0,
                          con: 0,
                          int: 0,
                          wis: 0,
                          cha: 0,
                        });
                      }}
                      className="text-xs text-red-400 flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {rolledPool.map((roll) => {
                      const isSelected = selectedRollId === roll.id;
                      const isUsed = roll.assignedTo !== null;
                      return (
                        <button
                          key={roll.id}
                          onClick={() =>
                            !isUsed &&
                            setSelectedRollId(isSelected ? null : roll.id)
                          }
                          disabled={isUsed}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 border-2 ${
                            isUsed
                              ? "bg-stone-900 border-stone-800 text-stone-700 opacity-50 scale-90"
                              : isSelected
                              ? "bg-yellow-500 border-yellow-300 text-stone-900 scale-110"
                              : "bg-stone-700 border-stone-600 text-stone-300"
                          }`}
                        >
                          {roll.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {statConfig.map((stat) => {
                const raceBonus = getRaceBonus(stat.id);
                const baseVal = baseStats[stat.id];
                const total = getTotalStat(stat.id);
                const isAssignMode = rolledPool.length > 0;
                const isFilled = baseVal > 0;
                return (
                  <div
                    key={stat.id}
                    onClick={() => isAssignMode && handleAssignStat(stat.id)}
                    className={`flex items-center justify-between bg-stone-800 p-3 rounded-xl border-2 transition relative overflow-hidden group ${
                      isAssignMode ? "cursor-pointer" : ""
                    } ${
                      isAssignMode && selectedRollId !== null && !isFilled
                        ? "border-yellow-500/50 bg-stone-800/80 animate-pulse"
                        : "border-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-1/3 z-10">
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
                    <div className="flex items-center gap-4 flex-1 justify-end z-10">
                      <div className="flex flex-col items-center">
                        {isAssignMode ? (
                          <div
                            className={`w-12 h-10 rounded flex items-center justify-center font-bold border-2 transition-all ${
                              isFilled
                                ? "bg-stone-700 border-stone-600 text-white"
                                : "bg-stone-900 border-dashed border-stone-600 text-stone-500"
                            }`}
                          >
                            {baseVal || "-"}
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={baseVal === 0 ? "" : baseVal}
                            onChange={(e) =>
                              setBaseStats((p) => ({
                                ...p,
                                [stat.id]: parseInt(e.target.value) || 0,
                              }))
                            }
                            placeholder="10"
                            className="w-12 h-10 bg-stone-900 border border-stone-600 rounded text-center text-stone-100 outline-none focus:border-yellow-500 font-bold"
                          />
                        )}
                        <span className="text-[9px] text-stone-500 uppercase mt-1">
                          Base
                        </span>
                      </div>
                      <Plus size={12} className="text-stone-600" />
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-10 flex items-center justify-center font-bold text-stone-400">
                          {raceBonus}
                        </div>
                        <span className="text-[9px] text-stone-500 uppercase mt-1">
                          Raza
                        </span>
                      </div>
                      <div className="h-8 w-px bg-stone-700 mx-1"></div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-stone-900 rounded font-bold text-yellow-500 text-lg border border-stone-600">
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

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase flex items-center gap-2">
                <Book size={16} /> Elegir Trasfondo
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {BACKGROUNDS.map((bg) => (
                  <div
                    key={bg.name}
                    onClick={() => setSelectedBg(bg)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                      selectedBg?.name === bg.name
                        ? "bg-stone-800 border-yellow-500"
                        : "bg-stone-800/50 border-stone-700 hover:border-stone-600"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-stone-100">
                        {bg.name}
                      </span>
                      {selectedBg?.name === bg.name && (
                        <Check size={16} className="text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {bg.desc}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {bg.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-stone-900 px-2 py-1 rounded text-stone-400 border border-stone-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-stone-400 font-bold text-sm uppercase flex items-center gap-2">
                  <Shield size={16} /> Habilidades de Clase
                </h3>
                <span className="text-xs font-bold text-yellow-500">
                  {classSkills.length} / {selectedClass.skillInfo?.count || 2}{" "}
                  selec.
                </span>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                <p className="text-xs text-stone-500 mb-3">
                  Elige de tu lista de clase (Las del trasfondo se añaden
                  solas).
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedClass.skillInfo?.list.map((skill) => {
                    const isBgSkill = selectedBg?.skills.includes(skill);
                    const isSelected = classSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => !isBgSkill && toggleClassSkill(skill)}
                        disabled={isBgSkill}
                        className={`p-2 rounded-lg text-xs font-bold text-left border transition flex justify-between items-center ${
                          isBgSkill
                            ? "bg-stone-900/50 border-stone-800 text-stone-500"
                            : isSelected
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                            : "bg-stone-900 border-stone-700 text-stone-300 hover:border-stone-500"
                        }`}
                      >
                        {skill}
                        {isBgSkill && (
                          <span className="text-[9px] uppercase opacity-50">
                            (BG)
                          </span>
                        )}
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PASO 5 ACTUALIZADO CON API LOCAL --- */}
        {step === 5 && isCaster && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-700 mb-2 text-center">
              <p className="text-stone-400 text-sm">
                Conjuros disponibles para <strong>{selectedClass.name}</strong>.
              </p>
            </div>

            {loadingSpells ? (
              <div className="p-8 text-center text-stone-500 animate-pulse">
                <Book size={32} className="mx-auto mb-2 opacity-50" />
                Consultando grimorio...
              </div>
            ) : (
              <div className="space-y-6 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {/* TRUCOS */}
                {availableSpells.cantrips.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase mb-2 sticky top-0 bg-[#1c1917] py-2 z-10 border-b border-stone-800">
                      Trucos (Nivel 0)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {availableSpells.cantrips.map((spell) => {
                        const isSelected = startingSpells.some(
                          (s) => s.name === spell.name
                        );
                        return (
                          <div
                            key={spell.name}
                            onClick={() => toggleSpell(spell)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                              isSelected
                                ? "bg-stone-800 border-yellow-500"
                                : "bg-stone-900 border-stone-800 hover:border-stone-600"
                            }`}
                          >
                            <div>
                              <p
                                className={`font-bold text-sm ${
                                  isSelected ? "text-white" : "text-stone-400"
                                }`}
                              >
                                {spell.name}
                              </p>
                              <p className="text-[10px] text-stone-600">
                                {spell.school}
                              </p>
                            </div>
                            {isSelected ? (
                              <Check size={18} className="text-yellow-500" />
                            ) : (
                              <Plus size={18} className="text-stone-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* NIVEL 1 */}
                {availableSpells.level1.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase mb-2 sticky top-0 bg-[#1c1917] py-2 z-10 border-b border-stone-800">
                      Nivel 1
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {availableSpells.level1.map((spell) => {
                        const isSelected = startingSpells.some(
                          (s) => s.name === spell.name
                        );
                        return (
                          <div
                            key={spell.name}
                            onClick={() => toggleSpell(spell)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                              isSelected
                                ? "bg-stone-800 border-blue-500"
                                : "bg-stone-900 border-stone-800 hover:border-stone-600"
                            }`}
                          >
                            <div>
                              <p
                                className={`font-bold text-sm ${
                                  isSelected ? "text-white" : "text-stone-400"
                                }`}
                              >
                                {spell.name}
                              </p>
                              <p className="text-[10px] text-stone-600">
                                {spell.school} • {spell.damage || "Utilidad"}
                              </p>
                            </div>
                            {isSelected ? (
                              <Check size={18} className="text-blue-500" />
                            ) : (
                              <Plus size={18} className="text-stone-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {availableSpells.cantrips.length === 0 &&
                  availableSpells.level1.length === 0 && (
                    <div className="text-center py-10 text-stone-500">
                      No se encontraron hechizos para esta clase en la base de
                      datos local.
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
        {/* --------------------------------------------- */}

        {step === 6 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
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
                    Avatar (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
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
                <User size={16} /> Nombre del Personaje
              </label>
              <input
                type="text"
                placeholder="Ej: Valeros el Bravo"
                value={details.name}
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                <ScrollText size={14} /> Personalidad (de{" "}
                {selectedBg?.name || "Trasfondo"})
              </h3>

              {["traits", "ideals", "bonds", "flaws"].map((field) => (
                <div key={field} className="relative">
                  <input
                    list={`list-${field}`}
                    placeholder={`Selecciona o escribe ${field}...`}
                    value={details[field]}
                    onChange={(e) =>
                      setDetails({ ...details, [field]: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-600 rounded-lg p-2 text-sm text-stone-100 outline-none focus:border-yellow-500"
                  />
                  <datalist id={`list-${field}`}>
                    {selectedBg &&
                      selectedBg[field]?.map((opt, i) => (
                        <option key={i} value={opt} />
                      ))}
                  </datalist>
                </div>
              ))}
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
          {step === 6 ? "Completar" : "Siguiente"}{" "}
          {step !== 6 && <ArrowLeft className="rotate-180" size={20} />}
        </button>
      </div>
    </div>
  );
}
