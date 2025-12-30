// SYSTEM REFERENCE DOCUMENT (SRD 5.1) - PLAYER DATA
// Optimized for Offline Use.

export const RACES = [
  {
    id: "dragonborn",
    name: "Dragonborn",
    speed: 30,
    size: "Medium",
    description: "Draconic ancestry with breath weapon.",
    traits: ["Breath Weapon", "Damage Resistance"],
    bonuses: { str: 2, cha: 1 },
  },
  {
    id: "dwarf",
    name: "Dwarf",
    speed: 25,
    size: "Medium",
    description: "Bold and hardy, known for combat skill.",
    traits: ["Darkvision", "Dwarven Resilience"],
    bonuses: { con: 2 },
  },
  {
    id: "elf",
    name: "Elf",
    speed: 30,
    size: "Medium",
    description: "Magical people of otherworldly grace.",
    traits: ["Darkvision", "Keen Senses", "Trance"],
    bonuses: { dex: 2 },
  },
  {
    id: "gnome",
    name: "Gnome",
    speed: 25,
    size: "Small",
    description: "A hum of invention and illusion.",
    traits: ["Darkvision", "Gnome Cunning"],
    bonuses: { int: 2 },
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    speed: 30,
    size: "Medium",
    description: "Combiners of best qualities of elf and human.",
    traits: ["Darkvision", "Fey Ancestry", "Skill Versatility"],
    bonuses: { cha: 2, dex: 1, con: 1 }, // Simplificado para la App
  },
  {
    id: "halfling",
    name: "Halfling",
    speed: 25,
    size: "Small",
    description: "The comforts of home are their goals.",
    traits: ["Lucky", "Brave", "Halfling Nimbleness"],
    bonuses: { dex: 2 },
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    speed: 30,
    size: "Medium",
    description: "Proud chiefs and warriors.",
    traits: ["Darkvision", "Relentless Endurance", "Savage Attacks"],
    bonuses: { str: 2, con: 1 },
  },
  {
    id: "human",
    name: "Human",
    speed: 30,
    size: "Medium",
    description: "Adaptable and ambitious.",
    traits: ["Extra Language", "All Stats +1"],
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
  },
  {
    id: "tiefling",
    name: "Tiefling",
    speed: 30,
    size: "Medium",
    description: "To be greeted with stares and whispers.",
    traits: ["Darkvision", "Hellish Resistance"],
    bonuses: { cha: 2, int: 1 },
  },
];

