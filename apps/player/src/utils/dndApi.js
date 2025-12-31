import { SPELLS } from "../data/spells";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../data/items";
import { CONDITIONS, COMBAT_ACTIONS, SKILLS } from "../data/rules";
import { RACES, CLASSES, BACKGROUNDS } from "../data/character";

// ==========================================
// 🧙‍♂️ API DE HECHIZOS
// ==========================================

export async function searchSpells(query = "", filters = {}) {
  return new Promise((resolve) => {
    let results = SPELLS;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((s) =>
        s.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters.level !== undefined && filters.level !== "") {
      results = results.filter((s) => s.level === parseInt(filters.level));
    }

    if (filters.class) {
      results = results.filter((s) => s.classes.includes(filters.class));
    }

    if (filters.school) {
      results = results.filter((s) => s.school === filters.school);
    }

    const mapped = results.map((spell) => ({
      ...spell,
      type: "spell", // Identificador para la UI
      damage: spell.damage || detectDamage(spell.desc),
    }));

    resolve(mapped);
  });
}

export function getSpellById(spellId) {
  return SPELLS.find((s) => s.id === spellId) || null;
}

// ==========================================
// 🛡️ API DE EQUIPO
// ==========================================

export async function searchEquipment(query = "", filters = {}) {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();
    let pool = [];

    const includeWeapons = !filters.category || filters.category === "Armas";
    // Nota: El filtro 'category' en Compendium suele ser específico (ej: "Marcial").
    // Aquí simplificamos: si busca texto, busca en todo. Si hay filtro específico, se aplica abajo.

    // 1. Unificar fuentes
    pool.push(
      ...WEAPONS.map((w) => ({
        ...w,
        type: "weapon",
        desc: `${w.damageType}. ${w.properties}`,
      }))
    );
    pool.push(
      ...ARMOR.map((a) => ({
        ...a,
        type: "armor",
        desc: `CA: ${a.ac} | Sigilo: ${a.stealth}`,
      }))
    );
    pool.push(...ADVENTURING_GEAR.map((g) => ({ ...g, type: "gear" })));
    pool.push(
      ...MAGIC_ITEMS.map((m) => ({
        ...m,
        type: "magic-item",
        requiresAttunement: m.attunement === "Sí",
      }))
    );

    // 2. Filtrado por Texto
    if (query) {
      pool = pool.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Filtrado por Categoría Específica (si viene del dropdown)
    if (filters.category && filters.category !== "") {
      pool = pool.filter(
        (item) =>
          item.category === filters.category ||
          (item.type === "magic-item" &&
            filters.category === "Objeto Mágico") ||
          (item.type === "weapon" && filters.category === "Armas") // Ejemplo de agrupación
      );
    }

    resolve(pool);
  });
}

export function getItemByName(name) {
  const allItems = [...WEAPONS, ...ARMOR, ...ADVENTURING_GEAR, ...MAGIC_ITEMS];
  return allItems.find((i) => i.name === name) || null;
}

// ==========================================
// 📜 API DE REGLAS (NUEVA)
// ==========================================
// Busca en Condiciones, Acciones de Combate y Habilidades

export async function searchRules(query = "") {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();

    // Normalizamos los datos para que tengan una estructura común
    const conditions = CONDITIONS.map((c) => ({
      ...c,
      type: "condition",
      category: "Condición",
    }));
    const actions = COMBAT_ACTIONS.map((a) => ({
      ...a,
      type: "action",
      category: "Acción de Combate",
    }));
    const skills = SKILLS.map((s) => ({
      name: s.name,
      desc: `Habilidad basada en ${s.stat.toUpperCase()}.`,
      type: "skill",
      category: "Habilidad",
    }));

    let pool = [...conditions, ...actions, ...skills];

    if (query) {
      pool = pool.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    resolve(pool);
  });
}

// ==========================================
// 👤 API DE OPCIONES DE PERSONAJE (NUEVA)
// ==========================================
// Busca en Razas, Clases y Trasfondos

export async function searchCharacterOptions(query = "") {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();

    const races = RACES.map((r) => ({
      name: r.name,
      desc: r.description,
      details: `Velocidad: ${r.speed} | Tamaño: ${r.size}`,
      type: "race",
      category: "Raza",
    }));

    const classes = CLASSES.map((c) => ({
      name: c.name,
      desc: `DG: ${c.hitDie} | Principal: ${c.primaryStat.toUpperCase()}`,
      details: `Salvaciones: ${c.saves.join(", ")}`,
      type: "class",
      category: "Clase",
    }));

    const backgrounds = BACKGROUNDS.map((b) => ({
      name: b.name,
      desc: b.desc,
      details: `Habilidades: ${b.skills.join(", ")}`,
      type: "background",
      category: "Trasfondo",
    }));

    let pool = [...races, ...classes, ...backgrounds];

    if (query) {
      pool = pool.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    resolve(pool);
  });
}

// ==========================================
// 🔧 UTILIDADES
// ==========================================

function detectDamage(desc) {
  if (!desc) return "";
  const regex = /(\d+d\d+(\s?\+\s?\d+)?)/;
  const match = desc.match(regex);
  return match ? match[0] : "";
}
