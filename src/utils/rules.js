/**
 * Calcula la Clase de Armadura (CA) basándose en el equipo.
 * Soporta nombres en ESPAÑOL del SRD 5.1
 */
export function calculateAC(inventory, dexMod, features = []) {
  let baseAC = 10 + dexMod;
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
    if (
      name.includes("anillas") ||
      name.includes("malla") ||
      name.includes("bandas") ||
      name.includes("placas")
    ) {
      // Excepción: "Camisa de malla" (Chain Shirt) y "Cota de escamas" (Scale Mail) son Medias
      if (name.includes("camisa") || name.includes("escamas")) {
        baseAC = acVal + Math.min(dexMod, 2); // Media
      } else {
        baseAC = acVal; // Pesada real
      }
    }
    // Media (Max DES +2)
    else if (
      name.includes("pieles") ||
      name.includes("coraza") ||
      name.includes("semiplacas") ||
      name.includes("camisa") ||
      name.includes("escamas")
    ) {
      baseAC = acVal + Math.min(dexMod, 2);
    }
    // Ligera (Full DES) - Acolchada, Cuero, Cuero Tachonado
    else {
      baseAC = acVal + dexMod;
    }
  }

  // 3. Aplicar Escudo
  if (equippedShield) {
    shieldBonus = parseInt(equippedShield.ac) || 2;
  }

  // 4. Defensa sin Armadura (Bárbaro/Monje) - Se maneja en CombatView si !hasArmor
  // Aquí devolvemos el cálculo de equipo estándar.

  return baseAC + shieldBonus;
}
