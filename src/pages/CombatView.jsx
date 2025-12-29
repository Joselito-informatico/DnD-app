import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Heart,
  Zap,
  Sword,
  X,
  Activity,
  Settings,
  Moon,
  Trash2,
  User,
  ScrollText,
  Backpack,
  Plus,
  Flame,
  BookOpen,
  Sparkles,
  Star,
  Languages,
  Eye,
  Skull,
  Coffee,
  Quote,
  Users,
  Gem,
  PenTool,
  AlertTriangle,
  Minus,
  CircleDot,
} from "lucide-react";
import { CLASSES, SKILLS, SPELLS as SRD_SPELLS, CONDITIONS } from "../data/srd";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";

export function CombatView({ hero, onBack, onUpdateHero, onDeleteHero }) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("combat");
  const [rollResult, setRollResult] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editingStat, setEditingStat] = useState(null);

  // Modales y Formularios
  const [isAddingAttack, setIsAddingAttack] = useState(false);
  const [newAttack, setNewAttack] = useState({
    name: "",
    damage: "1d6",
    stat: "str",
    type: "melee",
  });

  const [isAddingSpell, setIsAddingSpell] = useState(false);
  const [newSpell, setNewSpell] = useState({
    name: "",
    level: 0,
    school: "Evocation",
    desc: "",
    time: "1 Action",
  });

  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [isEditingSlots, setIsEditingSlots] = useState(false);

  // NUEVO: Formulario para añadir recurso
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", max: "3" });

  // --- REGLAS & CALCULOS ---
  const proficiencyBonus = Math.floor(2 + (hero.level - 1) / 4);
  const getModifier = (score) => Math.floor((score - 10) / 2);
  const stats = hero.stats;
  const mods = {
    str: getModifier(stats.str),
    dex: getModifier(stats.dex),
    con: getModifier(stats.con),
    int: getModifier(stats.int),
    wis: getModifier(stats.wis),
    cha: getModifier(stats.cha),
  };

  const maxHP = 10 + mods.con + (hero.level - 1) * 6;
  const currentHP = hero.currentHP ?? maxHP;
  const armorClass = 10 + mods.dex;
  const initiative = mods.dex >= 0 ? `+${mods.dex}` : mods.dex;

  const inspiration = hero.inspiration || false;

  const skillProfs = hero.skillProfs || [];
  const isPerceptionProf = skillProfs.includes("Perception");
  const passivePerception =
    10 + mods.wis + (isPerceptionProf ? proficiencyBonus : 0);

  const heroClassData = CLASSES.find((c) => c.name === hero.class);
  const saveProficiencies = heroClassData ? heroClassData.saves : [];
  const proficiencies = heroClassData ? heroClassData.proficiencies : [];
  const hitDieType = heroClassData ? heroClassData.hitDie : "d8";

  const hitDiceUsed = hero.hitDiceUsed || 0;
  const hitDiceTotal = hero.level;
  const deathSaves = hero.deathSaves || { successes: 0, failures: 0 };
  const xp = hero.xp || 0;
  const activeConditions = hero.conditions || [];
  const exhaustionLevel = hero.exhaustion || 0;

  // NUEVO: Lista de recursos personalizados
  const resources = hero.resources || [];

  const languages = ["Common"];
  if (hero.race === "Elf") languages.push("Elvish");
  if (hero.race === "Dwarf") languages.push("Dwarvish");
  if (hero.race === "Tiefling") languages.push("Infernal");
  if (hero.race === "Human") languages.push("One extra choice");

  const weapons = hero.weapons || [];
  const details = hero.details || {
    alignment: "Unknown",
    background: "Unknown",
  };
  const inventory = hero.inventory || [];
  const money = hero.money || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  const features = hero.features || [];

  const mySpells = hero.spells || SRD_SPELLS;
  const defaultSlots = { 1: { total: 2, used: 0 } };
  const spellSlots = hero.spellSlots || defaultSlots;
  const spellCastingStat =
    hero.class === "Wizard"
      ? "int"
      : hero.class === "Bard" ||
        hero.class === "Sorcerer" ||
        hero.class === "Warlock"
      ? "cha"
      : "wis";
  const spellAttackBonus = mods[spellCastingStat] + proficiencyBonus;
  const spellSaveDC = 8 + proficiencyBonus + mods[spellCastingStat];

  // --- ACCIONES ---

  // NUEVO: Gestión de Recursos
  const addResource = () => {
    if (!newResource.name) return;
    const maxVal = parseInt(newResource.max) || 1;
    const resourceToAdd = {
      id: Date.now(),
      name: newResource.name,
      max: maxVal,
      current: maxVal,
    }; // Empieza lleno
    onUpdateHero({ ...hero, resources: [...resources, resourceToAdd] });
    setIsAddingResource(false);
    setNewResource({ name: "", max: "3" });
    showToast("Resource tracker created", "success");
  };

  const removeResource = (resId, e) => {
    e.stopPropagation(); // Importante para no activar otros clicks
    if (confirm("Delete this tracker?")) {
      onUpdateHero({
        ...hero,
        resources: resources.filter((r) => r.id !== resId),
      });
    }
  };

  const updateResourceValue = (resId, change) => {
    const updatedResources = resources.map((r) => {
      if (r.id === resId) {
        const newVal = Math.max(0, Math.min(r.max, r.current + change));
        return { ...r, current: newVal };
      }
      return r;
    });
    onUpdateHero({ ...hero, resources: updatedResources });
  };

  const toggleSkillProficiency = (e, skillName) => {
    e.stopPropagation();
    const exists = skillProfs.includes(skillName);
    const newProfs = exists
      ? skillProfs.filter((s) => s !== skillName)
      : [...skillProfs, skillName];
    onUpdateHero({ ...hero, skillProfs: newProfs });
  };

  const toggleCondition = (conditionId) => {
    const exists = activeConditions.includes(conditionId);
    let newConditions;
    if (exists) {
      newConditions = activeConditions.filter((c) => c !== conditionId);
      showToast("Condition removed", "info");
    } else {
      newConditions = [...activeConditions, conditionId];
      showToast("Condition applied", "error");
    }
    onUpdateHero({ ...hero, conditions: newConditions });
    setIsAddingCondition(false);
  };

  const updateExhaustion = (val) => {
    const newLevel = Math.max(0, Math.min(6, val));
    onUpdateHero({ ...hero, exhaustion: newLevel });
  };

  const addAttack = () => {
    if (!newAttack.name) return;
    const attackToAdd = { id: Date.now(), ...newAttack };
    onUpdateHero({ ...hero, weapons: [...weapons, attackToAdd] });
    setIsAddingAttack(false);
    setNewAttack({ name: "", damage: "1d6", stat: "str", type: "melee" });
    showToast("Weapon added!", "success");
  };

  const removeAttack = (attackId, e) => {
    e.stopPropagation();
    if (confirm("Remove this attack?")) {
      onUpdateHero({
        ...hero,
        weapons: weapons.filter((w) => w.id !== attackId),
      });
      showToast("Weapon removed", "info");
    }
  };

  const addSpell = () => {
    if (!newSpell.name) return;
    const spellToAdd = {
      id: Date.now(),
      ...newSpell,
      level: parseInt(newSpell.level),
    };
    const currentList = hero.spells ? hero.spells : SRD_SPELLS;
    onUpdateHero({ ...hero, spells: [...currentList, spellToAdd] });
    setIsAddingSpell(false);
    setNewSpell({
      name: "",
      level: 0,
      school: "Evocation",
      desc: "",
      time: "1 Action",
    });
    showToast("Spell scribed!", "success");
  };

  const removeSpell = (spellId, e) => {
    e.stopPropagation();
    if (confirm("Remove this spell?")) {
      const currentList = hero.spells ? hero.spells : SRD_SPELLS;
      onUpdateHero({
        ...hero,
        spells: currentList.filter((s) => s.id !== spellId),
      });
      showToast("Spell removed", "info");
    }
  };

  const updateMaxSlots = (level, change) => {
    const currentLevelData = spellSlots[level] || { total: 0, used: 0 };
    const newTotal = Math.max(0, currentLevelData.total + change);
    const newUsed = Math.min(currentLevelData.used, newTotal);
    const newSlots = {
      ...spellSlots,
      [level]: { total: newTotal, used: newUsed },
    };
    onUpdateHero({ ...hero, spellSlots: newSlots });
  };

  const toggleSlot = (level, slotIndex) => {
    const currentLevel = spellSlots[level] || { total: 0, used: 0 };
    const isUsed = slotIndex < currentLevel.used;
    const newUsed = isUsed ? currentLevel.used - 1 : currentLevel.used + 1;
    const newSlots = {
      ...spellSlots,
      [level]: {
        ...currentLevel,
        used: Math.max(0, Math.min(currentLevel.total, newUsed)),
      },
    };
    onUpdateHero({ ...hero, spellSlots: newSlots });
  };

  const updateLevel = (val) => {
    const lvl = Math.max(1, Math.min(20, parseInt(val) || 1));
    onUpdateHero({ ...hero, level: lvl });
    setEditingStat(null);
    showToast(`Level updated to ${lvl}`, "success");
  };

  const updateXP = (val) => {
    onUpdateHero({ ...hero, xp: parseInt(val) || 0 });
    setEditingStat(null);
  };

  const updateAttribute = (statName, val) => {
    const newVal = Math.max(1, Math.min(30, parseInt(val) || 10));
    onUpdateHero({ ...hero, stats: { ...hero.stats, [statName]: newVal } });
    setEditingStat(null);
    showToast(`${statName.toUpperCase()} updated`, "success");
  };

  const handleLongRest = () => {
    const resetSlots = { ...spellSlots };
    Object.keys(resetSlots).forEach((level) => (resetSlots[level].used = 0));

    const regainedHitDice = Math.max(1, Math.floor(hitDiceTotal / 2));
    const newHitDiceUsed = Math.max(0, hitDiceUsed - regainedHitDice);
    const newExhaustion = Math.max(0, exhaustionLevel - 1);

    // RECARGAR RECURSOS (Reset to Max)
    const resetResources = resources.map((r) => ({ ...r, current: r.max }));

    onUpdateHero({
      ...hero,
      currentHP: maxHP,
      spellSlots: resetSlots,
      hitDiceUsed: newHitDiceUsed,
      deathSaves: { successes: 0, failures: 0 },
      exhaustion: newExhaustion,
      resources: resetResources,
    });
    setShowMenu(false);
    showToast("Long Rest: All stats & resources restored", "success");
  };

  const handleShortRest = () => {
    setShowMenu(false);
    setActiveTab("combat");
    showToast("Use Hit Dice to heal", "info");
  };

  const useHitDie = () => {
    if (hitDiceUsed < hitDiceTotal) {
      const dieMax = parseInt(hitDieType.substring(1));
      const roll = Math.floor(Math.random() * dieMax) + 1;
      const healAmount = Math.max(0, roll + mods.con);
      const newHP = Math.min(maxHP, currentHP + healAmount);
      onUpdateHero({ ...hero, currentHP: newHP, hitDiceUsed: hitDiceUsed + 1 });
      setRollResult({
        title: t("shortRest"),
        roll: roll,
        mod: mods.con,
        total: healAmount,
        isCrit: false,
        isFail: false,
      });
      showToast(`Healed ${healAmount} HP`, "success");
    }
  };

  const updateDeathSave = (type, index) => {
    const currentVal = deathSaves[type];
    const newVal = index + 1 === currentVal ? index : index + 1;
    const newSaves = { ...deathSaves, [type]: newVal };
    onUpdateHero({ ...hero, deathSaves: newSaves });
  };

  const toggleInspiration = () => {
    const newState = !inspiration;
    onUpdateHero({ ...hero, inspiration: newState });
    if (newState) showToast("Inspired!", "success");
  };

  const handleDelete = () => {
    if (confirm(t("confirmDelete"))) onDeleteHero(hero.id);
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
    showToast("Item added", "success");
  };
  const removeItem = (itemId) => {
    onUpdateHero({
      ...hero,
      inventory: inventory.filter((i) => i.id !== itemId),
    });
  };

  const rollDice = (name, modifier) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    setRollResult({
      title: name,
      roll: d20,
      mod: modifier,
      total: d20 + modifier,
      isCrit: d20 === 20,
      isFail: d20 === 1,
    });
    if (d20 === 20) showToast("CRITICAL HIT! 🔥", "success");
    if (d20 === 1) showToast("Critical Fail...", "error");
  };

  const changeHP = (val) => {
    const newHP = Math.min(maxHP, Math.max(0, currentHP + val));
    const newSaves =
      currentHP === 0 && val > 0 ? { successes: 0, failures: 0 } : deathSaves;
    onUpdateHero({ ...hero, currentHP: newHP, deathSaves: newSaves });
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 pb-20 relative">
      {/* HEADER */}
      <header className="flex items-center justify-between p-6 pb-2 bg-neutral-900 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-stone-400 hover:text-stone-100 transition"
          >
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            {details.avatar && (
              <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-600 overflow-hidden">
                <img
                  src={details.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-stone-100">{hero.name}</h1>
              <p
                onClick={() => setEditingStat("level")}
                className="text-xs text-stone-500 cursor-pointer hover:text-yellow-500 hover:underline"
              >
                {t("level")} {hero.level} {hero.race} {hero.class}{" "}
                <span className="text-[10px] bg-stone-800 px-1 rounded ml-1">
                  {t("edit")}
                </span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`p-2 rounded-full transition ${
            showMenu
              ? "bg-yellow-500 text-stone-900"
              : "text-stone-400 hover:bg-stone-800"
          }`}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* MODAL EDICIÓN RAPIDA */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl w-full max-w-xs animate-in zoom-in duration-200">
            <h3 className="text-stone-100 font-bold mb-4 capitalize">
              {t("edit")} {t(editingStat) || editingStat}
            </h3>
            <input
              type="number"
              autoFocus
              placeholder="Value"
              className="w-full bg-stone-950 border border-stone-600 rounded-lg p-3 text-stone-100 mb-4 focus:border-yellow-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editingStat === "level") updateLevel(e.target.value);
                  else if (editingStat === "xp") updateXP(e.target.value);
                  else updateAttribute(editingStat, e.target.value);
                }
              }}
            />
            <button
              onClick={() => setEditingStat(null)}
              className="w-full py-2 bg-stone-800 text-stone-400 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL GESTIÓN DE SLOTS */}
      {isEditingSlots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl w-full max-w-sm animate-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-stone-100 font-bold">Manage Spell Slots</h3>
              <button onClick={() => setIsEditingSlots(false)}>
                <X className="text-stone-500 hover:text-white" />
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Set your maximum spell slots per level.
            </p>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                const count = spellSlots[lvl]?.total || 0;
                return (
                  <div
                    key={lvl}
                    className="flex items-center justify-between bg-stone-800 p-2 rounded-lg border border-stone-700"
                  >
                    <span className="text-sm font-bold text-stone-300 w-20">
                      Level {lvl}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateMaxSlots(lvl, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-900 rounded hover:bg-stone-700 text-stone-400"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-mono text-xl w-6 text-center text-yellow-500">
                        {count}
                      </span>
                      <button
                        onClick={() => updateMaxSlots(lvl, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-900 rounded hover:bg-stone-700 text-stone-400"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setIsEditingSlots(false)}
              className="w-full mt-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-stone-100 rounded-xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MENÚ */}
      {showMenu && (
        <div className="absolute top-20 right-6 z-20 w-48 bg-stone-800 border border-stone-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <button
            onClick={handleShortRest}
            className="w-full text-left px-4 py-3 text-stone-200 hover:bg-stone-700 flex items-center gap-3 border-b border-stone-700/50"
          >
            <Coffee size={16} className="text-orange-400" /> {t("shortRest")}
          </button>
          <button
            onClick={handleLongRest}
            className="w-full text-left px-4 py-3 text-stone-200 hover:bg-stone-700 flex items-center gap-3 border-b border-stone-700/50"
          >
            <Moon size={16} className="text-blue-400" /> {t("longRest")}
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 flex items-center gap-3"
          >
            <Trash2 size={16} /> {t("deleteHero")}
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="flex px-4 border-b border-stone-800 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("combat")}
          className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${
            activeTab === "combat"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-stone-500"
          }`}
        >
          {t("tabCombat")}
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${
            activeTab === "skills"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-stone-500"
          }`}
        >
          {t("tabSkills")}
        </button>
        <button
          onClick={() => setActiveTab("spells")}
          className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${
            activeTab === "spells"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-stone-500"
          }`}
        >
          {t("tabSpells")}
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${
            activeTab === "inventory"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-stone-500"
          }`}
        >
          {t("tabEquip")}
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 min-w-[70px] pb-3 text-[10px] font-bold border-b-2 transition ${
            activeTab === "profile"
              ? "border-yellow-500 text-yellow-500"
              : "border-transparent text-stone-500"
          }`}
        >
          {t("tabProfile")}
        </button>
      </div>

      {/* CONTENIDO */}
      <div
        className="flex-1 overflow-y-auto px-6 space-y-6 pb-24"
        onClick={() => setShowMenu(false)}
      >
        {/* COMBAT */}
        {activeTab === "combat" && (
          <div className="space-y-6 animate-in slide-in-from-left duration-200">
            <div className="flex gap-3 mb-2">
              <button
                onClick={toggleInspiration}
                className={`flex-1 p-3 rounded-xl border flex flex-col items-center justify-center transition ${
                  inspiration
                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                    : "bg-stone-800 border-stone-700 text-stone-500 grayscale"
                }`}
              >
                <Star size={20} fill={inspiration ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold uppercase mt-1">
                  {t("inspiration")}
                </span>
              </button>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center flex-1">
                <Zap className="text-yellow-600 mb-1 w-5 h-5" />
                <span className="text-xs text-stone-400 font-bold uppercase">
                  {t("init")}
                </span>
                <span className="text-2xl font-bold text-yellow-500">
                  {initiative}
                </span>
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                {t("proficiency")}:{" "}
                <span className="text-stone-300">+{proficiencyBonus}</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center relative overflow-hidden">
                <Shield className="text-stone-600 absolute opacity-20 -right-2 -bottom-2 w-16 h-16" />
                <span className="text-xs text-stone-400 font-bold uppercase">
                  {t("ac")}
                </span>
                <span className="text-3xl font-bold text-stone-100">
                  {armorClass}
                </span>
              </div>
              <div
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition duration-300 ${
                  currentHP === 0
                    ? "bg-red-900/30 border-red-500 animate-pulse"
                    : "bg-stone-800 border-stone-700"
                }`}
              >
                <Heart
                  className={`mb-1 w-5 h-5 ${
                    currentHP === 0 ? "text-red-500" : "text-red-500"
                  }`}
                />
                <span className="text-xs text-stone-400 font-bold uppercase">
                  {t("hp")}
                </span>
                <span className="text-xl font-bold text-stone-100">
                  {currentHP}{" "}
                  <span className="text-sm text-stone-500">/ {maxHP}</span>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changeHP(-1)}
                className="flex-1 py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg font-bold hover:bg-red-900/40"
              >
                - {t("dmg")}
              </button>
              <button
                onClick={() => changeHP(1)}
                className="flex-1 py-3 bg-green-900/20 text-green-400 border border-green-900/50 rounded-lg font-bold hover:bg-green-900/40"
              >
                + {t("heal")}
              </button>
            </div>

            {/* NUEVA SECCIÓN: RECURSOS DE CLASE (RAGE, KI, ETC) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-stone-400 font-bold text-sm uppercase tracking-wider">
                  {t("resources")}
                </h3>
                <button
                  onClick={() => setIsAddingResource(!isAddingResource)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingResource ? <X size={12} /> : <Plus size={12} />}{" "}
                  {t("addResource")}
                </button>
              </div>

              {isAddingResource && (
                <div className="bg-stone-800 p-2 rounded-xl border border-yellow-500/50 mb-3 grid grid-cols-3 gap-2 animate-in fade-in zoom-in duration-200">
                  <input
                    type="text"
                    placeholder="Name (e.g. Rage)"
                    value={newResource.name}
                    onChange={(e) =>
                      setNewResource({ ...newResource, name: e.target.value })
                    }
                    className="col-span-2 bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none focus:border-yellow-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={newResource.max}
                    onChange={(e) =>
                      setNewResource({ ...newResource, max: e.target.value })
                    }
                    className="bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none focus:border-yellow-500"
                  />
                  <button
                    onClick={addResource}
                    className="col-span-3 py-1 bg-yellow-600 text-stone-100 text-xs font-bold rounded hover:bg-yellow-500"
                  >
                    Add Tracker
                  </button>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between bg-stone-800 p-2 rounded-xl border border-stone-700 group relative"
                  >
                    <span className="text-xs font-bold text-stone-200 pl-2">
                      {res.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateResourceValue(res.id, -1)}
                        className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-600 hover:bg-stone-700 text-stone-400 flex items-center justify-center transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-mono font-bold text-yellow-500 w-12 text-center">
                        {res.current}{" "}
                        <span className="text-stone-600 text-[10px]">
                          / {res.max}
                        </span>
                      </span>
                      <button
                        onClick={() => updateResourceValue(res.id, 1)}
                        className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-600 hover:bg-stone-700 text-stone-400 flex items-center justify-center transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {/* Borrar Recurso */}
                    <button
                      onClick={(e) => removeResource(res.id, e)}
                      className="absolute -left-2 -top-2 bg-stone-800 text-stone-500 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg border border-stone-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {resources.length === 0 && (
                  <p className="text-[10px] text-stone-600 text-center italic py-1">
                    No custom resources added.
                  </p>
                )}
              </div>
            </div>

            {/* CONDITIONS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-stone-400 font-bold text-sm uppercase tracking-wider">
                  {t("conditions")}
                </h3>
                <button
                  onClick={() => setIsAddingCondition(!isAddingCondition)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingCondition ? <X size={12} /> : <Plus size={12} />}{" "}
                  {t("addCondition")}
                </button>
              </div>
              {isAddingCondition && (
                <div className="bg-stone-800 p-2 rounded-xl border border-yellow-500/50 mb-3 grid grid-cols-2 gap-2 animate-in fade-in zoom-in duration-200">
                  {CONDITIONS.filter((c) => c.id !== "exhaustion").map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCondition(c.id)}
                      className={`text-xs p-2 rounded border text-left truncate ${
                        activeConditions.includes(c.id)
                          ? "bg-red-900/30 border-red-500 text-red-200"
                          : "bg-stone-900 border-stone-600 text-stone-300 hover:border-yellow-500"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-3 py-1 rounded-full">
                  <span
                    className={`text-xs font-bold ${
                      exhaustionLevel > 0 ? "text-orange-500" : "text-stone-500"
                    }`}
                  >
                    {t("exhaustion")}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((lvl) => (
                      <div
                        key={lvl}
                        onClick={() =>
                          updateExhaustion(
                            lvl === exhaustionLevel ? lvl - 1 : lvl
                          )
                        }
                        className={`w-2 h-4 rounded-sm cursor-pointer transition ${
                          lvl <= exhaustionLevel
                            ? lvl >= 5
                              ? "bg-red-600"
                              : "bg-orange-500"
                            : "bg-stone-800"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                {activeConditions.map((cId) => {
                  const cond = CONDITIONS.find((c) => c.id === cId);
                  return (
                    <div
                      key={cId}
                      onClick={() => toggleCondition(cId)}
                      className="flex items-center gap-1 bg-red-900/20 border border-red-500/50 px-3 py-1 rounded-full cursor-pointer hover:bg-red-900/40"
                    >
                      <AlertTriangle size={12} className="text-red-400" />
                      <span className="text-xs text-red-200 font-bold">
                        {cond?.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {currentHP === 0 && (
              <div className="bg-stone-900/80 p-4 rounded-xl border border-red-900/50 animate-in zoom-in duration-300">
                <h3 className="text-red-400 font-bold text-sm mb-3 uppercase flex items-center gap-2">
                  <Skull size={16} /> {t("deathSaves")}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-stone-400 w-16">
                    SUCCESS
                  </span>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => updateDeathSave("successes", i)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          i < deathSaves.successes
                            ? "bg-green-500 border-green-600"
                            : "bg-stone-800 border-stone-700"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-400 w-16">
                    FAILURE
                  </span>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => updateDeathSave("failures", i)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          i < deathSaves.failures
                            ? "bg-red-600 border-red-700"
                            : "bg-stone-800 border-stone-700"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {currentHP > 0 && currentHP < maxHP && (
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-stone-400 font-bold text-sm uppercase flex items-center gap-2">
                    <Coffee size={16} /> {t("hitDice")} ({hitDieType})
                  </h3>
                  <span className="text-xs text-stone-500">
                    {hitDiceTotal - hitDiceUsed} / {hitDiceTotal}
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: hitDiceTotal }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded border transition ${
                        i < hitDiceTotal - hitDiceUsed
                          ? "bg-stone-600 border-stone-500"
                          : "bg-stone-900 border-stone-800 opacity-30"
                      }`}
                    ></div>
                  ))}
                </div>
                <button
                  onClick={useHitDie}
                  disabled={hitDiceUsed >= hitDiceTotal || currentHP >= maxHP}
                  className="mt-3 w-full py-2 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-200 text-xs font-bold rounded-lg transition"
                >
                  Roll (1{hitDieType} + {mods.con})
                </button>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-stone-400 font-bold text-sm uppercase tracking-wider">
                  {t("attacks")}
                </h3>
                <button
                  onClick={() => setIsAddingAttack(!isAddingAttack)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingAttack ? <X size={12} /> : <Plus size={12} />}{" "}
                  {t("addWeapon")}
                </button>
              </div>
              {isAddingAttack && (
                <div className="bg-stone-800 p-3 rounded-xl border border-yellow-500/50 mb-3 animate-in fade-in zoom-in duration-200">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newAttack.name}
                      onChange={(e) =>
                        setNewAttack({ ...newAttack, name: e.target.value })
                      }
                      className="col-span-2 bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none focus:border-yellow-500"
                    />
                    <input
                      type="text"
                      placeholder="Dmg"
                      value={newAttack.damage}
                      onChange={(e) =>
                        setNewAttack({ ...newAttack, damage: e.target.value })
                      }
                      className="bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none focus:border-yellow-500"
                    />
                    <select
                      value={newAttack.stat}
                      onChange={(e) =>
                        setNewAttack({ ...newAttack, stat: e.target.value })
                      }
                      className="bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none"
                    >
                      <option value="str">STR</option>
                      <option value="dex">DEX</option>
                      <option value="int">INT</option>
                      <option value="wis">WIS</option>
                      <option value="cha">CHA</option>
                    </select>
                  </div>
                  <button
                    onClick={addAttack}
                    className="w-full py-2 bg-yellow-600 text-stone-100 text-xs font-bold rounded hover:bg-yellow-500"
                  >
                    Save
                  </button>
                </div>
              )}
              <div className="space-y-2">
                {weapons.map((w) => {
                  const mod = mods[w.stat] + proficiencyBonus;
                  return (
                    <div
                      key={w.id}
                      onClick={() => rollDice(`${w.name} Attack`, mod)}
                      className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition group relative"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-stone-900 p-2 rounded-lg text-stone-500">
                          <Sword size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-200">{w.name}</h4>
                          <p className="text-xs text-stone-500">
                            {w.damage} {w.stat.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-stone-900 px-3 py-1 rounded-lg font-bold text-stone-300">
                          +{mod}
                        </div>
                        <button
                          onClick={(e) => removeAttack(w.id, e)}
                          className="p-2 text-stone-600 hover:text-red-500 hover:bg-stone-900 rounded-full transition opacity-0 group-hover:opacity-100 absolute right-1 top-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} /> {t("features")}
              </h3>
              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-800 p-3 rounded-xl border border-stone-700"
                  >
                    <h4 className="font-bold text-stone-200 text-sm">
                      {feat.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
                {features.length === 0 && (
                  <p className="text-stone-600 text-xs italic">
                    No features available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SKILLS */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="text-stone-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-stone-200">
                    {t("passivePerception")}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    10 + WIS{isPerceptionProf ? " + PROF" : ""}
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold text-stone-100">
                {passivePerception}
              </span>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Shield size={16} /> {t("savingThrows")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(mods).map((stat) => {
                  const fullStatName = {
                    str: "Strength",
                    dex: "Dexterity",
                    con: "Constitution",
                    int: "Intelligence",
                    wis: "Wisdom",
                    cha: "Charisma",
                  }[stat];
                  const isSaveProficient =
                    saveProficiencies.includes(fullStatName);
                  const saveMod =
                    mods[stat] + (isSaveProficient ? proficiencyBonus : 0);
                  return (
                    <button
                      key={stat}
                      onClick={() =>
                        rollDice(`${stat.toUpperCase()} Save`, saveMod)
                      }
                      className={`p-3 rounded-lg border flex justify-between items-center ${
                        isSaveProficient
                          ? "bg-stone-800 border-yellow-600/50"
                          : "bg-stone-800/50 border-stone-700"
                      }`}
                    >
                      <span
                        className={`font-bold uppercase text-sm ${
                          isSaveProficient
                            ? "text-yellow-500"
                            : "text-stone-400"
                        }`}
                      >
                        {t(stat).slice(0, 3)}
                      </span>
                      <span className="font-mono text-stone-200">
                        {saveMod >= 0 ? "+" : ""}
                        {saveMod}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> {t("skills")}
              </h3>
              <div className="bg-stone-800 rounded-xl border border-stone-700 divide-y divide-stone-700/50">
                {SKILLS.map((skill) => {
                  const isProf = skillProfs.includes(skill.name);
                  const totalMod =
                    mods[skill.stat] + (isProf ? proficiencyBonus : 0);
                  return (
                    <div
                      key={skill.name}
                      onClick={() => rollDice(skill.name, totalMod)}
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-stone-700/50 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => toggleSkillProficiency(e, skill.name)}
                          className="p-1 rounded hover:bg-stone-600 transition"
                        >
                          <Star
                            size={16}
                            className={
                              isProf
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-stone-600"
                            }
                          />
                        </button>
                        <div>
                          <span
                            className={`text-sm font-medium ${
                              isProf ? "text-yellow-500" : "text-stone-300"
                            }`}
                          >
                            {skill.name}
                          </span>
                          <span className="text-[10px] text-stone-600 uppercase ml-2">
                            ({t(skill.stat).slice(0, 3)})
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-sm ${
                          isProf
                            ? "text-yellow-500 font-bold"
                            : "text-stone-400"
                        }`}
                      >
                        {totalMod >= 0 ? "+" : ""}
                        {totalMod}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Languages size={16} /> Proficiencies
              </h3>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs px-2 py-1 bg-stone-900 rounded border border-stone-600 text-stone-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-500 uppercase mb-2">
                    Proficiencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {proficiencies.map((prof, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-stone-900 rounded border border-stone-600 text-stone-300"
                      >
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPELLS */}
        {activeTab === "spells" && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-start gap-4">
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 grid grid-cols-2 gap-4 flex-1">
                <div className="flex flex-col items-center border-r border-stone-700">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    {t("spellDC")}
                  </span>
                  <span className="text-2xl font-bold text-stone-100">
                    {spellSaveDC}
                  </span>
                  <span className="text-[10px] text-stone-600">
                    8 + Prof + {t(spellCastingStat).slice(0, 3)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-stone-500">
                    {t("spellAtk")}
                  </span>
                  <span className="text-2xl font-bold text-yellow-500">
                    +{spellAttackBonus}
                  </span>
                  <span className="text-[10px] text-stone-600">
                    Prof + {t(spellCastingStat).slice(0, 3)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditingSlots(true)}
                className="h-full px-3 bg-stone-800 border border-stone-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-stone-700 hover:text-yellow-500 transition text-stone-400"
              >
                <Settings size={20} />
                <span className="text-[10px] font-bold uppercase">Slots</span>
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                const slotData = spellSlots[lvl];
                if (!slotData || slotData.total === 0) return null;
                return (
                  <div key={lvl}>
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-stone-400 font-bold text-sm uppercase flex items-center gap-2">
                        <Flame size={14} className="text-yellow-600" />{" "}
                        {t("level")} {lvl}
                      </h3>
                      <span className="text-xs text-stone-500">
                        {slotData.used} / {slotData.total}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: slotData.total }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => toggleSlot(lvl, i)}
                          className={`w-8 h-8 rounded-full border-2 transition ${
                            i < slotData.used
                              ? "bg-stone-900 border-stone-700"
                              : "bg-yellow-500 border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                          }`}
                        ></button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.values(spellSlots).every((s) => s.total === 0) && (
                <p className="text-xs text-stone-600 text-center italic py-2">
                  No spell slots available. Configure them above.
                </p>
              )}
            </div>
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddingSpell(!isAddingSpell)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingSpell ? <X size={12} /> : <Plus size={12} />}{" "}
                  {isAddingSpell ? "Cancel" : t("scribe")}
                </button>
              </div>
              {isAddingSpell && (
                <div className="bg-stone-800 p-3 rounded-xl border border-yellow-500/50 mb-3 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-2 mb-2">
                    <input
                      type="text"
                      placeholder="Spell Name"
                      value={newSpell.name}
                      onChange={(e) =>
                        setNewSpell({ ...newSpell, name: e.target.value })
                      }
                      className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none focus:border-yellow-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newSpell.level}
                        onChange={(e) =>
                          setNewSpell({ ...newSpell, level: e.target.value })
                        }
                        className="bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none"
                      >
                        <option value="0">{t("cantrips")}</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                      </select>
                      <input
                        type="text"
                        placeholder="School"
                        value={newSpell.school}
                        onChange={(e) =>
                          setNewSpell({ ...newSpell, school: e.target.value })
                        }
                        className="bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={newSpell.desc}
                      onChange={(e) =>
                        setNewSpell({ ...newSpell, desc: e.target.value })
                      }
                      className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none h-16 resize-none"
                    />
                  </div>
                  <button
                    onClick={addSpell}
                    className="w-full py-2 bg-yellow-600 text-stone-100 text-xs font-bold rounded hover:bg-yellow-500"
                  >
                    Add
                  </button>
                </div>
              )}
              <div>
                <h3 className="text-stone-500 font-bold text-xs uppercase mb-2">
                  {t("cantrips")} (0)
                </h3>
                <div className="space-y-2">
                  {mySpells
                    .filter((s) => s.level === 0)
                    .map((spell) => (
                      <div
                        key={spell.id}
                        className="bg-stone-800 p-3 rounded-lg border border-stone-700 flex justify-between items-center group cursor-pointer hover:border-yellow-500/50 relative"
                        onClick={() =>
                          rollDice(`${spell.name}`, spellAttackBonus)
                        }
                      >
                        <div>
                          <p className="font-bold text-stone-200 text-sm">
                            {spell.name}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {spell.school}
                          </p>
                        </div>
                        <BookOpen
                          size={16}
                          className="text-stone-600 group-hover:text-yellow-500"
                        />
                        <button
                          onClick={(e) => removeSpell(spell.id, e)}
                          className="p-2 text-stone-600 hover:text-red-500 hover:bg-stone-900 rounded-full transition opacity-0 group-hover:opacity-100 absolute right-1 top-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              {[1, 2, 3].map((lvl) => {
                const spellsOfLevel = mySpells.filter((s) => s.level === lvl);
                if (spellsOfLevel.length === 0 && lvl > 1) return null;
                return (
                  <div key={lvl}>
                    <h3 className="text-stone-500 font-bold text-xs uppercase mb-2">
                      {t("level")} {lvl}
                    </h3>
                    <div className="space-y-2">
                      {spellsOfLevel.map((spell) => (
                        <div
                          key={spell.id}
                          className="bg-stone-800 p-3 rounded-lg border border-stone-700 flex justify-between items-center group cursor-pointer hover:border-yellow-500/50 relative"
                          onClick={() =>
                            rollDice(`${spell.name}`, spellAttackBonus)
                          }
                        >
                          <div className="pr-6">
                            <p className="font-bold text-stone-200 text-sm">
                              {spell.name}
                            </p>
                            <p className="text-[10px] text-stone-500 line-clamp-2">
                              {spell.desc}
                            </p>
                          </div>
                          {spell.desc.toLowerCase().includes("damage") && (
                            <div className="bg-stone-900 px-2 py-1 rounded text-xs font-bold text-stone-400 group-hover:text-yellow-500">
                              Roll
                            </div>
                          )}
                          <button
                            onClick={(e) => removeSpell(spell.id, e)}
                            className="p-2 text-stone-600 hover:text-red-500 hover:bg-stone-900 rounded-full transition opacity-0 group-hover:opacity-100 absolute right-1 top-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INVENTORY (Igual) */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
              <h3 className="text-stone-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                <span className="text-yellow-500">●</span> {t("currency")}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {["cp", "sp", "ep", "gp", "pp"].map((coin) => (
                  <div key={coin} className="flex flex-col items-center">
                    <label className="text-[10px] uppercase font-bold text-stone-500 mb-1">
                      {coin}
                    </label>
                    <input
                      type="number"
                      value={money[coin]}
                      onChange={(e) => updateMoney(coin, e.target.value)}
                      className="w-full bg-stone-900 border border-stone-600 rounded-lg p-1 text-center text-sm font-bold text-stone-200 focus:border-yellow-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Backpack size={16} /> {t("equipment")}
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder={t("addItem")}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-200 placeholder-stone-500 focus:border-yellow-500 outline-none"
                />
                <button
                  onClick={addItem}
                  className="bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-200 w-12 rounded-xl flex items-center justify-center transition"
                >
                  <Plus />
                </button>
              </div>
              <div className="space-y-2">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700/50 hover:bg-stone-800 transition"
                  >
                    <span className="text-stone-200">{item.name}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-600 hover:text-red-400 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <p className="text-center text-stone-600 text-sm py-4">
                    Your backpack is empty.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE (Igual) */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in slide-in-from-right duration-200">
            <div className="bg-stone-800 p-5 rounded-xl border border-stone-700">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-700">
                <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center border-2 border-yellow-500/50">
                  <User size={32} className="text-stone-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-100">
                    {hero.name}
                  </h2>
                  <p className="text-stone-400 text-sm">
                    {details.alignment} {hero.race} {hero.class}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-bold">
                    {t("background")}
                  </span>
                  <p className="text-stone-200">
                    {details.background || "Unknown"}
                  </p>
                </div>
                <div
                  onClick={() => setEditingStat("xp")}
                  className="cursor-pointer group"
                >
                  <span className="text-xs text-stone-500 uppercase font-bold group-hover:text-yellow-500">
                    {t("xp")} ({t("edit")})
                  </span>
                  <p className="text-stone-200 font-mono">{xp} XP</p>
                </div>
              </div>
            </div>
            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <PenTool size={16} /> Core Attributes
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(stats).map((statName) => (
                  <div
                    key={statName}
                    onClick={() => setEditingStat(statName)}
                    className="bg-stone-900 p-2 rounded-lg border border-stone-600 hover:border-yellow-500 cursor-pointer flex flex-col items-center"
                  >
                    <span className="text-[10px] uppercase text-stone-500 font-bold">
                      {t(statName).slice(0, 3)}
                    </span>
                    <span className="text-lg font-bold text-stone-100">
                      {stats[statName]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <Settings size={16} /> {t("appearance")}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("age")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.age || "--"}
                  </span>
                </div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("height")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.height || "--"}
                  </span>
                </div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("weight")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.weight || "--"}
                  </span>
                </div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("eyes")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.eyes || "--"}
                  </span>
                </div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("skin")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.skin || "--"}
                  </span>
                </div>
                <div className="bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <span className="block text-[10px] text-stone-500 uppercase">
                    {t("hair")}
                  </span>
                  <span className="text-sm font-bold text-stone-200">
                    {details.hair || "--"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                <h3 className="text-stone-500 font-bold text-xs uppercase mb-1 flex items-center gap-2">
                  <Quote size={12} /> {t("traits")}
                </h3>
                <p className="text-stone-200 text-sm italic">
                  "{details.traits || "..."}"
                </p>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                <h3 className="text-stone-500 font-bold text-xs uppercase mb-1">
                  {t("ideals")}
                </h3>
                <p className="text-stone-200 text-sm">
                  {details.ideals || "..."}
                </p>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                <h3 className="text-stone-500 font-bold text-xs uppercase mb-1">
                  {t("bonds")}
                </h3>
                <p className="text-stone-200 text-sm">
                  {details.bonds || "..."}
                </p>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 border-red-900/30">
                <h3 className="text-red-400 font-bold text-xs uppercase mb-1">
                  {t("flaws")}
                </h3>
                <p className="text-stone-300 text-sm">
                  {details.flaws || "..."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 border-dashed">
                <h3 className="text-stone-400 font-bold text-sm mb-2 uppercase flex items-center gap-2">
                  <Users size={16} /> {t("allies")}
                </h3>
                <textarea
                  className="w-full bg-transparent text-stone-300 text-sm italic outline-none resize-none h-20 placeholder-stone-600"
                  placeholder="..."
                  defaultValue={details.allies || ""}
                ></textarea>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 border-dashed">
                <h3 className="text-stone-400 font-bold text-sm mb-2 uppercase flex items-center gap-2">
                  <Gem size={16} /> {t("treasure")}
                </h3>
                <textarea
                  className="w-full bg-transparent text-stone-300 text-sm italic outline-none resize-none h-20 placeholder-stone-600"
                  placeholder="..."
                  defaultValue={details.treasure || ""}
                ></textarea>
              </div>
              <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 border-dashed">
                <h3 className="text-stone-400 font-bold text-sm mb-2 uppercase flex items-center gap-2">
                  <ScrollText size={16} /> {t("backstory")}
                </h3>
                <p className="text-sm text-stone-500 italic leading-relaxed">
                  {details.backstory || "No backstory written yet."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL RESULTADOS (IGUAL) */}
      {rollResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm relative text-center">
            <button
              onClick={() => setRollResult(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white"
            >
              <X />
            </button>
            <h3 className="text-stone-400 text-sm uppercase font-bold tracking-widest mb-4">
              {rollResult.title}
            </h3>
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 text-4xl font-bold ${
                rollResult.isCrit
                  ? "border-yellow-500 text-yellow-500 shadow-yellow-500/20 shadow-lg"
                  : ""
              } ${
                rollResult.isFail
                  ? "border-red-600 text-red-600"
                  : "border-stone-600 text-stone-200"
              }`}
            >
              {rollResult.roll}
            </div>
            <div className="text-stone-500 text-sm mb-6 flex justify-center gap-2 items-center font-mono bg-stone-950/50 py-2 rounded-lg">
              <span>Roll {rollResult.roll}</span>
              <span>
                {rollResult.mod >= 0 ? "+" : "-"} {Math.abs(rollResult.mod)}
              </span>
              <span>=</span>
              <span className="text-xl font-bold text-stone-200">
                {rollResult.total}
              </span>
            </div>
            <button
              onClick={() => setRollResult(null)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
