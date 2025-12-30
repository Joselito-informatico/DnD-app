// ==========================================
// SRD 5.2.1 ESPAÑOL - CC-BY 4.0 COMPLIANT
// ==========================================

export const SKILLS = [
  { name: "Acrobacias", stat: "dex" },
  { name: "Trato con Animales", stat: "wis" },
  { name: "Arcana", stat: "int" },
  { name: "Atletismo", stat: "str" },
  { name: "Engaño", stat: "cha" },
  { name: "Historia", stat: "int" },
  { name: "Perspicacia", stat: "wis" },
  { name: "Intimidación", stat: "cha" },
  { name: "Investigación", stat: "int" },
  { name: "Medicina", stat: "wis" },
  { name: "Naturaleza", stat: "int" },
  { name: "Percepción", stat: "wis" },
  { name: "Interpretación", stat: "cha" },
  { name: "Persuasión", stat: "cha" },
  { name: "Religión", stat: "int" },
  { name: "Juego de Manos", stat: "dex" },
  { name: "Sigilo", stat: "dex" },
  { name: "Supervivencia", stat: "wis" },
];

export const CONDITIONS = [
  {
    id: "blinded",
    name: "Cegado",
    desc: "Fallo auto en chequeos de vista. Ataques contra ti tienen Ventaja. Tus ataques tienen Desventaja.",
  },
  {
    id: "charmed",
    name: "Hechizado",
    desc: "No puedes atacar al hechizador. El hechizador tiene Ventaja en chequeos sociales.",
  },
  {
    id: "deafened",
    name: "Sordo",
    desc: "Fallo automático en chequeos de oído.",
  },
  {
    id: "frightened",
    name: "Asustado",
    desc: "Desventaja en chequeos/ataques si ves la fuente. No puedes acercarte.",
  },
  { id: "grappled", name: "Agarrado", desc: "Velocidad 0." },
  {
    id: "incapacitated",
    name: "Incapacitado",
    desc: "Sin acciones ni reacciones.",
  },
  {
    id: "invisible",
    name: "Invisible",
    desc: "No puedes ser visto. Ataques contra ti tienen Desv. Tus ataques tienen Ventaja.",
  },
  {
    id: "paralyzed",
    name: "Paralizado",
    desc: "Incapacitado. Fallo auto en salvaciones FUE/DES. Ataques contra ti: Ventaja y Crítico si están cerca.",
  },
  {
    id: "petrified",
    name: "Petrificado",
    desc: "Incapacitado. Resistencia a todo daño. Inmune a veneno/enfermedad.",
  },
  {
    id: "poisoned",
    name: "Envenenado",
    desc: "Desventaja en ataques y chequeos.",
  },
  {
    id: "prone",
    name: "Derribado",
    desc: "Solo gatear. Desv en tus ataques. Ataques cuerpo a cuerpo contra ti tienen Ventaja, a distancia Desv.",
  },
  {
    id: "restrained",
    name: "Apresado",
    desc: "Velocidad 0. Ataques contra ti: Ventaja. Tus ataques: Desv. Desv en salvaciones DES.",
  },
  {
    id: "stunned",
    name: "Aturdido",
    desc: "Incapacitado. Fallo auto salvaciones FUE/DES. Ataques contra ti tienen Ventaja.",
  },
  {
    id: "unconscious",
    name: "Inconsciente",
    desc: "Incapacitado. Sueltas objetos. Derribado. Fallo auto FUE/DES. Ataques contra ti: Ventaja y Crítico.",
  },
  {
    id: "exhaustion",
    name: "Agotamiento",
    desc: "Nivel 1-6. Los efectos se acumulan.",
  },
];

