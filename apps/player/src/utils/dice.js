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
 * Parsea un string de daño (ej: "2d6 + 3") y lo lanza.
 * Soporta formatos: "1d8", "2d6+3", "1d4 + 1"
 * @param {string} diceString - Fórmula
 * @param {boolean} isCrit - Si es crítico, dobla los dados.
 * @returns {object} Resultado detallado
 */
export function rollDamage(diceString, isCrit = false) {
  if (!diceString) return { total: 0, rolls: [], formula: "0", finalTotal: 0, damageMod: 0 };

  // Limpiar espacios para facilitar el parseo
  const cleanStr = diceString.toLowerCase().replace(/\s+/g, '');
  
  // Separar dado y modificador (ej: 2d6+3 -> ["2d6", "3"])
  const parts = cleanStr.split('+');
  const dicePart = parts[0]; 
  const modPart = parts.length > 1 ? parseInt(parts[1]) : 0;

  // Analizar dados (XdY)
  const [countStr, sidesStr] = dicePart.split('d');
  let count = parseInt(countStr) || 1;
  const sides = parseInt(sidesStr) || 6;

  // Si es crítico, doblamos los dados
  if (isCrit) count *= 2;

  const { total, rolls } = roll(count, sides);
  const finalTotal = total + modPart;

  // Reconstruir fórmula visual
  let formulaDisplay = `${count}d${sides}`;
  if (modPart > 0) formulaDisplay += ` + ${modPart}`;

  return {
    total,       // Suma pura de los dados
    rolls,       // Array con los resultados individuales [3, 5, 1]
    formula: formulaDisplay,
    damageMod: modPart,
    finalTotal   // Total final (Dados + Mod)
  };
}

/**
 * Busca patrones de dados en un texto descriptivo.
 * Ej: "Deals 8d6 fire damage" -> Retorna "8d6"
 * Ej: "Heals 2d4 + 2 HP" -> Retorna "2d4+2"
 * @param {string} text - Descripción del objeto/hechizo
 * @returns {string|null} La fórmula encontrada o null
 */
export function findDiceFormula(text) {
  if (!text) return null;
  // Regex: Busca dígitos, "d", dígitos, y opcionalmente " + " y más dígitos
  const regex = /(\d+d\d+)(\s*\+\s*\d+)?/i;
  const match = text.match(regex);
  return match ? match[0] : null; 
}