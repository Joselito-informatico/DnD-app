import { ARMOR_TYPES } from './constants.js';

/**
 * Calcula la Clase de Armadura (CA) según reglas SRD 5.2
 * @param {Object} armor - Objeto armadura equipado (o null)
 * @param {Object} shield - Objeto escudo equipado (o null)
 * @param {number} dexMod - Modificador de Destreza (-5 a +5)
 * @param {Object} options - Opciones extra (ej: unarmoredDefense)
 * @returns {number} AC Final
 */
export function calculateAC(armor, shield, dexMod, options = {}) {
  let ac = 10 + dexMod; // Base por defecto (Sin armadura)

  // 1. Calcular Base según Armadura
  if (armor) {
    const base = parseInt(armor.ac) || 10;
    
    switch (armor.armorCategory) {
      case ARMOR_TYPES.HEAVY:
        // Pesada: AC fija, no suma DES
        ac = base;
        break;
      case ARMOR_TYPES.MEDIUM:
        // Media: AC base + DES (máx +2)
        ac = base + Math.min(dexMod, 2);
        break;
      case ARMOR_TYPES.LIGHT:
        // Ligera: AC base + DES total
        ac = base + dexMod;
        break;
      default:
        // Fallback o ropa común
        ac = 10 + dexMod;
    }
  }

  // TODO: Aquí iría la lógica de Unarmored Defense (Monje/Bárbaro) 
  // si 'armor' es null. (Lo implementaremos en Fase 5)

  // 2. Sumar Escudo
  if (shield) {
    const shieldBonus = parseInt(shield.ac) || 2;
    ac += shieldBonus;
  }

  // 3. Sumar bonificadores mágicos u otros (Anillo de Protección, etc.)
  if (options.miscBonus) {
    ac += options.miscBonus;
  }

  return ac;
}