import { RACES, CLASSES } from "../data/srd";

// Listas de sabor (Flavor Text)
const NAMES = [
  "Valeros",
  "Ezren",
  "Kyra",
  "Merisiel",
  "Harsk",
  "Seoni",
  "Lem",
  "Amiri",
  "Sajan",
  "Lini",
  "Grom",
  "Thar",
  "Elara",
  "Vae",
  "Kael",
  "Sylas",
  "Lyra",
  "Dorn",
];
const BACKGROUNDS = [
  "Acolyte",
  "Criminal",
  "Folk Hero",
  "Noble",
  "Sage",
  "Soldier",
  "Urchin",
  "Hermit",
  "Outlander",
  "Entertainer",
];
const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const TRAITS = [
  "I always have a plan.",
  "I blow up at the slightest insult.",
  "I collect strange rocks.",
  "I am incredibly slow to trust.",
  "I quote sacred texts constantly.",
];
const IDEALS = [
  "Freedom",
  "Respect",
  "Greed",
  "Power",
  "Knowledge",
  "Nature",
  "Honor",
  "Balance",
];
const BONDS = [
  "My sword belongs to my father.",
  "I will protect my village.",
  "I seek revenge for my sister.",
  "I owe a debt to a guild.",
];
const FLAWS = [
  "I can't resist gold.",
  "I am secretly a coward.",
  "I speak without thinking.",
  "I hold grudges forever.",
];

const APPEARANCE = {
  eyes: ["Blue", "Green", "Brown", "Hazel", "Grey", "Violet", "Red", "Amber"],
  hair: ["Black", "Brown", "Blond", "Red", "White", "Grey", "Bald", "Dyed"],
  skin: [
    "Pale",
    "Fair",
    "Tan",
    "Olive",
    "Brown",
    "Dark",
    "Greenish",
    "Reddish",
  ],
};

// Función auxiliar para elegir uno al azar
export const pick = (array) => array[Math.floor(Math.random() * array.length)];

// Generador de Stats (Método: 4d6 drop lowest, simplificado a rango 8-16 para MVP)
const rollStat = () => Math.floor(Math.random() * 9) + 8; // Genera entre 8 y 16

// --- GENERADOR DE IDENTIDAD (Para el Creador) ---
export const getRandomDetails = () => ({
  name: pick(NAMES),
  alignment: pick(ALIGNMENTS),
  background: pick(BACKGROUNDS),
  age: (Math.floor(Math.random() * 80) + 18).toString(),
  height: `${Math.floor(Math.random() * 3) + 4}'${Math.floor(
    Math.random() * 11
  )}"`,
  weight: `${Math.floor(Math.random() * 150) + 100} lbs`,
  eyes: pick(APPEARANCE.eyes),
  hair: pick(APPEARANCE.hair),
  skin: pick(APPEARANCE.skin),
  traits: pick(TRAITS),
  ideals: pick(IDEALS),
  bonds: pick(BONDS),
  flaws: pick(FLAWS),
  allies: "None yet.",
  treasure: "10gp",
  backstory: "A mystery to everyone, including themselves.",
});

// --- GENERADOR DE HÉROE COMPLETO (Para el Dashboard) ---
export const generateRandomHero = () => {
  const race = pick(RACES);
  const cls = pick(CLASSES);

  const stats = {
    str: rollStat(),
    dex: rollStat(),
    con: rollStat(),
    int: rollStat(),
    wis: rollStat(),
    cha: rollStat(),
  };

  // Aseguramos que el stat principal sea bueno (mínimo 16)
  if (cls.id === "fighter") stats.str = 16;
  if (cls.id === "rogue") stats.dex = 16;
  if (cls.id === "wizard") stats.int = 16;

  const details = getRandomDetails();

  // Armas básicas según clase
  let weapons = [];
  if (cls.id === "fighter")
    weapons = [
      {
        id: Date.now(),
        name: "Longsword",
        type: "melee",
        damage: "1d8",
        stat: "str",
      },
    ];
  else if (cls.id === "rogue")
    weapons = [
      {
        id: Date.now(),
        name: "Dagger",
        type: "melee",
        damage: "1d4",
        stat: "dex",
      },
    ];
  else
    weapons = [
      {
        id: Date.now(),
        name: "Quarterstaff",
        type: "melee",
        damage: "1d6",
        stat: "str",
      },
    ];

  return {
    id: Date.now(),
    name: details.name,
    race: race.name,
    class: cls.name,
    level: 1,
    xp: 0,
    stats,
    weapons,
    features: cls.features || [],
    details,
    currentHP: null, // Se calculará al abrir
  };
};
