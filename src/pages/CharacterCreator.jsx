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
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { RACES, CLASSES } from "../data/srd";
import { getRandomDetails } from "../utils/randomizer";
import { useLanguage } from "../context/LanguageContext";

export function CharacterCreator({ onBack, onSave }) {
  const { t } = useLanguage();
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

  const handleNext = () => {
    if (step === 1 && selectedRace) setStep(2);
    else if (step === 2 && selectedClass) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) {
      // 1. CALCULAR HP INICIAL (Max Hit Die + CON Mod)
      const hitDieMax = parseInt(selectedClass.hitDie.substring(1));
      const conMod = getMod(stats.con);
      const startHP = Math.max(1, hitDieMax + conMod); // Mínimo 1 HP

      // 2. PROCESAR EQUIPO INICIAL DEL SRD
      let starterInventory = [];
      let starterWeapons = [];

      if (selectedClass.startingEquipment) {
        selectedClass.startingEquipment.forEach((item, index) => {
          // Añadir a inventario
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

          // Si es arma, añadir a ataques también
          if (item.type === "weapon") {
            starterWeapons.push({
              id: Date.now() + index + 100, // ID único
              name: item.name,
              type: "melee", // Asumimos melee por defecto, usuario puede cambiarlo
              damage: item.damage,
              stat: item.stat,
            });
          }
        });
      }

      // 3. PROCESAR MAGIA (Si tiene)
      const spellSlots = selectedClass.spellcasting
        ? selectedClass.spellcasting.slots
        : {};

      // 4. CREAR OBJETO FINAL
      const newHero = {
        name:
          details.name.trim() || `${selectedRace.name} ${selectedClass.name}`,
        race: selectedRace.name,
        class: selectedClass.name,
        level: 1, // Siempre nivel 1
        xp: 0,
        stats: stats,
        currentHP: startHP, // HP inicial calculado
        maxHP: startHP, // Guardamos el max calculado
        weapons: starterWeapons,
        inventory: starterInventory,
        spellSlots: spellSlots,
        features: selectedClass.features || [], // Placeholder si añadimos features en el futuro
        saveProficiencies: selectedClass.saves, // Guardamos en qué es proficiente
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
              {step === 1 && t("step1")}
              {step === 2 && t("step2")}
              {step === 3 && t("step3")}
              {step === 4 && t("step4")}
            </h1>
            <p className="text-xs text-stone-500">
              {t("level")} {step} / 4
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
                  <span className="text-stone-500">Hit Die:</span> {cls.hitDie}
                </p>
                <p>
                  <span className="text-stone-500">Primary:</span>{" "}
                  {cls.primaryStat.toUpperCase()}
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

        {step === 4 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex justify-end">
              <button
                onClick={handleAutoFill}
                className="flex items-center gap-2 text-xs bg-purple-900/30 text-purple-400 border border-purple-500/50 px-3 py-2 rounded-lg hover:bg-purple-900/50 transition"
              >
                <Sparkles size={14} /> {t("autoFill")}
              </button>
            </div>

            {/* AVATAR INPUT */}
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
          {step === 4 ? t("complete") : t("next")}{" "}
          {step !== 4 && <ArrowLeft className="rotate-180" size={20} />}
        </button>
      </div>
    </div>
  );
}
