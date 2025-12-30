/**
 * Calcula la Clase de Armadura (CA) basándose en el equipo en ESPAÑOL (SRD).
 * @param {Array} inventory - Lista de items.
 * @param {number} dexMod - Modificador de Destreza.
 * @param {Array} features - Rasgos (para Monje/Bárbaro).
 * @returns {number} Clase de Armadura final.
 */
export function calculateAC(inventory, dexMod, features = []) {
  let baseAC = 10 + dexMod; // Base por defecto (Sin armadura)
  let shieldBonus = 0;
  let hasArmor = false;

  // 1. Buscar Armadura y Escudos equipados
  const equippedArmor = inventory.find(
    (i) => i.isEquipped && i.type === "armor" && i.armorType !== "shield"
  );
  const equippedShield = inventory.find(
    (i) =>
      i.isEquipped &&
      (i.type === "shield" ||
        i.armorType === "shield" ||
        i.name.toLowerCase().includes("escudo"))
  );

  // 2. Calcular Base según tipo de armadura (Nombres en Español SRD)
  if (equippedArmor) {
    hasArmor = true;
    const acVal = parseInt(equippedArmor.ac) || 10;
    const name = equippedArmor.name.toLowerCase();

    // Pesada (No suma DES)
    // Excluye "camisa" (media) y "semi" (media) para evitar falsos positivos con "malla" y "placas"
    if (
      (name.includes("anillas") ||
        name.includes("malla") ||
        name.includes("bandas") ||
        name.includes("placas")) &&
      !name.includes("camisa") &&
      !name.includes("semi") &&
      !name.includes("escamas")
    ) {
      baseAC = acVal; // Pesada real
    }
    // Media (Max DES +2)
    else if (
      name.includes("pieles") ||
      name.includes("coraza") ||
      name.includes("semiplacas") ||
      name.includes("escamas") ||
      name.includes("camisa")
    ) {
      baseAC = acVal + Math.min(dexMod, 2);
    }
    // Ligera (Full DES) - Acolchada, Cuero, Cuero Tachonado
    else {
      baseAC = acVal + dexMod;
    }
  }

  // 3. Aplicar Escudo (+2 por defecto si no viene dato)
  if (equippedShield) {
    shieldBonus = parseInt(equippedShield.ac) || 2;
  }

  return baseAC + shieldBonus;
}
