export const RACES = [
  {
    id: "human",
    name: "Humano",
    speed: 30, // 30 pies
    description: "Versátiles y ambiciosos.",
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    traits: ["Idioma Extra"],
  },
  {
    id: "elf",
    name: "Elfo",
    speed: 30, // 30 pies
    description: "Ágiles, longevos y mágicos.",
    bonuses: { dex: 2 },
    traits: ["Visión en la Oscuridad", "Sentidos Agudos", "Trance"],
  },
  {
    id: "dwarf",
    name: "Enano",
    speed: 25, // 25 pies (No reducido por armadura pesada)
    description: "Resistentes, viven en montañas.",
    bonuses: { con: 2 },
    traits: ["Visión en la Oscuridad", "Resistencia Enana", "Combate Enano"],
  },
  {
    id: "halfling",
    name: "Mediano",
    speed: 25, // 25 pies
    description: "Pequeños, suertudos y valientes.",
    bonuses: { dex: 2 },
    traits: ["Afortunado", "Valiente", "Agilidad Mediana"],
  },
  {
    id: "dragonborn",
    name: "Dracónido",
    speed: 30,
    description: "Orgullosos parientes de dragones.",
    bonuses: { str: 2, cha: 1 },
    traits: ["Arma de Aliento", "Resistencia al Daño"],
  },
  {
    id: "gnome",
    name: "Gnomo",
    speed: 25,
    description: "Inventores curiosos y vivaces.",
    bonuses: { int: 2 },
    traits: ["Visión en la Oscuridad", "Astucia Gnomica"],
  },
  {
    id: "half-elf",
    name: "Semielfo",
    speed: 30,
    description: "Carismáticos, unen dos mundos.",
    bonuses: { cha: 2, dex: 1, con: 1 },
    traits: ["Visión en la Oscuridad", "Ancestros Feéricos", "Versatilidad"],
  },
  {
    id: "half-orc",
    name: "Semiorco",
    speed: 30,
    description: "Feroces guerreros tribales.",
    bonuses: { str: 2, con: 1 },
    traits: ["Visión en la Oscuridad", "Amenazante", "Resistencia Implacable"],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    speed: 30,
    description: "Herederos de un linaje infernal.",
    bonuses: { cha: 2, int: 1 },
    traits: [
      "Visión en la Oscuridad",
      "Resistencia Infernal",
      "Legado Infernal",
    ],
  },
];

