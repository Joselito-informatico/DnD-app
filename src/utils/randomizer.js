import { RACES, CLASSES } from "../data/srd";

// Listas de sabor (Flavor Text) en Español
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
  "Acólito",
  "Criminal",
  "Héroe del Pueblo",
  "Sabio",
  "Soldado",
];
const ALIGNMENTS = [
  "Legal Bueno",
  "Neutral Bueno",
  "Caótico Bueno",
  "Legal Neutral",
  "Neutral Puro",
  "Caótico Neutral",
  "Legal Malvado",
  "Neutral Malvado",
  "Caótico Malvado",
];

const TRAITS = [
  "Siempre tengo un plan B.",
  "Exploto al menor insulto.",
  "Colecciono piedras raras.",
  "Soy increíblemente lento para confiar.",
  "Cito textos sagrados constantemente.",
];
const IDEALS = [
  "Libertad",
  "Respeto",
  "Codicia",
  "Poder",
  "Conocimiento",
  "Naturaleza",
  "Honor",
  "Equilibrio",
];
const BONDS = [
  "Mi espada pertenece a mi padre.",
  "Protegeré mi aldea a toda costa.",
  "Busco venganza por mi hermana.",
  "Tengo una deuda con un gremio.",
];
const FLAWS = [
  "No puedo resistirme al oro.",
  "Secretamente soy un cobarde.",
  "Hablo sin pensar.",
  "Guardo rencor para siempre.",
];

const APPEARANCE = {
  eyes: [
    "Azules",
    "Verdes",
    "Marrones",
    "Avellana",
    "Grises",
    "Violetas",
    "Rojos",
    "Ámbar",
  ],
  hair: [
    "Negro",
    "Castaño",
    "Rubio",
    "Pelirrojo",
    "Blanco",
    "Gris",
    "Calvo",
    "Teñido",
  ],
  skin: [
    "Pálida",
    "Clara",
    "Bronceada",
    "Oliva",
    "Marrón",
    "Oscura",
    "Verdosa",
    "Rojiza",
  ],
};

export const pick = (array) => array[Math.floor(Math.random() * array.length)];

const rollStat = () => Math.floor(Math.random() * 9) + 8; // Genera entre 8 y 16

// --- GENERADOR DE IDENTIDAD ---
export const getRandomDetails = () => ({
  name: pick(NAMES),
  alignment: pick(ALIGNMENTS),
  background: pick(BACKGROUNDS),
  age: (Math.floor(Math.random() * 80) + 18).toString(),
  height: `${Math.floor(Math.random() * 3) + 4}'${Math.floor(
    Math.random() * 11
  )}"`,
  weight: `${Math.floor(Math.random() * 150) + 50} kg`,
  eyes: pick(APPEARANCE.eyes),
  hair: pick(APPEARANCE.hair),
  skin: pick(APPEARANCE.skin),
  traits: pick(TRAITS),
  ideals: pick(IDEALS),
  bonds: pick(BONDS),
  flaws: pick(FLAWS),
  allies: "Ninguno por ahora.",
  treasure: "10po",
  backstory: "Un misterio para todos, incluyéndose a sí mismo.",
});

// --- GENERADOR DE HÉROE COMPLETO ---
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

  if (cls.id === "fighter") stats.str = 16;
  if (cls.id === "rogue") stats.dex = 16;
  if (cls.id === "wizard") stats.int = 16;

  const details = getRandomDetails();

  // Armas en Español para coincidir con reglas
  let weapons = [];
  if (cls.id === "fighter")
    weapons = [
      {
        id: Date.now(),
        name: "Espada larga",
        type: "melee",
        damage: "1d8",
        stat: "str",
      },
    ];
  else if (cls.id === "rogue")
    weapons = [
      {
        id: Date.now(),
        name: "Daga",
        type: "melee",
        damage: "1d4",
        stat: "dex",
      },
    ];
  else
    weapons = [
      {
        id: Date.now(),
        name: "Bastón",
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
    currentHP: null,
  };
};
