// Fuente: SRD 5.2 Español - Reglas Generales

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