export const RACES = [
  {
    id: "dragonborn",
    name: "Dracónido",
    speed: 30,
    size: "Mediano",
    description: "Ancestros dragones con arma de aliento.",
    traits: ["Arma de Aliento", "Resistencia al Daño"],
    bonuses: { str: 2, cha: 1 },
  },
  {
    id: "dwarf",
    name: "Enano",
    speed: 25,
    size: "Mediano",
    description:
      "Audaces y resistentes, conocidos por su habilidad en combate.",
    traits: ["Visión en la Oscuridad", "Resistencia Enana"],
    bonuses: { con: 2 },
  },
  {
    id: "elf",
    name: "Elfo",
    speed: 30,
    size: "Mediano",
    description: "Gente mágica de gracia sobrenatural.",
    traits: ["Visión en la Oscuridad", "Sentidos Agudos", "Trance"],
    bonuses: { dex: 2 },
  },
  {
    id: "gnome",
    name: "Gnomo",
    speed: 25,
    size: "Pequeño",
    description: "Un zumbido de invención e ilusión.",
    traits: ["Visión en la Oscuridad", "Astucia Gnomica"],
    bonuses: { int: 2 },
  },
  {
    id: "half-elf",
    name: "Semielfo",
    speed: 30,
    size: "Mediano",
    description: "Combinan lo mejor de elfos y humanos.",
    traits: ["Visión en la Oscuridad", "Ancestros Feéricos", "Versatilidad"],
    bonuses: { cha: 2, dex: 1, con: 1 },
  },
  {
    id: "halfling",
    name: "Mediano",
    speed: 25,
    size: "Pequeño",
    description: "El confort del hogar es su meta.",
    traits: ["Afortunado", "Valiente", "Agilidad de Mediano"],
    bonuses: { dex: 2 },
  },
  {
    id: "half-orc",
    name: "Semiorco",
    speed: 30,
    size: "Mediano",
    description: "Jefes y guerreros orgullosos.",
    traits: [
      "Visión en la Oscuridad",
      "Resistencia Implacable",
      "Ataques Salvajes",
    ],
    bonuses: { str: 2, con: 1 },
  },
  {
    id: "human",
    name: "Humano",
    speed: 30,
    size: "Mediano",
    description: "Adaptables y ambiciosos.",
    traits: ["Idioma Extra", "+1 a Todo"],
    bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
  },
  {
    id: "tiefling",
    name: "Tiefling",
    speed: 30,
    size: "Mediano",
    description: "Recibidos con miradas y susurros.",
    traits: ["Visión en la Oscuridad", "Resistencia Infernal"],
    bonuses: { cha: 2, int: 1 },
  },
];

