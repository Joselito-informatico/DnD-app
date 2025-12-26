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