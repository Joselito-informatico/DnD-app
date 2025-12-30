import { SPELLS } from "../data/spells";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../data/items";

// --- BUSCADOR DE HECHIZOS (LOCAL) ---
export async function searchSpells(query) {
  // Simulamos una promesa para no romper componentes que esperen 'await'
  // aunque ya no sea estrictamente necesario.
  return new Promise((resolve) => {
    if (!query || query.length < 3) {
      resolve([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const results = SPELLS.filter((spell) =>
      spell.name.toLowerCase().includes(lowerQuery)
    ).map((spell) => ({
      name: spell.name,
      level: spell.level,
      school: spell.school,
      time: spell.time,
      desc: spell.desc,
      damage: spell.damage || detectDamage(spell.desc), // Usa el predefinido o intenta detectarlo
      components: spell.components,
      range: spell.range,
      duration: spell.duration,
    }));

    resolve(results);
  });
}

// --- BUSCADOR DE EQUIPO UNIFICADO (LOCAL) ---
export async function searchEquipment(query) {
  return new Promise((resolve) => {
    if (!query || query.length < 3) {
      resolve([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // 1. Buscar Armas
    const weapons = WEAPONS.filter((w) =>
      w.name.toLowerCase().includes(lowerQuery)
    ).map((w) => ({
      type: "weapon",
      name: w.name,
      category: w.category,
      damage: w.damage,
      cost: w.cost,
      weight: w.weight,
      properties: w.properties,
      desc: `${w.damageType}. ${w.properties}`, // Formato para vista simple
    }));

    // 2. Buscar Armaduras
    const armors = ARMOR.filter((a) =>
      a.name.toLowerCase().includes(lowerQuery)
    ).map((a) => ({
      type: "armor",
      name: a.name,
      category: a.category,
      ac: a.ac,
      cost: a.cost,
      weight: a.weight,
      strength: a.strength,
      desc: `CA: ${a.ac} | Sigilo: ${a.stealth}`,
    }));

    // 3. Buscar Equipo General
    const gear = ADVENTURING_GEAR.filter((g) =>
      g.name.toLowerCase().includes(lowerQuery)
    ).map((g) => ({
      type: "gear",
      name: g.name,
      cost: g.cost,
      weight: g.weight,
      desc: g.desc,
    }));

    // 4. Buscar Objetos Mágicos
    const magic = MAGIC_ITEMS.filter((m) =>
      m.name.toLowerCase().includes(lowerQuery)
    ).map((m) => ({
      type: "magic-item",
      name: m.name,
      rarity: m.rarity,
      desc: m.desc,
      requiresAttunement: m.attunement === "Sí",
    }));

    // Combinar todo
    resolve([...weapons, ...armors, ...gear, ...magic]);
  });
}

// Utilidad auxiliar por si algún hechizo no tiene campo 'damage' explícito
function detectDamage(desc) {
  const regex = /(\d+d\d+(\s?\+\s?\d+)?)/; // Mejorado para capturar modificadores simples (ej: 1d4 + 1)
  const match = desc.match(regex);
  return match ? match[0] : "";
}
