// Servicio para buscar en la API de Open5e (Solo contenido SRD Legal)
const SPELLS_API = "https://api.open5e.com/spells/";
const WEAPONS_API = "https://api.open5e.com/weapons/";
const ARMOR_API = "https://api.open5e.com/armor/";

// --- BUSCADOR DE HECHIZOS ---
export async function searchSpells(query) {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(`${SPELLS_API}?search=${query}&limit=5`);
    const data = await response.json();
    
    return data.results.map(spell => ({
      name: spell.name,
      level: spell.level_int,
      school: spell.school,
      time: spell.casting_time,
      desc: spell.desc,
      damage: detectDamage(spell.desc) 
    }));
  } catch (error) {
    console.error("Spell API Error:", error);
    return [];
  }
}

// --- BUSCADOR DE EQUIPO (NUEVO) ---
export async function searchEquipment(query) {
  if (!query || query.length < 3) return [];

  try {
    // Buscamos en armas y armaduras en paralelo
    const [weaponsRes, armorRes] = await Promise.all([
      fetch(`${WEAPONS_API}?search=${query}&limit=5`),
      fetch(`${ARMOR_API}?search=${query}&limit=5`)
    ]);

    const weaponsData = await weaponsRes.json();
    const armorData = await armorRes.json();

    // Procesamos Armas
    const weapons = weaponsData.results.map(w => ({
      type: 'weapon',
      name: w.name,
      category: w.category, // Simple, Martial
      damage: w.damage_dice, // "1d8"
      cost: w.cost,
      weight: w.weight,
      properties: w.properties ? w.properties.join(", ") : ""
    }));

    // Procesamos Armaduras
    const armors = armorData.results.map(a => ({
      type: 'armor',
      name: a.name,
      category: a.category, // Light, Medium, Heavy, Shield
      ac: a.ac_string, // "16"
      cost: a.cost,
      weight: a.weight || "-",
      strength: a.strength_requirement
    }));

    // Combinamos resultados
    return [...weapons, ...armors];

  } catch (error) {
    console.error("Equipment API Error:", error);
    return [];
  }
}

function detectDamage(desc) {
  const regex = /(\d+d\d+)/; 
  const match = desc.match(regex);
  return match ? match[0] : ""; 
}