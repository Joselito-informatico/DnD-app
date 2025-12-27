export const RACES = [
  {
    id: "human",
    name: "Human",
    description: "Versatile and ambitious. +1 to all Ability Scores.",
    traits: ["+1 All Stats", "Extra Language"],
    speed: 30,
  },
  {
    id: "elf",
    name: "Elf",
    description: "Magical people of otherworldly grace. +2 Dexterity.",
    traits: ["Darkvision", "Keen Senses", "Fey Ancestry"],
    speed: 30,
  },
  {
    id: "dwarf",
    name: "Dwarf",
    description: "Bold and hardy. +2 Constitution.",
    traits: ["Darkvision", "Dwarven Resilience", "Combat Training"],
    speed: 25,
  },
  {
    id: "tiefling",
    name: "Tiefling",
    description: "To be greeted with stares and whispers. +2 Charisma.",
    traits: ["Darkvision", "Hellish Resistance", "Thaumaturgy"],
    speed: 30,
  }
];

export const CLASSES = [
  {
    id: "fighter",
    name: "Fighter",
    hitDie: "d10",
    primaryStat: "Strength or Dexterity",
    saves: ["Strength", "Constitution"],
    proficiencies: ["All armor", "Shields", "Simple weapons", "Martial weapons"]
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: "d8",
    primaryStat: "Dexterity",
    saves: ["Dexterity", "Intelligence"],
    proficiencies: ["Light armor", "Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"]
  },
  {
    id: "wizard",
    name: "Wizard",
    hitDie: "d6",
    primaryStat: "Intelligence",
    saves: ["Intelligence", "Wisdom"],
    proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"]
  }
];

export const SKILLS = [
  { name: "Acrobatics", stat: "dex" },
  { name: "Animal Handling", stat: "wis" },
  { name: "Arcana", stat: "int" },
  { name: "Athletics", stat: "str" },
  { name: "Deception", stat: "cha" },
  { name: "History", stat: "int" },
  { name: "Insight", stat: "wis" },
  { name: "Intimidation", stat: "cha" },
  { name: "Investigation", stat: "int" },
  { name: "Medicine", stat: "wis" },
  { name: "Nature", stat: "int" },
  { name: "Perception", stat: "wis" },
  { name: "Performance", stat: "cha" },
  { name: "Persuasion", stat: "cha" },
  { name: "Religion", stat: "int" },
  { name: "Sleight of Hand", stat: "dex" },
  { name: "Stealth", stat: "dex" },
  { name: "Survival", stat: "wis" },
];

export const SPELLS = [
  // Trucos (Nivel 0)
  { id: 'firebolt', name: 'Fire Bolt', level: 0, school: 'Evocation', time: '1 Action', range: '120ft', desc: '1d10 Fire damage.' },
  { id: 'magehand', name: 'Mage Hand', level: 0, school: 'Conjuration', time: '1 Action', range: '30ft', desc: 'Move object up to 10 lbs.' },
  { id: 'light', name: 'Light', level: 0, school: 'Evocation', time: '1 Action', range: 'Touch', desc: 'Object shines like a torch.' },
  
  // Nivel 1
  { id: 'magicmissile', name: 'Magic Missile', level: 1, school: 'Evocation', time: '1 Action', range: '120ft', desc: '3 darts, 1d4+1 force each. Auto-hit.' },
  { id: 'shield', name: 'Shield', level: 1, school: 'Abjuration', time: '1 Reaction', range: 'Self', desc: '+5 AC until start of next turn.' },
  { id: 'curewounds', name: 'Cure Wounds', level: 1, school: 'Evocation', time: '1 Action', range: 'Touch', desc: 'Heal 1d8 + Mod.' },
];