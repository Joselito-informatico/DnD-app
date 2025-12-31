/**
 * Convierte strings de peso (ej: "2 lb", "1/4 lb") a números flotantes.
 */
function parseWeight(weightStr) {
  if (!weightStr) return 0;
  const cleanStr = weightStr.toString().toLowerCase().replace("lb", "").trim();

  // Manejo de fracciones (ej: "1/4")
  if (cleanStr.includes("/")) {
    const [num, den] = cleanStr.split("/");
    return parseFloat(num) / parseFloat(den);
  }

  return parseFloat(cleanStr) || 0;
}

/**
 * Calcula el peso total del inventario.
 * @param {Array} inventory - Lista de objetos.
 * @param {Object} money - Objeto de monedas (50 monedas = 1 lb).
 */
export function calculateTotalWeight(inventory = [], money = {}) {
  let total = 0;

  // 1. Sumar objetos
  inventory.forEach((item) => {
    const w = parseWeight(item.weight);
    const qty = parseInt(item.qty) || 1;
    total += w * qty;
  });

  // 2. Sumar monedas (Regla SRD: 50 monedas = 1 libra)
  const totalCoins = Object.values(money).reduce(
    (a, b) => a + (parseInt(b) || 0),
    0
  );
  total += totalCoins / 50;

  return Math.round(total * 100) / 100; // Redondear a 2 decimales
}

/**
 * Determina el estado de carga según la Fuerza (Regla Estándar + Variante).
 * @param {number} currentWeight
 * @param {number} strengthScore
 */
export function getEncumbranceStatus(currentWeight, strengthScore) {
  const str = strengthScore || 10;

  // Reglas SRD 5.1
  const maxCarry = str * 15;
  const pushDragLift = str * 30;

  // Estados de Variante (Opcional visualmente)
  const encumberedLimit = str * 5;
  const heavilyEncumberedLimit = str * 10;

  let status = "Normal";
  let color = "bg-stone-600"; // Gris (Normal)

  if (currentWeight > maxCarry) {
    status = "Sobrecarga (Inmóvil)";
    color = "bg-red-600 animate-pulse";
  } else if (currentWeight > heavilyEncumberedLimit) {
    status = "Muy Pesado (-20 pies)";
    color = "bg-orange-600";
  } else if (currentWeight > encumberedLimit) {
    status = "Pesado (-10 pies)";
    color = "bg-yellow-600";
  }

  return {
    current: currentWeight,
    max: maxCarry,
    pushMax: pushDragLift,
    status,
    color,
    percentage: Math.min(100, (currentWeight / maxCarry) * 100),
  };
}
