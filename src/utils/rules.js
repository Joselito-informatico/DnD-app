/**
 * Calcula la AC basándose en la armadura y escudos equipados.
 * @param {Array} inventory - Lista de items del héroe.
 * @param {number} dexMod - Modificador de Destreza.
 * @param {Array} features - Rasgos (para Defensa sin Armadura - Monk/Barbarian).
 * @returns {number} Clase de Armadura final.
 */
export function calculateAC(inventory, dexMod, features = []) {
  let baseAC = 10 + dexMod; // Base por defecto (Sin armadura)
  let shieldBonus = 0;
  let hasArmor = false;

  // 1. Buscar Armadura y Escudos equipados
  const equippedArmor = inventory.find(i => i.isEquipped && i.type === 'armor' && i.armorType !== 'shield');
  const equippedShield = inventory.find(i => i.isEquipped && (i.type === 'shield' || i.armorType === 'shield'));

  // 2. Calcular Base según tipo de armadura
  if (equippedArmor) {
    hasArmor = true;
    const acVal = parseInt(equippedArmor.ac) || 10;
    
    // Detección simple por nombre o categoría (la API a veces varía, esto es un estándar robusto)
    const name = equippedArmor.name.toLowerCase();
    const category = equippedArmor.category || ""; 

    if (category.includes('Heavy') || name.includes('plate') || name.includes('chain mail') || name.includes('splint')) {
      baseAC = acVal; // Pesada: No suma DEX
    } else if (category.includes('Medium') || name.includes('scale') || name.includes('breastplate') || name.includes('half plate') || name.includes('hide')) {
      baseAC = acVal + Math.min(dexMod, 2); // Media: Max DEX +2
    } else {
      baseAC = acVal + dexMod; // Ligera: Full DEX
    }
  }

  // 3. Aplicar Escudo
  if (equippedShield) {
    // Si la API trae el bono, úsalo, si no, estándar +2
    shieldBonus = parseInt(equippedShield.ac) || 2; 
  }

  // 4. Casos Especiales (Unarmored Defense) - Solo si NO lleva armadura
  if (!hasArmor) {
    const barbarianDef = features.find(f => f.name === 'Unarmored Defense' && f.desc.includes('CON'));
    const monkDef = features.find(f => f.name === 'Unarmored Defense' && f.desc.includes('WIS'));

    // NOTA: Para implementar esto perfecto necesitaríamos pasar los stats de CON y WIS a esta función.
    // Por ahora, devolvemos un flag o dejamos que CombatView maneje los bonos especiales.
    // Mantenemos la lógica simple aquí: Base + Escudo.
  }

  return baseAC + shieldBonus;
}