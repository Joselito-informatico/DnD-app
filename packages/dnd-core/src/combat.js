import { ARMOR_TYPES } from "./constants.js";

/**
 * Calcula la Clase de Armadura (CA) según reglas SRD 5.2
 * @param {Object} armor - Objeto armadura normalizado
 * @param {Object} shield - Objeto escudo normalizado
 * @param {number} dexMod - Modificador de Destreza
 * @param {Object} options - { unarmoredBonus: number (ej: conMod), miscBonus: number }
 */
export function calculateAC(armor, shield, dexMod, options = {}) {
  let ac = 10 + dexMod; // Base

  // 1. Defensa sin Armadura (Monje/Bárbaro)
  // Solo aplica si NO llevas armadura
  if (!armor && options.unarmoredBonus) {
    ac += options.unarmoredBonus;
  }

  // 2. Cálculo estándar de Armadura (Sobrescribe lo anterior si hay armadura)
  if (armor) {
    const base = parseInt(armor.ac) || 10;
    switch (armor.armorCategory) {
      case ARMOR_TYPES.HEAVY:
        ac = base; // No suma DEX
        break;
      case ARMOR_TYPES.MEDIUM:
        ac = base + Math.min(dexMod, 2);
        break;
      case ARMOR_TYPES.LIGHT:
        ac = base + dexMod;
        break;
      default:
        ac = 10 + dexMod;
    }
  }

  // 3. Escudos
  // El adaptador decide si pasar el objeto 'shield' o null según la clase (ej: Monje no lo usa).
  if (shield) {
    ac += parseInt(shield.ac) || 2;
  }

  // 4. Bonus varios (Anillo de protección, etc.)
  if (options.miscBonus) {
    ac += options.miscBonus;
  }

  return ac;
}