export const CLASSES = [
  {
    id: "barbarian",
    name: "Barbarian",
    hitDie: "d12",
    primaryStat: "str",
    saves: ["Strength", "Constitution"],
    proficiencies: ["Light/Medium Armor", "Shields", "Simple/Martial Weapons"],
    srdSubclass: "Path of the Berserker",
    startingEquipment: [
      { name: "Greataxe", type: "weapon", damage: "1d12", stat: "str", qty: 1 },
      { name: "Handaxe", type: "weapon", damage: "1d6", stat: "str", qty: 2 },
      { name: "Javelin", type: "weapon", damage: "1d6", stat: "str", qty: 4 },
      { name: "Explorer's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Rage",
        desc: "Bonus Action. Adv on STR checks/saves. Bonus melee dmg. Resistance to B/P/S damage. Ends if unconscious or no attack/dmg taken.",
      },
      {
        name: "Unarmored Defense",
        desc: "AC = 10 + DEX mod + CON mod (while not wearing armor).",
      },
    ],
  },
  {
    id: "bard",
    name: "Bard",
    hitDie: "d8",
    primaryStat: "cha",
    saves: ["Dexterity", "Charisma"],
    proficiencies: [
      "Light Armor",
      "Simple Weapons",
      "Longswords",
      "Rapiers",
      "Shortswords",
    ],
    srdSubclass: "College of Lore",
    spellcasting: { stat: "cha", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Rapier", type: "weapon", damage: "1d8", stat: "dex", qty: 1 },
      { name: "Dagger", type: "weapon", damage: "1d4", stat: "dex", qty: 1 },
      { name: "Leather Armor", type: "armor", ac: 11, qty: 1 },
      { name: "Entertainer's Pack", type: "item", qty: 1 },
      { name: "Lute", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Bardic Inspiration",
        desc: "Bonus Action. Give a creature d6 die to add to one check, attack, or save. Uses: CHA mod (min 1). Regain on Long Rest.",
      },
      {
        name: "Spellcasting",
        desc: "You can cast known bard spells using Charisma.",
      },
    ],
  },
  {
    id: "cleric",
    name: "Cleric",
    hitDie: "d8",
    primaryStat: "wis",
    saves: ["Wisdom", "Charisma"],
    proficiencies: ["Light/Medium Armor", "Shields", "Simple Weapons"],
    srdSubclass: "Life Domain",
    spellcasting: { stat: "wis", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Mace", type: "weapon", damage: "1d6", stat: "str", qty: 1 },
      { name: "Scale Mail", type: "armor", ac: 14, qty: 1 },
      {
        name: "Light Crossbow",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Priest's Pack", type: "item", qty: 1 },
      { name: "Shield", type: "armor", ac: 2, qty: 1 },
    ],
    features: [
      {
        name: "Spellcasting",
        desc: "Prepare spells daily equal to WIS mod + Level. Ritual casting available.",
      },
      {
        name: "Divine Domain",
        desc: "Choose a domain related to your deity (e.g. Life).",
      },
    ],
  },
  {
    id: "druid",
    name: "Druid",
    hitDie: "d8",
    primaryStat: "wis",
    saves: ["Intelligence", "Wisdom"],
    proficiencies: [
      "Light/Medium Armor (Non-metal)",
      "Shields",
      "Simple Weapons",
    ],
    srdSubclass: "Circle of the Land",
    spellcasting: { stat: "wis", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Scimitar", type: "weapon", damage: "1d6", stat: "dex", qty: 1 },
      { name: "Leather Armor", type: "armor", ac: 11, qty: 1 },
      { name: "Wooden Shield", type: "armor", ac: 2, qty: 1 },
      { name: "Explorer's Pack", type: "item", qty: 1 },
      { name: "Druidic Focus", type: "item", qty: 1 },
    ],
    features: [
      { name: "Druidic", desc: "You know the secret language of druids." },
      {
        name: "Spellcasting",
        desc: "Prepare spells daily equal to WIS mod + Level.",
      },
    ],
  },
  {
    id: "fighter",
    name: "Fighter",
    hitDie: "d10",
    primaryStat: "str or dex",
    saves: ["Strength", "Constitution"],
    proficiencies: ["All Armor", "Shields", "Simple/Martial Weapons"],
    srdSubclass: "Champion",
    startingEquipment: [
      { name: "Chain Mail", type: "armor", ac: 16, qty: 1 },
      { name: "Longsword", type: "weapon", damage: "1d8", stat: "str", qty: 1 },
      { name: "Shield", type: "armor", ac: 2, qty: 1 },
      {
        name: "Light Crossbow",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Dungeoneer's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Fighting Style",
        desc: "Choose one: Archery (+2 hit), Defense (+1 AC), Dueling (+2 dmg), Great Weapon (Reroll 1-2).",
      },
      {
        name: "Second Wind",
        desc: "Bonus Action. Regain 1d10 + Level HP. Once per Short Rest.",
      },
    ],
  },
  {
    id: "monk",
    name: "Monk",
    hitDie: "d8",
    primaryStat: "dex & wis",
    saves: ["Strength", "Dexterity"],
    proficiencies: ["Simple Weapons", "Shortswords"],
    srdSubclass: "Way of the Open Hand",
    startingEquipment: [
      {
        name: "Shortsword",
        type: "weapon",
        damage: "1d6",
        stat: "dex",
        qty: 1,
      },
      { name: "Darts", type: "weapon", damage: "1d4", stat: "dex", qty: 10 },
      { name: "Explorer's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Unarmored Defense",
        desc: "AC = 10 + DEX mod + WIS mod (while not wearing armor).",
      },
      {
        name: "Martial Arts",
        desc: "Use DEX for unarmed/monk weapons. Unarmed strike d4. Bonus Action unarmed strike.",
      },
    ],
  },
  {
    id: "paladin",
    name: "Paladin",
    hitDie: "d10",
    primaryStat: "str & cha",
    saves: ["Wisdom", "Charisma"],
    proficiencies: ["All Armor", "Shields", "Simple/Martial Weapons"],
    srdSubclass: "Oath of Devotion",
    startingEquipment: [
      { name: "Longsword", type: "weapon", damage: "1d8", stat: "str", qty: 1 },
      { name: "Chain Mail", type: "armor", ac: 16, qty: 1 },
      { name: "Shield", type: "armor", ac: 2, qty: 1 },
      { name: "Javelin", type: "weapon", damage: "1d6", stat: "str", qty: 5 },
      { name: "Priest's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Divine Sense",
        desc: "Action. Detect celestial, fiend, undead within 60ft. Uses: 1 + CHA mod.",
      },
      {
        name: "Lay on Hands",
        desc: "Pool of HP = 5 x Level. Action to heal or cure disease (5 pts).",
      },
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    hitDie: "d10",
    primaryStat: "dex & wis",
    saves: ["Strength", "Dexterity"],
    proficiencies: ["Light/Medium Armor", "Shields", "Simple/Martial Weapons"],
    srdSubclass: "Hunter",
    startingEquipment: [
      { name: "Scale Mail", type: "armor", ac: 14, qty: 1 },
      {
        name: "Shortsword",
        type: "weapon",
        damage: "1d6",
        stat: "dex",
        qty: 2,
      },
      { name: "Longbow", type: "weapon", damage: "1d8", stat: "dex", qty: 1 },
      { name: "Arrows", type: "item", qty: 20 },
      { name: "Explorer's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Favored Enemy",
        desc: "Adv on Survival/INT checks related to enemy type. Learn language.",
      },
      {
        name: "Natural Explorer",
        desc: "Double prof on checks in favored terrain. Ignore difficult terrain.",
      },
    ],
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: "d8",
    primaryStat: "dex",
    saves: ["Dexterity", "Intelligence"],
    proficiencies: [
      "Light Armor",
      "Simple Weapons",
      "Hand Crossbows",
      "Longswords",
      "Rapiers",
      "Shortswords",
    ],
    srdSubclass: "Thief",
    startingEquipment: [
      { name: "Rapier", type: "weapon", damage: "1d8", stat: "dex", qty: 1 },
      { name: "Shortbow", type: "weapon", damage: "1d6", stat: "dex", qty: 1 },
      { name: "Arrows", type: "item", qty: 20 },
      { name: "Leather Armor", type: "armor", ac: 11, qty: 1 },
      { name: "Dagger", type: "weapon", damage: "1d4", stat: "dex", qty: 2 },
      { name: "Thieves' Tools", type: "item", qty: 1 },
      { name: "Burglar's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Sneak Attack",
        desc: "Deal extra 1d6 dmg if you have Adv or ally is 5ft from target. Finesse/Ranged only.",
      },
      {
        name: "Thieves' Cant",
        desc: "Secret mix of dialect, jargon, and code.",
      },
    ],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    hitDie: "d6",
    primaryStat: "cha",
    saves: ["Constitution", "Charisma"],
    proficiencies: [
      "Daggers",
      "Darts",
      "Slings",
      "Quarterstaffs",
      "Light Crossbows",
    ],
    srdSubclass: "Draconic Bloodline",
    spellcasting: { stat: "cha", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      {
        name: "Light Crossbow",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Bolts", type: "item", qty: 20 },
      { name: "Arcane Focus", type: "item", qty: 1 },
      { name: "Dagger", type: "weapon", damage: "1d4", stat: "dex", qty: 2 },
      { name: "Explorer's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Sorcerous Origin",
        desc: "Choose source of magic (e.g. Draconic Bloodline).",
      },
      { name: "Spellcasting", desc: "Cast known spells using Charisma." },
    ],
  },
  {
    id: "warlock",
    name: "Warlock",
    hitDie: "d8",
    primaryStat: "cha",
    saves: ["Wisdom", "Charisma"],
    proficiencies: ["Light Armor", "Simple Weapons"],
    srdSubclass: "The Fiend",
    spellcasting: { stat: "cha", slots: { 1: { total: 1, used: 0 } } }, // Warlock start with 1
    startingEquipment: [
      {
        name: "Light Crossbow",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Bolts", type: "item", qty: 20 },
      { name: "Arcane Focus", type: "item", qty: 1 },
      { name: "Leather Armor", type: "armor", ac: 11, qty: 1 },
      { name: "Dagger", type: "weapon", damage: "1d4", stat: "dex", qty: 2 },
      { name: "Scholar's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Otherworldly Patron",
        desc: "Pact with a powerful being (e.g. Fiend).",
      },
      {
        name: "Pact Magic",
        desc: "Slots restore on Short Rest. Always cast at highest slot level.",
      },
    ],
  },
  {
    id: "wizard",
    name: "Wizard",
    hitDie: "d6",
    primaryStat: "int",
    saves: ["Intelligence", "Wisdom"],
    proficiencies: [
      "Daggers",
      "Darts",
      "Slings",
      "Quarterstaffs",
      "Light Crossbows",
    ],
    srdSubclass: "School of Evocation",
    spellcasting: { stat: "int", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      {
        name: "Quarterstaff",
        type: "weapon",
        damage: "1d6",
        stat: "str",
        qty: 1,
      },
      { name: "Arcane Focus", type: "item", qty: 1 },
      { name: "Spellbook", type: "item", qty: 1 },
      { name: "Scholar's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Arcane Recovery",
        desc: "Once per day after Short Rest, recover spell slots (combined level <= half Wizard level).",
      },
      {
        name: "Spellcasting",
        desc: "Cast prepared spells using Intelligence.",
      },
    ],
  },
];

export const SKILLS = [
  { name: "Athletics", stat: "str" },
  { name: "Acrobatics", stat: "dex" },
  { name: "Sleight of Hand", stat: "dex" },
  { name: "Stealth", stat: "dex" },
  { name: "Arcana", stat: "int" },
  { name: "History", stat: "int" },
  { name: "Investigation", stat: "int" },
  { name: "Nature", stat: "int" },
  { name: "Religion", stat: "int" },
  { name: "Animal Handling", stat: "wis" },
  { name: "Insight", stat: "wis" },
  { name: "Medicine", stat: "wis" },
  { name: "Perception", stat: "wis" },
  { name: "Survival", stat: "wis" },
  { name: "Deception", stat: "cha" },
  { name: "Intimidation", stat: "cha" },
  { name: "Performance", stat: "cha" },
  { name: "Persuasion", stat: "cha" },
];

export const CONDITIONS = [
  {
    id: "blinded",
    name: "Blinded",
    desc: "Fail sight checks. Attacks vs you have Adv. Your attacks have Disadv.",
  },
  {
    id: "charmed",
    name: "Charmed",
    desc: "Cannot harm charmer. Charmer has Adv on social checks against you.",
  },
  { id: "deafened", name: "Deafened", desc: "Fail hearing checks." },
  {
    id: "frightened",
    name: "Frightened",
    desc: "Disadv on checks/attacks while source is visible. Cannot move closer.",
  },
  {
    id: "grappled",
    name: "Grappled",
    desc: "Speed 0. Ends if grappler incapacitated or moved away.",
  },
  {
    id: "incapacitated",
    name: "Incapacitated",
    desc: "No actions or reactions.",
  },
  {
    id: "invisible",
    name: "Invisible",
    desc: "You are unseen. Adv on your attacks. Attacks vs you have Disadv.",
  },
  {
    id: "paralyzed",
    name: "Paralyzed",
    desc: "Incapacitated. Auto-fail Str/Dex saves. Attacks vs you have Adv and are CRITS if within 5ft.",
  },
  {
    id: "petrified",
    name: "Petrified",
    desc: "Turned to stone. Incapacitated. Resistance to all dmg. Immune to poison/disease.",
  },
  {
    id: "poisoned",
    name: "Poisoned",
    desc: "Disadv on attacks and ability checks.",
  },
  {
    id: "prone",
    name: "Prone",
    desc: "Crawl only. Disadv on your attacks. Attacks vs you have Adv (melee) or Disadv (ranged).",
  },
  {
    id: "restrained",
    name: "Restrained",
    desc: "Speed 0. Disadv on your Dex saves/attacks. Attacks vs you have Adv.",
  },
  {
    id: "stunned",
    name: "Stunned",
    desc: "Incapacitated. Auto-fail Str/Dex saves. Attacks vs you have Adv.",
  },
  {
    id: "unconscious",
    name: "Unconscious",
    desc: "Incapacitated. Drop items. Prone. Auto-fail Str/Dex saves. Attacks vs you have Adv (Crit if 5ft).",
  },
  {
    id: "exhaustion",
    name: "Exhaustion",
    desc: "1: Disadv Checks. 2: Speed half. 3: Disadv Attacks/Saves. 4: HP Max half. 5: Speed 0. 6: Death.",
  },
];

export const COMBAT_ACTIONS = [
  {
    id: "attack",
    name: "Attack",
    desc: "Perform a melee or ranged attack with a weapon.",
  },
  {
    id: "cast",
    name: "Cast a Spell",
    desc: "Cast a spell with a casting time of 1 action.",
  },
  {
    id: "dash",
    name: "Dash",
    desc: "Gain extra movement equal to your speed for this turn.",
  },
  {
    id: "disengage",
    name: "Disengage",
    desc: "Your movement does not provoke opportunity attacks this turn.",
  },
  {
    id: "dodge",
    name: "Dodge",
    desc: "Attacks vs you have Disadvantage. You have Advantage on Dex saves.",
  },
  {
    id: "help",
    name: "Help",
    desc: "Give Advantage to an ally on their next check or attack roll.",
  },
  { id: "hide", name: "Hide", desc: "Make a Stealth check to become unseen." },
  {
    id: "ready",
    name: "Ready",
    desc: "Hold an action to use it later when a trigger occurs (uses Reaction).",
  },
  {
    id: "search",
    name: "Search",
    desc: "Devote your attention to finding something (Investigation/Perception).",
  },
  {
    id: "use",
    name: "Use an Object",
    desc: "Interact with an object that requires an action (e.g., drink potion).",
  },
];

// Placeholder for Spells (Empty, as we use API)
export const SPELLS = [];

// MINIMUM XP REQUIRED FOR EACH LEVEL
export const XP_TABLE = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};
