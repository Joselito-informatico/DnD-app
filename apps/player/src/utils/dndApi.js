import { SPELLS } from "../data/spells";
import { WEAPONS, ARMOR, ADVENTURING_GEAR, MAGIC_ITEMS } from "../data/items";

// Endpoint de la API pública Open5e (SRD)
const OPEN5E_API = "https://api.open5e.com/search/?limit=5&text=";

/**
 * Busca conjuros usando estrategia híbrida: Local First -> Cloud Fallback
 */
export async function searchSpells(query, filters = {}) {
  const lowerQ = query.toLowerCase();

  // 1. INTENTO LOCAL (Instantáneo)
  let localResults = SPELLS.filter((s) =>
    s.name.toLowerCase().includes(lowerQ)
  );

  if (filters.level !== undefined) {
    localResults = localResults.filter((s) => s.level === filters.level);
  }

  // Si encontramos al menos 3 resultados locales, asumimos que es suficiente
  if (localResults.length >= 3) {
    return localResults;
  }

  // 2. INTENTO REMOTO (Open5e API)
  // Si no hay suficientes resultados locales, buscamos en la nube
  try {
    const res = await fetch(`${OPEN5E_API}${encodeURIComponent(query)}`);
    const data = await res.json();

    // Procesamos y normalizamos los datos de la API para que coincidan con nuestra estructura
    const apiSpells = data.results
      .filter((r) => r.route === "spells")
      .map((r) => ({
        id: `api-${r.slug}`,
        name: r.name,
        level: parseLevel(r.level),
        school: r.school || "Universal",
        desc: r.desc || r.description,
        time: r.casting_time,
        range: r.range,
        duration: r.duration,
        components: r.components,
        ritual: r.ritual === "yes",
        source: "Open5e API", // Flag para saber origen
      }));

    // Combinamos resultados evitando duplicados (priorizando local)
    const combined = [...localResults];
    apiSpells.forEach((apiS) => {
      if (!combined.find((loc) => loc.name === apiS.name)) {
        combined.push(apiS);
      }
    });

    return combined;
  } catch (error) {
    console.warn("API Offline or Failed:", error);
    return localResults; // Fallback silencioso a lo que tengamos local
  }
}

/**
 * Busca equipo (Por ahora solo local, ya que la API de items es compleja de normalizar)
 */
export async function searchEquipment(query) {
  const lowerQ = query.toLowerCase();
  const allItems = [...WEAPONS, ...ARMOR, ...ADVENTURING_GEAR, ...MAGIC_ITEMS];

  return allItems.filter(
    (i) =>
      i.name.toLowerCase().includes(lowerQ) ||
      (i.category && i.category.toLowerCase().includes(lowerQ))
  );
}

// Helper interno para convertir niveles de texto ("1st-level") a número (1)
function parseLevel(levelStr) {
  if (!levelStr) return 0;
  if (levelStr.includes("cantrip")) return 0;
  const match = levelStr.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}
