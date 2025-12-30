/**
 * Lanza un número específico de dados de ciertas caras.
 * @param {number} count - Cantidad de dados (ej: 2)
 * @param {number} sides - Caras del dado (ej: 6)
 * @returns {object} { total, rolls: [] }
 */
export function roll(count, sides) {
  const rolls = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const val = Math.floor(Math.random() * sides) + 1;
    rolls.push(val);
    total += val;
  }
  return { total, rolls };
}

/**
 * Parsea un string de daño (ej: "2d6") y lo lanza.
 * @param {string} diceString - Ej: "1d8", "2d6"
 * @param {boolean} isCrit - Si es crítico, dobla los dados.
 * @returns {object} Resultado del daño
 */
export function rollDamage(diceString, isCrit = false) {
  if (!diceString) return { total: 0, rolls: [], formula: "0" };

  // Detectar formato "XdY" (Ej: 2d6)
  const [countStr, sidesStr] = diceString.toLowerCase().split('d');
  let count = parseInt(countStr) || 1;
  const sides = parseInt(sidesStr) || 6;

  // Si es crítico, doblamos los dados
  if (isCrit) count *= 2;

  const { total, rolls } = roll(count, sides);

  return {
    total,
    rolls,
    formula: `${count}d${sides}`,
    isCrit
  };
}