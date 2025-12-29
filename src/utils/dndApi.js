// Servicio para buscar en la API de Open5e
const API_BASE = "https://api.open5e.com/spells/";

export async function searchSpells(query) {
  if (!query || query.length < 3) return []; // No buscar si es muy corto

  try {
    // Buscamos hechizos que contengan el texto
    const response = await fetch(`${API_BASE}?search=${query}&limit=5`);
    const data = await response.json();
    
    // Mapeamos los resultados al formato de nuestra app
    return data.results.map(spell => ({
      name: spell.name,
      level: spell.level_int, // La API devuelve "1st-level" y "level_int: 1"
      school: spell.school,
      time: spell.casting_time,
      desc: spell.desc, // Descripción completa
      // Intentamos detectar daño en la descripción para el botón de "Roll"
      damage: detectDamage(spell.desc) 
    }));
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// Pequeña ayuda para adivinar si el hechizo hace daño
function detectDamage(desc) {
  // Busca patrones como "8d6 fire damage" o "1d10 necrotic"
  const regex = /(\d+d\d+)/; 
  const match = desc.match(regex);
  return match ? match[0] : ""; 
}