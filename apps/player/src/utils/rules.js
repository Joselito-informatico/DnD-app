import { calculateAC as coreCalculateAC, ARMOR_TYPES } from "@dnd/core";

/**
 * Calcula la Clase de Armadura (CA) conectando la App con el Core.
 * Actúa como adaptador entre el inventario de la UI y la lógica pura.
 * * @param {Array} inventory - Lista de items del personaje.
 * @param {number} dexMod - Modificador de Destreza.
 * @param {Array} features - Rasgos (para soporte futuro de Monje/Bárbaro).
 * @returns {number} Clase de Armadura final.
 */
export function calculateAC(inventory, dexMod, features = []) {
  // 1. Buscar Armadura equipada
  // Ya no usamos strings. Buscamos explícitamente items de tipo 'armor' que NO sean escudos.
  // La propiedad 'armorCategory' ahora viene de tus datos normalizados en items.js
  const equippedArmor = inventory.find(
    (i) =>
      i.isEquipped &&
      i.type === "armor" &&
      i.armorCategory !== ARMOR_TYPES.SHIELD
  );

  // 2. Buscar Escudo equipado
  // Buscamos items que sean explícitamente escudos.
  const equippedShield = inventory.find(
    (i) =>
      i.isEquipped &&
      (i.type === "shield" || i.armorCategory === ARMOR_TYPES.SHIELD)
  );

  // 3. Delegar el cálculo matemático al Núcleo (Core)
  // El Core no sabe qué es un inventario, solo recibe objetos limpios.
  return coreCalculateAC(equippedArmor, equippedShield, dexMod);
}
