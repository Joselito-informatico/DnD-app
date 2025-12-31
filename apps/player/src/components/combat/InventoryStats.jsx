import { Weight, Coins } from "lucide-react";
import {
  calculateTotalWeight,
  getEncumbranceStatus,
} from "../../utils/encumbrance";

export function InventoryStats({ inventory, money, strength }) {
  const totalWeight = calculateTotalWeight(inventory, money);
  const { max, status, color, percentage } = getEncumbranceStatus(
    totalWeight,
    strength
  );

  // Calcular total de oro en valor (opcional, útil para jugadores)
  const totalGp = (
    money.pp * 10 +
    money.gp +
    money.ep * 0.5 +
    money.sp * 0.1 +
    money.cp * 0.01
  ).toFixed(2);

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-800 p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2 text-stone-400">
          <Weight size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Carga
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-bold ${
              percentage > 100 ? "text-red-500" : "text-stone-200"
            }`}
          >
            {totalWeight}{" "}
            <span className="text-stone-500 text-xs">/ {max} lb</span>
          </span>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden mb-2 relative">
        {/* Marcas de Variante (5x y 10x Fuerza) */}
        <div
          className="absolute top-0 bottom-0 left-[33%] w-px bg-stone-950/50 z-10"
          title="Pesado"
        ></div>
        <div
          className="absolute top-0 bottom-0 left-[66%] w-px bg-stone-950/50 z-10"
          title="Muy Pesado"
        ></div>

        <div
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`text-[10px] font-bold uppercase ${
            percentage > 33 ? "text-yellow-600" : "text-stone-600"
          }`}
        >
          {status}
        </span>

        <div className="flex items-center gap-1 text-stone-500 bg-stone-950 px-2 py-1 rounded text-[10px]">
          <Coins size={10} className="text-yellow-600" />
          <span>Valor: {totalGp} po</span>
        </div>
      </div>
    </div>
  );
}