export const CLASSES = [
  {
    id: "fighter",
    name: "Guerrero",
    hitDie: "d10",
    primaryStat: "str",
    saves: ["Fuerza", "Constitución"],
    skillInfo: {
      count: 2,
      list: [
        "Acrobacias",
        "Trato con Animales",
        "Atletismo",
        "Historia",
        "Perspicacia",
        "Intimidación",
        "Percepción",
        "Supervivencia",
      ],
    },
    features: [
      {
        name: "Estilo de Combate",
        desc: "Elige una especialidad (Defensa, Duelo, etc).",
      },
      {
        name: "Segunda Aliento",
        desc: "Bonus action: Recupera 1d10 + Nivel PG.",
      },
    ],
    startingEquipment: [
      { name: "Cota de Malla", type: "armor", qty: 1 },
      { name: "Espada larga", type: "weapon", qty: 1 },
      { name: "Escudo", type: "shield", qty: 1 },
    ],
  },
  {
    id: "wizard",
    name: "Mago",
    hitDie: "d6",
    primaryStat: "int",
    saves: ["Inteligencia", "Sabiduría"],
    spellcasting: { stat: "int", slots: { 1: { total: 2, used: 0 } } },
    skillInfo: {
      count: 2,
      list: [
        "Arcanos",
        "Historia",
        "Perspicacia",
        "Investigación",
        "Medicina",
        "Religión",
      ],
    },
    features: [
      {
        name: "Recuperación Arcana",
        desc: "Recupera espacios de conjuro en descanso corto.",
      },
    ],
    startingEquipment: [
      { name: "Daga", type: "weapon", qty: 1 },
      { name: "Libro de conjuros", type: "gear", qty: 1 },
    ],
  },
  {
    id: "rogue",
    name: "Pícaro",
    hitDie: "d8",
    primaryStat: "dex",
    saves: ["Destreza", "Inteligencia"],
    skillInfo: {
      count: 4,
      list: [
        "Acrobacias",
        "Atletismo",
        "Engaño",
        "Perspicacia",
        "Intimidación",
        "Investigación",
        "Percepción",
        "Interpretación",
        "Persuasión",
        "Juego de Manos",
        "Sigilo",
      ],
    },
    features: [
      {
        name: "Ataque Furtivo",
        desc: "1d6 extra si tienes ventaja o aliado cerca.",
      },
      {
        name: "Acción Astuta",
        desc: "Nivel 2: Esconderse, Destrabarse o Correr como Bonus Action.",
      },
    ],
    startingEquipment: [
      { name: "Cuero", type: "armor", qty: 1 },
      { name: "Daga", type: "weapon", qty: 2 },
      { name: "Arco corto", type: "weapon", qty: 1 },
    ],
  },
  {
    id: "cleric",
    name: "Clérigo",
    hitDie: "d8",
    primaryStat: "wis",
    saves: ["Sabiduría", "Carisma"],
    spellcasting: { stat: "wis", slots: { 1: { total: 2, used: 0 } } },
    skillInfo: {
      count: 2,
      list: ["Historia", "Perspicacia", "Medicina", "Persuasión", "Religión"],
    },
    features: [
      { name: "Dominio Divino", desc: "Elige Vida, Guerra, Luz, etc." },
    ],
    startingEquipment: [
      { name: "Maza", type: "weapon", qty: 1 },
      { name: "Cota de escamas", type: "armor", qty: 1 },
      { name: "Escudo", type: "shield", qty: 1 },
    ],
  },
  {
    id: "barbarian",
    name: "Bárbaro",
    hitDie: "d12",
    primaryStat: "str",
    saves: ["Fuerza", "Constitución"],
    skillInfo: {
      count: 2,
      list: [
        "Atletismo",
        "Intimidación",
        "Naturaleza",
        "Percepción",
        "Supervivencia",
      ],
    },
    features: [
      { name: "Furia", desc: "Ventaja en FUE, Resist daño físico, +Daño." },
      {
        name: "Defensa sin Armadura",
        desc: "CA = 10 + DES + CON (Sin armadura).",
      },
    ],
    startingEquipment: [
      { name: "Gran hacha", type: "weapon", qty: 1 },
      { name: "Hacha de mano", type: "weapon", qty: 2 },
    ],
  },
  {
    id: "monk",
    name: "Monje",
    hitDie: "d8",
    primaryStat: "dex",
    saves: ["Fuerza", "Destreza"],
    skillInfo: {
      count: 2,
      list: [
        "Acrobacias",
        "Atletismo",
        "Historia",
        "Perspicacia",
        "Religión",
        "Sigilo",
      ],
    },
    features: [
      {
        name: "Artes Marciales",
        desc: "Usa DES para ataque/daño desarmado. Bonus attack desarmado.",
      },
      {
        name: "Defensa sin Armadura",
        desc: "CA = 10 + DES + SAB (Sin armadura/escudo).",
      },
    ],
    startingEquipment: [{ name: "Daga", type: "weapon", qty: 1 }],
  },
];

export const BACKGROUNDS = [
  {
    name: "Acólito",
    skills: ["Perspicacia", "Religión"],
    traits: ["Servicio religioso", "Cobijo de los fieles"],
    desc: "Has pasado tu vida sirviendo en un templo.",
  },
  {
    name: "Criminal",
    skills: ["Engaño", "Sigilo"],
    traits: ["Contacto criminal", "Honor entre ladrones"],
    desc: "Tienes un historial de romper la ley.",
  },
  {
    name: "Soldado",
    skills: ["Atletismo", "Intimidación"],
    traits: ["Rango militar", "Disciplina"],
    desc: "La guerra ha sido tu vida durante años.",
  },
  {
    name: "Erudito",
    skills: ["Arcanos", "Historia"],
    traits: ["Investigador", "Acceso a bibliotecas"],
    desc: "Estudiaste el multiverso y sus secretos.",
  },
];
