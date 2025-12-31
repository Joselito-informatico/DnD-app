import { calculateAC as coreCalculateAC, ARMOR_TYPES } from "@dnd/core";

/**
 * Calcula la CA conectando el inventario y stats con el núcleo.
 * @param {Array} inventory - Lista de items.
 * @param {Object} stats - Objeto con atributos base { str, dex, con, wis... }
 * @param {Array} features - Rasgos del personaje.
 * @param {string} className - Nombre de la clase (ej: "Bárbaro").
 */
export function calculateAC(inventory, stats, features = [], className = "") {
  // Helper para calcular modificador desde el atributo base
  const getMod = (val) => Math.floor((val - 10) / 2);
  const dexMod = getMod(stats.dex || 10);

  // 1. Buscar Armadura equipada
  const equippedArmor = inventory.find(
    (i) =>
      i.isEquipped &&
      i.type === "armor" &&
      i.armorCategory !== ARMOR_TYPES.SHIELD
  );

  // 2. Buscar Escudo
  let equippedShield = inventory.find(
    (i) =>
      i.isEquipped &&
      (i.type === "shield" || i.armorCategory === ARMOR_TYPES.SHIELD)
  );

  // 3. Lógica de Defensa sin Armadura
  let unarmoredBonus = 0;

  // Bárbaro: 10 + DES + CON (Puede usar escudo)
  const isBarbarian =
    className === "Bárbaro" ||
    features.some(
      (f) => f.name === "Defensa sin Armadura" && f.desc.includes("CON")
    );
  if (isBarbarian) {
    unarmoredBonus = getMod(stats.con || 10);
  }

  // Monje: 10 + DES + SAB (NO puede usar escudo)
  const isMonk =
    className === "Monje" ||
    features.some(
      (f) => f.name === "Defensa sin Armadura" && f.desc.includes("SAB")
    );
  if (isMonk) {
    if (equippedShield) {
      // Regla SRD: Si llevas escudo, pierdes el beneficio de Monje.
      // Pero si eres multiclase Bárbaro/Monje (raro), podrías preferir la CA de Bárbaro.
      // Aquí simplificamos: el escudo anula el bono de Monje.
      // Si no era Bárbaro también, el bono vuelve a 0.
      if (!isBarbarian) unarmoredBonus = 0;
    } else {
      // Si no lleva escudo, tomamos el mejor bono (por si es multiclase)
      unarmoredBonus = Math.max(unarmoredBonus, getMod(stats.wis || 10));
    }
  }

  return coreCalculateAC(equippedArmor, equippedShield, dexMod, {
    unarmoredBonus,
  });
}
