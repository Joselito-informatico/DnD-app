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
  Search,
  Dices,
  Share2,
  Download,
  Copy,
  Edit3,
  Hammer,
  ToggleLeft,
  ToggleRight,
  ChevronsUp,
  ChevronsDown,
  MinusCircle,
} from "lucide-react";
import {
  CLASSES,
  SKILLS,
  SPELLS as SRD_SPELLS,
  CONDITIONS,
  XP_TABLE,
} from "../data/srd";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { searchSpells, searchEquipment } from "../utils/dndApi";
import { rollDamage } from "../utils/dice";
import { calculateAC } from "../utils/rules";

export function CombatView({ hero, onBack, onUpdateHero, onDeleteHero }) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("combat");
  const [showMenu, setShowMenu] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [isEditingMaxHP, setIsEditingMaxHP] = useState(false);

  // ESTADOS DE JUEGO
  const [rollMode, setRollMode] = useState("normal"); // 'normal', 'adv', 'dis'
  const [rollResult, setRollResult] = useState(null);
  const [showShortRest, setShowShortRest] = useState(false); // Nuevo Modal

  // Modales de Creación
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
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", max: "3" });
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [newFeature, setNewFeature] = useState({ name: "", desc: "" });

  // Utilidades UI
  const [showDiceTray, setShowDiceTray] = useState(false);
  const [diceMod, setDiceMod] = useState(0);
  const [newItemName, setNewItemName] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [itemResults, setItemResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const fallbackMaxHP = 10 + mods.con + (hero.level - 1) * 6;
  const maxHP = hero.maxHP || fallbackMaxHP;
  const currentHP = hero.currentHP ?? maxHP;
  const hpPercent = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

  // AC Calculation
  let calculatedAC = calculateAC(hero.inventory || [], mods.dex, hero.features);
  const hasArmor = (hero.inventory || []).some(
    (i) => i.isEquipped && i.type === "armor" && i.armorType !== "shield"
  );
  const hasBarbarianDefense = (hero.features || []).some(
    (f) => f.name === "Unarmored Defense" && f.desc.includes("CON")
  );
  const hasMonkDefense = (hero.features || []).some(
    (f) => f.name === "Unarmored Defense" && f.desc.includes("WIS")
  );

  if (!hasArmor) {
    if (hasBarbarianDefense) calculatedAC = 10 + mods.dex + mods.con;
    if (hasMonkDefense) calculatedAC = 10 + mods.dex + mods.wis;
    const equippedShield = (hero.inventory || []).find(
      (i) => i.isEquipped && (i.type === "shield" || i.armorType === "shield")
    );
    if (equippedShield && hasBarbarianDefense)
      calculatedAC += parseInt(equippedShield.ac) || 2;
  }
  const armorClass = calculatedAC;
  const initiative = mods.dex >= 0 ? `+${mods.dex}` : mods.dex;

  const inspiration = hero.inspiration || false;
  const skillProfs = hero.skillProfs || [];
  const isPerceptionProf = skillProfs.includes("Perception");
  const passivePerception =
    10 + mods.wis + (isPerceptionProf ? proficiencyBonus : 0);

  const heroClassData = CLASSES.find((c) => c.name === hero.class);
  const saveProficiencies =
    hero.saveProficiencies || (heroClassData ? heroClassData.saves : []);
  const proficiencies = heroClassData ? heroClassData.proficiencies : [];
  const hitDieType = heroClassData ? heroClassData.hitDie : "d8";
  const hitDiceUsed = hero.hitDiceUsed || 0;
  const hitDiceTotal = hero.level;
  const deathSaves = hero.deathSaves || { successes: 0, failures: 0 };
  const xp = hero.xp || 0;

  const currentLevelBaseXP = XP_TABLE[hero.level] || 0;
  const nextLevelBaseXP = XP_TABLE[hero.level + 1] || currentLevelBaseXP;
  const xpProgress =
    nextLevelBaseXP > currentLevelBaseXP
      ? ((xp - currentLevelBaseXP) / (nextLevelBaseXP - currentLevelBaseXP)) *
        100
      : 100;

  const resources = hero.resources || [];
  const features = hero.features || [];
  const activeConditions = hero.conditions || [];
  const exhaustionLevel = hero.exhaustion || 0;
  const weapons = hero.weapons || [];
  const details = hero.details || {
    alignment: "Unknown",
    background: "Unknown",
  };
  const inventory = hero.inventory || [];
  const money = hero.money || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
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
  const languages = ["Common"];
  if (hero.race === "Elf") languages.push("Elvish");
  if (hero.race === "Dwarf") languages.push("Dwarvish");
  if (hero.race === "Tiefling") languages.push("Infernal");
  if (hero.race === "Human") languages.push("One extra choice");

  // --- ACTIONS ---

  // 1. Core Logic for d20 with Adv/Dis
  const getD20Roll = () => {
    const r1 = Math.floor(Math.random() * 20) + 1;
    const r2 = Math.floor(Math.random() * 20) + 1;

    let result = r1;
    let dropped = null;
    let type = "normal";

    if (rollMode === "adv") {
      result = Math.max(r1, r2);
      dropped = Math.min(r1, r2);
      type = "adv";
    } else if (rollMode === "dis") {
      result = Math.min(r1, r2);
      dropped = Math.max(r1, r2);
      type = "dis";
    }

    // Reset mode after roll (optional, usually preferred in apps)
    setRollMode("normal");

    return { result, dropped, type };
  };

  const rollCheck = (name, modifier) => {
    const { result, dropped, type } = getD20Roll();
    setRollResult({
      type: "check",
      title: name,
      roll: result,
      droppedRoll: dropped, // For visual
      rollType: type, // 'normal', 'adv', 'dis'
      mod: modifier,
      total: result + modifier,
      isCrit: result === 20,
      isFail: result === 1,
    });
    if (result === 20) showToast("Natural 20!", "success");
    if (result === 1) showToast("Critical Fail...", "error");
  };

  const rollAttack = (name, modifier, damageDice, damageStat) => {
    const { result, dropped, type } = getD20Roll();
    const dmgMod = damageStat ? mods[damageStat] : 0;
    setRollResult({
      type: "attack",
      title: `${name} Attack`,
      roll: result,
      droppedRoll: dropped,
      rollType: type,
      mod: modifier,
      total: result + modifier,
      isCrit: result === 20,
      isFail: result === 1,
      damageDice: damageDice,
      damageMod: dmgMod,
    });
    if (result === 20) showToast("CRITICAL HIT!", "success");
  };

  const handleDamageRoll = () => {
    if (!rollResult || !rollResult.damageDice) return;
    const isCrit = rollResult.isCrit;
    const { total, rolls, formula } = rollDamage(rollResult.damageDice, isCrit);
    const finalTotal = total + rollResult.damageMod;
    setRollResult({
      type: "damage",
      title: isCrit ? t("critDamage") : t("totalDmg"),
      roll: total,
      diceRolls: rolls,
      mod: rollResult.damageMod,
      total: finalTotal,
      formula: formula,
      isCrit: isCrit,
    });
  };

  const toggleEquip = (itemId) => {
    const updatedInventory = inventory.map((item) => {
      if (item.id === itemId) return { ...item, isEquipped: !item.isEquipped };
      const currentItem = inventory.find((i) => i.id === itemId);
      if (
        currentItem &&
        currentItem.type === "armor" &&
        currentItem.armorType !== "shield"
      ) {
        if (
          item.type === "armor" &&
          item.armorType !== "shield" &&
          item.id !== itemId
        )
          return { ...item, isEquipped: false };
      }
      return item;
    });
    onUpdateHero({ ...hero, inventory: updatedInventory });
  };

  // RESTING
  const handleShortRestClick = () => {
    setShowMenu(false);
    setShowShortRest(true);
  };

  const handleApplyHeal = (amount, diceCost) => {
    const newHP = Math.min(maxHP, currentHP + amount);
    const newHitDiceUsed = hitDiceUsed + diceCost;
    onUpdateHero({ ...hero, currentHP: newHP, hitDiceUsed: newHitDiceUsed });
    showToast(`Healed ${amount} HP`, "success");
  };

  // ... Standard Updaters ...
  const updateXP = (val) => {
    const newXP = Math.max(0, parseInt(val) || 0);
    let newLevel = 1;
    for (let lvl = 20; lvl >= 1; lvl--) {
      if (newXP >= XP_TABLE[lvl]) {
        newLevel = lvl;
        break;
      }
    }
    if (newLevel > hero.level)
      showToast(`🎉 Level Up! Level ${newLevel}`, "success");
    onUpdateHero({ ...hero, xp: newXP, level: newLevel });
    setEditingStat(null);
  };
  const updateLevel = (val) => {
    const lvl = Math.max(1, Math.min(20, parseInt(val) || 1));
    const baseXP = XP_TABLE[lvl] || 0;
    onUpdateHero({ ...hero, level: lvl, xp: baseXP });
    setEditingStat(null);
    showToast(`Level set to ${lvl}`, "info");
  };
  const updateMaxHP = (newVal) => {
    const val = parseInt(newVal) || 1;
    onUpdateHero({
      ...hero,
      maxHP: val,
      currentHP: Math.min(hero.currentHP, val),
    });
    setIsEditingMaxHP(false);
    showToast(`Max HP set to ${val}`, "success");
  };
  const handleLongRest = () => {
    const resetSlots = { ...spellSlots };
    Object.keys(resetSlots).forEach((level) => (resetSlots[level].used = 0));
    const regainedHitDice = Math.max(1, Math.floor(hitDiceTotal / 2));
    const newHitDiceUsed = Math.max(0, hitDiceUsed - regainedHitDice);
    const newExhaustion = Math.max(0, exhaustionLevel - 1);
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
    showToast("Long Rest: Stats & Resources restored", "success");
  };

  // ... Others ...
  const addFeature = () => {
    if (!newFeature.name) return;
    const feat = { id: Date.now(), ...newFeature };
    onUpdateHero({ ...hero, features: [...features, feat] });
    setIsAddingFeature(false);
    setNewFeature({ name: "", desc: "" });
    showToast("Feature added", "success");
  };
  const removeFeature = (featId) => {
    if (confirm("Delete this feature?")) {
      onUpdateHero({
        ...hero,
        features: features.filter((f) => f.id !== featId),
      });
    }
  };
  const rollGeneric = (sides) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    const total = roll + parseInt(diceMod || 0);
    setRollResult({
      type: "check",
      title: `d${sides} Roll`,
      roll: roll,
      mod: parseInt(diceMod || 0),
      total: total,
      isCrit: sides === 20 && roll === 20,
      isFail: sides === 20 && roll === 1,
    });
    setShowDiceTray(false);
  };
  const updateAttribute = (statName, val) => {
    const newVal = Math.max(1, Math.min(30, parseInt(val) || 10));
    onUpdateHero({ ...hero, stats: { ...hero.stats, [statName]: newVal } });
    setEditingStat(null);
    showToast(`${statName.toUpperCase()} updated`, "success");
  };
  const handleExportJSON = () => {
    const dataStr = JSON.stringify([hero], null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${hero.name.replace(/\s+/g, "_")}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
    showToast(t("successImport"), "success");
  };
  const handleCopySummary = () => {
    const summary = `**${hero.name}** | ${hero.race} ${hero.class} ${hero.level}\n❤️ HP: ${currentHP}/${maxHP} | 🛡️ AC: ${armorClass} | ⚡ Init: ${initiative}\n📝 PP: ${passivePerception} | DC: ${spellSaveDC}`;
    navigator.clipboard.writeText(summary);
    setShowMenu(false);
    showToast(t("copied"), "success");
  };
  const handleSpellSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    const results = await searchSpells(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };
  const selectSpell = (apiSpell) => {
    setNewSpell({
      name: apiSpell.name,
      level: apiSpell.level,
      school: apiSpell.school,
      desc: apiSpell.desc,
      time: apiSpell.time,
    });
    setSearchResults([]);
    setSearchQuery("");
  };
  const handleItemSearch = async () => {
    if (!itemQuery) return;
    setIsSearching(true);
    const results = await searchEquipment(itemQuery);
    setItemResults(results);
    setIsSearching(false);
  };
  const selectItem = (item) => {
    const newItem = {
      id: Date.now(),
      name: item.name,
      qty: 1,
      desc: item.properties
        ? item.properties.join(", ")
        : item.ac
        ? `AC ${item.ac}`
        : "",
      type: item.equipment_category?.toLowerCase().includes("armor")
        ? "armor"
        : item.equipment_category?.toLowerCase().includes("weapon")
        ? "weapon"
        : "item",
      ac: item.armor_class?.base || 0,
      armorType:
        item.armor_category === "Shield" ? "shield" : item.armor_category,
      isEquipped: false,
    };
    let newInventoryList = [...inventory, newItem];
    let newWeaponsList = weapons;
    if (newItem.type === "weapon") {
      if (confirm(`Add ${item.name} to Attacks?`)) {
        const isFinesse =
          item.properties && item.properties.includes("Finesse");
        const attackStat = isFinesse ? "dex" : "str";
        const newWep = {
          id: Date.now() + 1,
          name: item.name,
          damage: item.damage_dice || "1d6",
          stat: attackStat,
          type: "melee",
        };
        newWeaponsList = [...weapons, newWep];
        showToast("Added to Inventory & Attacks", "success");
      } else {
        showToast("Added to Inventory", "success");
      }
    } else {
      showToast(`${item.name} added`, "success");
    }
    onUpdateHero({
      ...hero,
      inventory: newInventoryList,
      weapons: newWeaponsList,
    });
    setItemResults([]);
    setItemQuery("");
  };
  const addResource = () => {
    if (!newResource.name) return;
    const maxVal = parseInt(newResource.max) || 1;
    const resourceToAdd = {
      id: Date.now(),
      name: newResource.name,
      max: maxVal,
      current: maxVal,
    };
    onUpdateHero({ ...hero, resources: [...resources, resourceToAdd] });
    setIsAddingResource(false);
    setNewResource({ name: "", max: "3" });
    showToast("Tracker created", "success");
  };
  const removeResource = (resId, e) => {
    e.stopPropagation();
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
    let newConditions = exists
      ? activeConditions.filter((c) => c !== conditionId)
      : [...activeConditions, conditionId];
    if (!exists) showToast("Condition applied", "error");
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
  const useHitDie = () => {
    if (hitDiceUsed < hitDiceTotal) {
      const dieMax = parseInt(hitDieType.substring(1));
      const roll = Math.floor(Math.random() * dieMax) + 1;
      const healAmount = Math.max(0, roll + mods.con);
      const newHP = Math.min(maxHP, currentHP + healAmount);
      onUpdateHero({ ...hero, currentHP: newHP, hitDiceUsed: hitDiceUsed + 1 });
      setRollResult({
        type: "check",
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
  const changeHP = (val) => {
    const newHP = Math.min(maxHP, Math.max(0, currentHP + val));
    const newSaves =
      currentHP === 0 && val > 0 ? { successes: 0, failures: 0 } : deathSaves;
    onUpdateHero({ ...hero, currentHP: newHP, deathSaves: newSaves });
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 pb-20 relative">
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

      {/* MENÚ EXPANDIDO */}
      {showMenu && (
        <div className="absolute top-20 right-6 z-20 w-56 bg-stone-800 border border-stone-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          {/* BOTÓN SHORT REST ACTUALIZADO */}
          <button
            onClick={handleShortRestClick}
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
            onClick={handleCopySummary}
            className="w-full text-left px-4 py-3 text-stone-200 hover:bg-stone-700 flex items-center gap-3 border-b border-stone-700/50"
          >
            <Copy size={16} className="text-emerald-400" /> {t("copySummary")}
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full text-left px-4 py-3 text-stone-200 hover:bg-stone-700 flex items-center gap-3 border-b border-stone-700/50"
          >
            <Download size={16} className="text-purple-400" /> {t("exportJSON")}
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 flex items-center gap-3"
          >
            <Trash2 size={16} /> {t("deleteHero")}
          </button>
        </div>
      )}

      {/* MODALS (Edit, HP, Slots) ... */}
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
      {isEditingMaxHP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl w-full max-w-xs animate-in zoom-in duration-200">
            <h3 className="text-stone-100 font-bold mb-4">{t("editMaxHP")}</h3>
            <p className="text-xs text-stone-500 mb-2">
              {t("currentMax")}: {maxHP}
            </p>
            <input
              type="number"
              autoFocus
              placeholder={maxHP}
              className="w-full bg-stone-950 border border-stone-600 rounded-lg p-3 text-stone-100 mb-4 focus:border-yellow-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateMaxHP(e.target.value);
                }
              }}
            />
            <button
              onClick={() => setIsEditingMaxHP(false)}
              className="w-full py-2 bg-stone-800 text-stone-400 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isEditingSlots && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl w-full max-w-sm animate-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-stone-100 font-bold">Manage Spell Slots</h3>
              <button onClick={() => setIsEditingSlots(false)}>
                <X className="text-stone-500 hover:text-white" />
              </button>
            </div>
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

      {/* NUEVO: MODAL SHORT REST */}
      {showShortRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-2xl w-full max-w-sm relative">
            <button
              onClick={() => setShowShortRest(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white"
            >
              <X />
            </button>
            <h3 className="text-stone-100 font-bold mb-2 flex items-center gap-2">
              <Coffee className="text-orange-400" size={20} /> {t("shortRest")}
            </h3>

            <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 mb-4 text-center">
              <p className="text-stone-400 text-xs uppercase font-bold mb-1">
                {t("hitDiceRemaining")}
              </p>
              <div className="text-3xl font-bold text-white mb-2">
                {hitDiceTotal - hitDiceUsed}{" "}
                <span className="text-stone-500 text-lg">/ {hitDiceTotal}</span>
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: hitDiceTotal }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < hitDiceTotal - hitDiceUsed
                        ? "bg-orange-500"
                        : "bg-stone-700"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  if (hitDiceUsed < hitDiceTotal) {
                    // Lógica de tirada simple integrada
                    const dieMax = parseInt(hitDieType.substring(1));
                    const roll = Math.floor(Math.random() * dieMax) + 1;
                    handleApplyHeal(Math.max(0, roll + mods.con), 1);
                  } else {
                    showToast("No Hit Dice left!", "error");
                  }
                }}
                disabled={hitDiceUsed >= hitDiceTotal || currentHP >= maxHP}
                className="w-full py-4 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl mb-3 flex flex-col items-center justify-center gap-1"
              >
                <span>Roll Hit Die</span>
                <span className="text-xs text-stone-400 font-normal">
                  1{hitDieType} + {mods.con}
                </span>
              </button>

              <button
                onClick={() => setShowShortRest(false)}
                className="text-stone-500 text-sm hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setShowDiceTray(true)}
          className="bg-yellow-600 hover:bg-yellow-500 text-stone-900 p-4 rounded-full shadow-lg shadow-black/50 transition-transform hover:scale-110 active:scale-95 border-2 border-yellow-400"
        >
          <Dices size={24} />
        </button>
      </div>
      {showDiceTray && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-700 p-6 rounded-t-2xl sm:rounded-2xl w-full max-w-sm relative">
            <button
              onClick={() => setShowDiceTray(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white"
            >
              <X />
            </button>
            <h3 className="text-stone-100 font-bold mb-4 flex items-center gap-2">
              <Dices className="text-yellow-500" /> {t("diceTray")}
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[4, 6, 8, 10, 12, 20].map((sides) => (
                <button
                  key={sides}
                  onClick={() => rollGeneric(sides)}
                  className="bg-stone-800 border border-stone-600 hover:border-yellow-500 p-3 rounded-xl flex flex-col items-center gap-1 transition"
                >
                  <span className="text-xs text-stone-500 font-bold">
                    d{sides}
                  </span>
                  <Dices size={24} className="text-stone-300" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-xl border border-stone-700">
              <span className="text-xs font-bold text-stone-500 uppercase">
                Modifier
              </span>
              <button
                onClick={() => setDiceMod((prev) => prev - 1)}
                className="w-8 h-8 bg-stone-800 rounded flex items-center justify-center text-stone-400 hover:text-white"
              >
                -
              </button>
              <span className="font-mono text-xl text-stone-100 w-8 text-center">
                {diceMod > 0 ? `+${diceMod}` : diceMod}
              </span>
              <button
                onClick={() => setDiceMod((prev) => prev + 1)}
                className="w-8 h-8 bg-stone-800 rounded flex items-center justify-center text-stone-400 hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div
        className="flex-1 overflow-y-auto px-6 space-y-6 pb-24"
        onClick={() => setShowMenu(false)}
      >
        {activeTab === "combat" && (
          <div className="space-y-6 animate-in slide-in-from-left duration-200">
            {/* INICIATIVA + ADVANTAGE TOGGLE */}
            <div className="flex gap-3 mb-2">
              <button
                onClick={toggleInspiration}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition w-16 shrink-0 ${
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

              {/* TOGGLE ADVANTAGE/DISADVANTAGE */}
              <div className="flex-1 bg-stone-800 rounded-xl border border-stone-700 flex p-1 relative">
                {/* Fondo animado del toggle */}
                <div
                  className={`absolute top-1 bottom-1 w-[32%] bg-stone-700 rounded-lg transition-all duration-300 ${
                    rollMode === "adv"
                      ? "left-[34%]"
                      : rollMode === "dis"
                      ? "left-[67%]"
                      : "left-1"
                  }`}
                ></div>

                <button
                  onClick={() =>
                    setRollMode(rollMode === "normal" ? "normal" : "normal")
                  }
                  className={`flex-1 z-10 text-[10px] font-bold uppercase py-2 rounded-lg transition ${
                    rollMode === "normal" ? "text-white" : "text-stone-500"
                  }`}
                >
                  {t("normal")}
                </button>
                <button
                  onClick={() =>
                    setRollMode(rollMode === "adv" ? "normal" : "adv")
                  }
                  className={`flex-1 z-10 text-[10px] font-bold uppercase py-2 rounded-lg transition ${
                    rollMode === "adv" ? "text-green-400" : "text-stone-500"
                  }`}
                >
                  {t("advantage")}
                </button>
                <button
                  onClick={() =>
                    setRollMode(rollMode === "dis" ? "normal" : "dis")
                  }
                  className={`flex-1 z-10 text-[10px] font-bold uppercase py-2 rounded-lg transition ${
                    rollMode === "dis" ? "text-red-400" : "text-stone-500"
                  }`}
                >
                  {t("disadvantage")}
                </button>
              </div>

              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center w-16 shrink-0">
                <Zap className="text-yellow-600 mb-1 w-5 h-5" />
                <span className="text-xs text-stone-400 font-bold uppercase">
                  {t("init")}
                </span>
                <span className="text-xl font-bold text-yellow-500">
                  {initiative}
                </span>
              </div>
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
                onClick={() => setIsEditingMaxHP(true)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition duration-300 relative overflow-hidden cursor-pointer hover:border-yellow-500 ${
                  currentHP === 0
                    ? "bg-red-900/30 border-red-500 animate-pulse"
                    : "bg-stone-800 border-stone-700"
                }`}
              >
                <div className="absolute bottom-0 left-0 h-1 bg-stone-700 w-full">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${hpPercent}%` }}
                  ></div>
                </div>
                <Heart
                  className={`mb-1 w-5 h-5 ${
                    currentHP === 0 ? "text-red-500" : "text-red-500"
                  }`}
                />
                <span className="text-xs text-stone-400 font-bold uppercase">
                  {t("hp")}
                </span>
                <span className="text-xl font-bold text-stone-100 z-10">
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

            {/* Resources/Conditions/Attacks (Igual) */}
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
                    placeholder="Name"
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
                    Add
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
                    <button
                      onClick={(e) => removeResource(res.id, e)}
                      className="absolute -left-2 -top-2 bg-stone-800 text-stone-500 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg border border-stone-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
            {/* (El bloque de Hit Dice se movio al Modal de Short Rest, aqui ya no es necesario o se deja como resumen) */}

            {/* ATTACKS */}
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
                      onClick={() => rollAttack(w.name, mod, w.damage, w.stat)}
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
            {/* CUSTOM FEATURES (Igual) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-stone-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} /> {t("features")}
                </h3>
                <button
                  onClick={() => setIsAddingFeature(!isAddingFeature)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingFeature ? <X size={12} /> : <Plus size={12} />}{" "}
                  {t("addFeature")}
                </button>
              </div>
              {isAddingFeature && (
                <div className="bg-stone-800 p-3 rounded-xl border border-yellow-500/50 mb-3 animate-in fade-in zoom-in duration-200">
                  <input
                    type="text"
                    placeholder={t("featureName")}
                    value={newFeature.name}
                    onChange={(e) =>
                      setNewFeature({ ...newFeature, name: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none mb-2 focus:border-yellow-500"
                  />
                  <textarea
                    placeholder={t("featureDesc")}
                    value={newFeature.desc}
                    onChange={(e) =>
                      setNewFeature({ ...newFeature, desc: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-600 rounded p-2 text-xs text-white outline-none h-16 resize-none mb-2"
                  />
                  <button
                    onClick={addFeature}
                    className="w-full py-2 bg-yellow-600 text-stone-100 text-xs font-bold rounded hover:bg-yellow-500"
                  >
                    Add Feature
                  </button>
                </div>
              )}
              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-800 p-3 rounded-xl border border-stone-700 relative group"
                  >
                    <h4 className="font-bold text-stone-200 text-sm">
                      {feat.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                    <button
                      onClick={() => removeFeature(feat.id)}
                      className="absolute top-2 right-2 text-stone-600 hover:text-red-500 hover:bg-stone-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ... (SKILLS, SPELLS, INVENTORY, PROFILE - Mantienen igual) ... */}
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
                        rollCheck(`${stat.toUpperCase()} Save`, saveMod)
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
                      onClick={() => rollCheck(skill.name, totalMod)}
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
            </div>
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddingSpell(!isAddingSpell)}
                  className="text-xs bg-stone-800 border border-stone-600 px-2 py-1 rounded text-stone-300 hover:text-white hover:border-yellow-500 flex items-center gap-1"
                >
                  {isAddingSpell ? <X size={12} /> : <Plus size={12} />}{" "}
                  {t("scribe")}
                </button>
              </div>
              {isAddingSpell && (
                <div className="bg-stone-800 p-3 rounded-xl border border-yellow-500/50 mb-3 animate-in fade-in zoom-in duration-200 relative">
                  <div className="mb-4 relative">
                    <div className="flex items-center gap-2 bg-stone-900 border border-stone-600 rounded-lg p-2 focus-within:border-yellow-500">
                      <Search size={16} className="text-stone-500" />
                      <input
                        type="text"
                        placeholder={t("searchSpell")}
                        className="bg-transparent w-full text-xs text-stone-100 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSpellSearch()
                        }
                      />
                      <button
                        onClick={handleSpellSearch}
                        className="text-xs font-bold text-yellow-600 hover:text-yellow-500 uppercase"
                      >
                        {isSearching ? t("searching") : "GO"}
                      </button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-stone-800 border border-stone-600 rounded-b-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                        {searchResults.map((res, i) => (
                          <button
                            key={i}
                            onClick={() => selectSpell(res)}
                            className="w-full text-left p-2 text-xs text-stone-300 hover:bg-stone-700 border-b border-stone-700/50 last:border-0 flex justify-between"
                          >
                            <span>{res.name}</span>
                            <span className="text-stone-500">
                              {res.level === 0 ? "Cantrip" : `Lvl ${res.level}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase font-bold mb-2 tracking-wider text-center">
                    - {t("manualMode")} -
                  </div>
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
                        <option value="4">Level 4</option>
                        <option value="5">Level 5</option>
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
                    Add to Spellbook
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
                          rollAttack(spell.name, spellAttackBonus, null, null)
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
              {[1, 2, 3, 4, 5].map((lvl) => {
                const spellsOfLevel = mySpells.filter((s) => s.level === lvl);
                if (spellsOfLevel.length === 0 && !spellSlots[lvl]?.total)
                  return null;
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
                            rollAttack(spell.name, spellAttackBonus, null, null)
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
              <div className="mb-4 relative">
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-600 rounded-lg p-2 focus-within:border-yellow-500">
                  <Search size={16} className="text-stone-500" />
                  <input
                    type="text"
                    placeholder={t("searchItem")}
                    className="bg-transparent w-full text-xs text-stone-100 outline-none"
                    value={itemQuery}
                    onChange={(e) => setItemQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleItemSearch()}
                  />
                  <button
                    onClick={handleItemSearch}
                    className="text-xs font-bold text-yellow-600 hover:text-yellow-500 uppercase"
                  >
                    {isSearching ? "..." : "GO"}
                  </button>
                </div>
                {itemResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-stone-800 border border-stone-600 rounded-b-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                    {itemResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => selectItem(res)}
                        className="w-full text-left p-2 text-xs text-stone-300 hover:bg-stone-700 border-b border-stone-700/50 last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold block">{res.name}</span>
                          <span className="text-[10px] text-stone-500">
                            {res.category} • {res.cost}
                          </span>
                        </div>
                        {res.damage && (
                          <span className="text-yellow-500 font-mono">
                            {res.damage}
                          </span>
                        )}
                        {res.ac && (
                          <span className="text-blue-400 font-mono">
                            AC {res.ac}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder={t("addItem")}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  className="flex-1 bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:border-yellow-500 outline-none"
                />
                <button
                  onClick={addItem}
                  className="bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-200 w-10 rounded-xl flex items-center justify-center transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {inventory.map((item) => {
                  const isWearable =
                    item.type === "armor" ||
                    item.type === "shield" ||
                    item.armorType ||
                    (item.desc && item.desc.includes("AC "));
                  return (
                    <div
                      key={item.id}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition ${
                        item.isEquipped
                          ? "bg-stone-800 border-yellow-500/50 shadow-lg shadow-yellow-500/10"
                          : "bg-stone-800/50 border-stone-700/50 hover:bg-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isWearable && (
                          <button
                            onClick={() => toggleEquip(item.id)}
                            className={`p-1.5 rounded-lg transition ${
                              item.isEquipped
                                ? "bg-yellow-500 text-stone-900"
                                : "bg-stone-900 text-stone-500 hover:text-stone-300 border border-stone-700"
                            }`}
                          >
                            {item.isEquipped ? (
                              <ToggleRight size={18} />
                            ) : (
                              <ToggleLeft size={18} />
                            )}
                          </button>
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${
                              item.isEquipped
                                ? "text-yellow-500 font-bold"
                                : "text-stone-200"
                            }`}
                          >
                            {item.name} {item.isEquipped && "(Equipped)"}
                          </span>
                          {item.desc && (
                            <span className="text-[10px] text-stone-500">
                              {item.desc}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-600 hover:text-red-400 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
                {inventory.length === 0 && (
                  <p className="text-center text-stone-600 text-sm py-4">
                    Backpack empty.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
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
              <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-400 mb-1 font-bold">
                  <span>LEVEL {hero.level}</span>
                  <span
                    onClick={() => setEditingStat("xp")}
                    className="cursor-pointer hover:text-yellow-500"
                  >
                    {xp} / {XP_TABLE[hero.level + 1] || "MAX"} XP{" "}
                    <Edit3 size={10} className="inline" />
                  </span>
                </div>
                <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-700/50">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, xpProgress)}%` }}
                  ></div>
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
                  onClick={() => setEditingStat("level")}
                  className="cursor-pointer group"
                >
                  <span className="text-xs text-stone-500 uppercase font-bold group-hover:text-yellow-500">
                    {t("level")} ({t("edit")})
                  </span>
                  <p className="text-stone-200 font-mono">{hero.level}</p>
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

      {/* MODAL RESULTADOS (MEJORADO CON ADV/DIS) */}
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

            {/* Si es Adv/Dis, mostramos los dos dados */}
            {(rollResult.rollType === "adv" || rollResult.rollType === "dis") &&
            rollResult.droppedRoll ? (
              <div className="flex justify-center items-center gap-4 mb-4">
                {/* Dado descartado */}
                <div className="flex flex-col items-center opacity-50 scale-75">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-stone-600 text-2xl font-bold text-stone-500 bg-stone-950">
                    {rollResult.droppedRoll}
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 uppercase">
                    Dropped
                  </span>
                </div>

                {/* Dado final */}
                <div className="flex flex-col items-center scale-110">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${
                      rollResult.isCrit
                        ? "border-yellow-500 text-yellow-500 shadow-yellow-500/20 shadow-lg"
                        : rollResult.isFail
                        ? "border-red-600 text-red-600"
                        : "border-stone-600 text-stone-200 bg-stone-800"
                    }`}
                  >
                    {rollResult.roll}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 uppercase ${
                      rollResult.rollType === "adv"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {rollResult.rollType === "adv"
                      ? "Advantage"
                      : "Disadvantage"}
                  </span>
                </div>
              </div>
            ) : (
              // Dado normal (solo uno)
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
            )}

            <div className="text-stone-500 text-sm mb-6 flex justify-center gap-2 items-center font-mono bg-stone-950/50 py-2 rounded-lg">
              {rollResult.type === "damage" ? (
                <span>
                  {rollResult.formula} + {rollResult.mod} ={" "}
                  <strong className="text-white text-lg">
                    {rollResult.total}
                  </strong>
                </span>
              ) : (
                <span>
                  Roll {rollResult.roll} {rollResult.mod >= 0 ? "+" : "-"}{" "}
                  {Math.abs(rollResult.mod)} ={" "}
                  <strong className="text-white text-lg">
                    {rollResult.total}
                  </strong>
                </span>
              )}
            </div>

            {/* BOTÓN DE DAÑO */}
            {rollResult.type === "attack" && rollResult.damageDice && (
              <button
                onClick={handleDamageRoll}
                className={`w-full py-3 mb-3 rounded-xl font-bold flex items-center justify-center gap-2 transition
                        ${
                          rollResult.isCrit
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50"
                            : "bg-stone-700 hover:bg-stone-600 text-stone-200"
                        }
                    `}
              >
                <Hammer size={18} /> {t("rollDamage")}{" "}
                {rollResult.isCrit && "(x2)"}
              </button>
            )}

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
