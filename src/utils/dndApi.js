import { SPELLS } from "../data/spells";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../data/items";

// ==========================================
// 🧙‍♂️ API DE HECHIZOS
// ==========================================

/**
 * Busca hechizos con filtros avanzados.
 * @param {string} query - Texto a buscar (opcional)
 * @param {object} filters - { level, class, school, exactMatch }
 */
export async function searchSpells(query = "", filters = {}) {
  return new Promise((resolve) => {
    let results = SPELLS;

    // 1. Filtrar por Texto (Nombre)
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((s) =>
        s.name.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Filtrar por Nivel (0-9)
    if (filters.level !== undefined && filters.level !== "") {
      results = results.filter((s) => s.level === parseInt(filters.level));
    }

    // 3. Filtrar por Clase (ej: "Mago")
    if (filters.class) {
      results = results.filter((s) => s.classes.includes(filters.class));
    }

    // 4. Filtrar por Escuela
    if (filters.school) {
      results = results.filter((s) => s.school === filters.school);
    }

    // Formatear salida para la vista
    const mapped = results.map((spell) => ({
      ...spell, // Devolvemos todo el objeto original
      damage: spell.damage || detectDamage(spell.desc), // Aseguramos que haya daño si es detectable
    }));

    resolve(mapped);
  });
}

/**
 * Obtiene un hechizo específico por su ID exacto.
 * Útil para cargar la hoja de personaje.
 */
export function getSpellById(spellId) {
  return SPELLS.find((s) => s.id === spellId) || null;
}

// ==========================================
// 🛡️ API DE EQUIPO
// ==========================================

/**
 * Busca equipo combinando todas las listas.
 * @param {string} query
 * @param {object} filters - { type: 'weapon'|'armor'|'gear'|'magic', category }
 */
export async function searchEquipment(query = "", filters = {}) {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();

    // Recopilamos todo si no hay filtro de tipo específico, o solo lo solicitado
    let pool = [];

    // Selección de fuentes según filtro 'type'
    const includeWeapons = !filters.type || filters.type === "weapon";
    const includeArmor = !filters.type || filters.type === "armor";
    const includeGear = !filters.type || filters.type === "gear";
    const includeMagic = !filters.type || filters.type === "magic-item";

    if (includeWeapons) {
      pool.push(
        ...WEAPONS.map((w) => ({
          ...w,
          type: "weapon",
          desc: `${w.damageType}. ${w.properties}`,
        }))
      );
    }
    if (includeArmor) {
      pool.push(
        ...ARMOR.map((a) => ({
          ...a,
          type: "armor",
          desc: `CA: ${a.ac} | Sigilo: ${a.stealth}`,
        }))
      );
    }
    if (includeGear) {
      pool.push(...ADVENTURING_GEAR.map((g) => ({ ...g, type: "gear" })));
    }
    if (includeMagic) {
      pool.push(
        ...MAGIC_ITEMS.map((m) => ({
          ...m,
          type: "magic-item",
          requiresAttunement: m.attunement === "Sí",
        }))
      );
    }

    // 1. Filtrado por Texto
    if (query) {
      pool = pool.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Filtrado por Categoría (ej: "Marcial", "Ligera")
    if (filters.category) {
      pool = pool.filter((item) => item.category === filters.category);
    }

    resolve(pool);
  });
}

/**
 * Obtiene un objeto por su nombre exacto.
 */
export function getItemByName(name) {
  const allItems = [
    ...WEAPONS.map((w) => ({ ...w, type: "weapon" })),
    ...ARMOR.map((a) => ({ ...a, type: "armor" })),
    ...ADVENTURING_GEAR.map((g) => ({ ...g, type: "gear" })),
    ...MAGIC_ITEMS.map((m) => ({ ...m, type: "magic-item" })),
  ];
  return allItems.find((i) => i.name === name) || null;
}

// ==========================================
// 🔧 UTILIDADES
// ==========================================

function detectDamage(desc) {
  const regex = /(\d+d\d+(\s?\+\s?\d+)?)/;
  const match = desc.match(regex);
  return match ? match[0] : "";
}