export const CLASSES = [
  {
    id: "barbarian",
    name: "Bárbaro",
    hitDie: "d12",
    primaryStat: "str",
    saves: ["Fuerza", "Constitución"],
    proficiencies: [
      "Armaduras ligeras/medias",
      "Escudos",
      "Armas simples/marciales",
    ],
    skillInfo: {
      count: 2,
      list: [
        "Trato con Animales",
        "Atletismo",
        "Intimidación",
        "Naturaleza",
        "Percepción",
        "Supervivencia",
      ],
    },
    startingEquipment: [
      {
        name: "Gran hacha",
        type: "weapon",
        damage: "1d12",
        stat: "str",
        qty: 1,
      },
      {
        name: "Hacha de mano",
        type: "weapon",
        damage: "1d6",
        stat: "str",
        qty: 2,
      },
      { name: "Jabalina", type: "weapon", damage: "1d6", stat: "str", qty: 4 },
      { name: "Pack de Explorador", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Furia",
        desc: "Acción Bonificación. Ventaja chequeos/salvación FUE. Bono daño melee. Resistencia daño C/P/K.",
      },
      {
        name: "Defensa sin Armadura",
        desc: "CA = 10 + Mod DES + Mod CON (sin armadura).",
      },
    ],
  },
  {
    id: "bard",
    name: "Bardo",
    hitDie: "d8",
    primaryStat: "cha",
    saves: ["Destreza", "Carisma"],
    proficiencies: [
      "Armadura ligera",
      "Armas simples",
      "Espada larga",
      "Estoque",
      "Espada corta",
    ],
    skillInfo: { count: 3, list: SKILLS.map((s) => s.name) },
    spellcasting: { stat: "cha", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Estoque", type: "weapon", damage: "1d8", stat: "dex", qty: 1 },
      { name: "Armadura de cuero", type: "armor", ac: 11, qty: 1 },
      { name: "Pack de Artista", type: "item", qty: 1 },
      { name: "Daga", type: "weapon", damage: "1d4", stat: "dex", qty: 1 },
    ],
    features: [
      {
        name: "Inspiración de Bardo",
        desc: "Acción Bonificación. Dar d6 a criatura. Sumar a chequeo/ataque/salvación.",
      },
    ],
  },
  {
    id: "cleric",
    name: "Clérigo",
    hitDie: "d8",
    primaryStat: "wis",
    saves: ["Sabiduría", "Carisma"],
    proficiencies: ["Armaduras ligeras/medias", "Escudos", "Armas simples"],
    skillInfo: {
      count: 2,
      list: ["Historia", "Perspicacia", "Medicina", "Persuasión", "Religión"],
    },
    spellcasting: { stat: "wis", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Maza", type: "weapon", damage: "1d6", stat: "str", qty: 1 },
      { name: "Cota de escamas", type: "armor", ac: 14, qty: 1 },
      { name: "Escudo", type: "armor", ac: 2, qty: 1 },
      { name: "Pack de Sacerdote", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Dominio Divino",
        desc: "Elige un dominio relacionado con tu deidad.",
      },
    ],
  },
  {
    id: "druid",
    name: "Druida",
    hitDie: "d8",
    primaryStat: "wis",
    saves: ["Inteligencia", "Sabiduría"],
    proficiencies: [
      "Armaduras ligeras/medias (no metal)",
      "Escudos",
      "Armas simples",
    ],
    skillInfo: {
      count: 2,
      list: [
        "Arcana",
        "Trato con Animales",
        "Perspicacia",
        "Medicina",
        "Naturaleza",
        "Percepción",
        "Religión",
        "Supervivencia",
      ],
    },
    spellcasting: { stat: "wis", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Cimitarra", type: "weapon", damage: "1d6", stat: "dex", qty: 1 },
      { name: "Armadura de cuero", type: "armor", ac: 11, qty: 1 },
      { name: "Escudo de madera", type: "armor", ac: 2, qty: 1 },
      { name: "Pack de Explorador", type: "item", qty: 1 },
    ],
    features: [
      { name: "Druídico", desc: "Conoces el idioma secreto de los druidas." },
    ],
  },
  {
    id: "fighter",
    name: "Guerrero",
    hitDie: "d10",
    primaryStat: "str or dex",
    saves: ["Fuerza", "Constitución"],
    proficiencies: [
      "Todas las armaduras",
      "Escudos",
      "Armas simples/marciales",
    ],
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
    startingEquipment: [
      { name: "Cota de malla", type: "armor", ac: 16, qty: 1 },
      {
        name: "Espada larga",
        type: "weapon",
        damage: "1d8",
        stat: "str",
        qty: 1,
      },
      { name: "Escudo", type: "armor", ac: 2, qty: 1 },
      { name: "Pack de saqueador", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Segunda Oportunidad",
        desc: "Acción Bonificación. Recuperar 1d10 + Nivel PG. Descanso Corto.",
      },
      {
        name: "Estilo de Combate",
        desc: "Elige una especialidad (Defensa, Duelo, etc).",
      },
    ],
  },
  {
    id: "monk",
    name: "Monje",
    hitDie: "d8",
    primaryStat: "dex & wis",
    saves: ["Fuerza", "Destreza"],
    proficiencies: ["Armas simples", "Espadas cortas"],
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
    startingEquipment: [
      {
        name: "Espada corta",
        type: "weapon",
        damage: "1d6",
        stat: "dex",
        qty: 1,
      },
      { name: "Pack de Explorador", type: "item", qty: 1 },
      { name: "Dardos", type: "weapon", damage: "1d4", stat: "dex", qty: 10 },
    ],
    features: [
      {
        name: "Defensa sin Armadura",
        desc: "CA = 10 + DES + SAB (sin armadura).",
      },
      {
        name: "Artes Marciales",
        desc: "DES para desarmado. 1d4 daño. Golpe desarmado como bonus.",
      },
    ],
  },
  {
    id: "paladin",
    name: "Paladín",
    hitDie: "d10",
    primaryStat: "str & cha",
    saves: ["Sabiduría", "Carisma"],
    proficiencies: [
      "Todas las armaduras",
      "Escudos",
      "Armas simples/marciales",
    ],
    skillInfo: {
      count: 2,
      list: [
        "Atletismo",
        "Perspicacia",
        "Intimidación",
        "Medicina",
        "Persuasión",
        "Religión",
      ],
    },
    startingEquipment: [
      {
        name: "Espada larga",
        type: "weapon",
        damage: "1d8",
        stat: "str",
        qty: 1,
      },
      { name: "Cota de malla", type: "armor", ac: 16, qty: 1 },
      { name: "Escudo", type: "armor", ac: 2, qty: 1 },
      { name: "Pack de Sacerdote", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Sentido Divino",
        desc: "Acción. Detectar celestial, infernal, no-muerto.",
      },
      { name: "Imponer las Manos", desc: "Reserva de curación (5 x Nivel)." },
    ],
  },
  {
    id: "ranger",
    name: "Explorador",
    hitDie: "d10",
    primaryStat: "dex & wis",
    saves: ["Fuerza", "Destreza"],
    proficiencies: [
      "Armaduras ligeras/medias",
      "Escudos",
      "Armas simples/marciales",
    ],
    skillInfo: {
      count: 3,
      list: [
        "Trato con Animales",
        "Atletismo",
        "Perspicacia",
        "Investigación",
        "Naturaleza",
        "Percepción",
        "Sigilo",
        "Supervivencia",
      ],
    },
    startingEquipment: [
      { name: "Cota de escamas", type: "armor", ac: 14, qty: 1 },
      {
        name: "Espada corta",
        type: "weapon",
        damage: "1d6",
        stat: "dex",
        qty: 2,
      },
      {
        name: "Arco largo",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Pack de Explorador", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Enemigo Predilecto",
        desc: "Ventaja rastreando un tipo de enemigo.",
      },
      { name: "Explorador Natural", desc: "Beneficios en terreno predilecto." },
    ],
  },
  {
    id: "rogue",
    name: "Pícaro",
    hitDie: "d8",
    primaryStat: "dex",
    saves: ["Destreza", "Inteligencia"],
    proficiencies: [
      "Armadura ligera",
      "Armas simples",
      "Ballesta de mano",
      "Espada larga",
      "Estoque",
      "Espada corta",
    ],
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
    startingEquipment: [
      { name: "Estoque", type: "weapon", damage: "1d8", stat: "dex", qty: 1 },
      {
        name: "Arco corto",
        type: "weapon",
        damage: "1d6",
        stat: "dex",
        qty: 1,
      },
      { name: "Armadura de cuero", type: "armor", ac: 11, qty: 1 },
      { name: "Herramientas de ladrón", type: "item", qty: 1 },
      { name: "Burglar's Pack", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Ataque Furtivo",
        desc: "Extra 1d6 daño con Ventaja o aliado adyacente.",
      },
      { name: "Jerga de Ladrones", desc: "Lenguaje secreto." },
    ],
  },
  {
    id: "sorcerer",
    name: "Hechicero",
    hitDie: "d6",
    primaryStat: "cha",
    saves: ["Constitución", "Carisma"],
    proficiencies: [
      "Dagas",
      "Dardos",
      "Hondas",
      "Bastones",
      "Ballestas ligeras",
    ],
    skillInfo: {
      count: 2,
      list: [
        "Arcana",
        "Engaño",
        "Perspicacia",
        "Intimidación",
        "Persuasión",
        "Religión",
      ],
    },
    spellcasting: { stat: "cha", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      {
        name: "Ballesta ligera",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Foco Arcano", type: "item", qty: 1 },
      { name: "Daga", type: "weapon", damage: "1d4", stat: "dex", qty: 2 },
      { name: "Pack de Explorador", type: "item", qty: 1 },
    ],
    features: [{ name: "Origen Hechicero", desc: "Fuente de tu magia." }],
  },
  {
    id: "warlock",
    name: "Brujo",
    hitDie: "d8",
    primaryStat: "cha",
    saves: ["Sabiduría", "Carisma"],
    proficiencies: ["Armadura ligera", "Armas simples"],
    skillInfo: {
      count: 2,
      list: [
        "Arcana",
        "Engaño",
        "Historia",
        "Intimidación",
        "Investigación",
        "Naturaleza",
        "Religión",
      ],
    },
    spellcasting: { stat: "cha", slots: { 1: { total: 1, used: 0 } } },
    startingEquipment: [
      {
        name: "Ballesta ligera",
        type: "weapon",
        damage: "1d8",
        stat: "dex",
        qty: 1,
      },
      { name: "Foco Arcano", type: "item", qty: 1 },
      { name: "Armadura de cuero", type: "armor", ac: 11, qty: 1 },
      { name: "Pack de Erudito", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Magia de Pacto",
        desc: "Espacios se recargan en Descanso Corto.",
      },
      { name: "Patrón de Otro Mundo", desc: "Tu entidad del pacto." },
    ],
  },
  {
    id: "wizard",
    name: "Mago",
    hitDie: "d6",
    primaryStat: "int",
    saves: ["Inteligencia", "Sabiduría"],
    proficiencies: [
      "Dagas",
      "Dardos",
      "Hondas",
      "Bastones",
      "Ballestas ligeras",
    ],
    skillInfo: {
      count: 2,
      list: [
        "Arcana",
        "Historia",
        "Perspicacia",
        "Investigación",
        "Medicina",
        "Religión",
      ],
    },
    spellcasting: { stat: "int", slots: { 1: { total: 2, used: 0 } } },
    startingEquipment: [
      { name: "Bastón", type: "weapon", damage: "1d6", stat: "str", qty: 1 },
      { name: "Foco Arcano", type: "item", qty: 1 },
      { name: "Libro de Conjuros", type: "item", qty: 1 },
      { name: "Pack de Erudito", type: "item", qty: 1 },
    ],
    features: [
      {
        name: "Recuperación Arcana",
        desc: "Recuperar algunos espacios en Descanso Corto (1/día).",
      },
    ],
  },
];

export const BACKGROUNDS = [
  {
    name: "Acólito",
    skills: ["Perspicacia", "Religión"],
    desc: "Has pasado tu vida al servicio de un templo.",
    traits: [
      "Idolatro a un héroe de mi fe.",
      "Veo presagios en cada evento.",
      "Soy tolerante con otras fes.",
    ],
    ideals: ["Tradición", "Caridad", "Cambio", "Fe", "Aspiración"],
    bonds: [
      "Moriría por recuperar una reliquia antigua.",
      "Algún día me vengaré de la jerarquía corrupta.",
    ],
    flaws: [
      "Juzgo a otros duramente.",
      "Confío demasiado en quienes tienen poder.",
    ],
  },
  {
    name: "Criminal",
    skills: ["Engaño", "Sigilo"],
    desc: "Tienes un historial de infringir la ley.",
    traits: [
      "Siempre tengo un plan B.",
      "Soy increíblemente lento para confiar.",
    ],
    ideals: ["Honor", "Libertad", "Codicia", "Gente", "Redención"],
    bonds: [
      "Intento pagar una vieja deuda.",
      "Mis ganancias van a mi familia.",
    ],
    flaws: [
      "Cuando veo algo valioso, solo pienso en robarlo.",
      "Huyo cuando las cosas se ponen feas.",
    ],
  },
  {
    name: "Soldado",
    skills: ["Atletismo", "Intimidación"],
    desc: "La guerra ha sido tu vida.",
    traits: [
      "Siempre soy educado y respetuoso.",
      "Me persiguen los recuerdos de la guerra.",
    ],
    ideals: [
      "Bien Mayor",
      "Responsabilidad",
      "Independencia",
      "Poder",
      "Nación",
    ],
    bonds: [
      "Daría mi vida por la gente con la que serví.",
      "Mi honor es mi vida.",
    ],
    flaws: [
      "El enemigo monstruoso aún me da miedo.",
      "Obedezco la ley aunque cause miseria.",
    ],
  },
  {
    name: "Sabio",
    skills: ["Arcana", "Historia"],
    desc: "Pasaste años aprendiendo el saber del multiverso.",
    traits: [
      "Uso palabras polisílabas.",
      "He leído todos los libros de las grandes bibliotecas.",
    ],
    ideals: ["Conocimiento", "Belleza", "Lógica", "Sin Límites", "Automejora"],
    bonds: [
      "Es mi deber proteger a mis estudiantes.",
      "Tengo un texto antiguo con terribles secretos.",
    ],
    flaws: [
      "Me distraigo fácilmente con la promesa de información.",
      "Desbloquear un misterio vale el precio de una civilización.",
    ],
  },
  {
    name: "Héroe del Pueblo",
    skills: ["Trato con Animales", "Supervivencia"],
    desc: "Vienes de un rango social humilde, destinado a más.",
    traits: [
      "Juzgo a la gente por sus acciones.",
      "Si alguien está en problemas, ayudo.",
    ],
    ideals: ["Respeto", "Justicia", "Libertad", "Destino", "Sinceridad"],
    bonds: [
      "Protejo a quienes no pueden protegerse.",
      "Deseo que mi amor de la infancia hubiera venido conmigo.",
    ],
    flaws: [
      "El tirano de mi tierra quiere matarme.",
      "Tengo debilidad por los vicios de la ciudad.",
    ],
  },
];

// OGL COMPLIANT: Use placeholder or manually input standard SRD spells
export const SPELLS = [];

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

// NEW: COMBAT ACTIONS
export const COMBAT_ACTIONS = [
  { name: "Atacar", desc: "Realizas un ataque cuerpo a cuerpo o a distancia." },
  {
    name: "Lanzar un Conjuro",
    desc: "Lanzas un truco o un conjuro de nivel 1+.",
  },
  {
    name: "Correr",
    desc: "Ganas movimiento adicional igual a tu velocidad actual.",
  },
  {
    name: "Destrabarse",
    desc: "Tu movimiento no provoca ataques de oportunidad este turno.",
  },
  {
    name: "Esquivar",
    desc: "Ataques contra ti tienen Desventaja. Tus salvaciones de DES tienen Ventaja.",
  },
  {
    name: "Ayudar",
    desc: "Das Ventaja a un aliado en su próxima prueba o ataque.",
  },
  { name: "Esconderse", desc: "Haces una prueba de Sigilo para ocultarte." },
  {
    name: "Preparar",
    desc: "Preparas una acción para usarla como Reacción cuando ocurra un disparador.",
  },
  { name: "Buscar", desc: "Dedicas tu atención a encontrar algo." },
  {
    name: "Usar un Objeto",
    desc: "Interactúas con un objeto que requiere una acción completa.",
  },
];
