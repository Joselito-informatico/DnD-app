import { Shield, Heart, Zap, Star } from "lucide-react";

export function CombatStats({
  ac,
  initiative,
  hp,
  maxHp,
  tempHp = 0,
  inspiration,
  onToggleInspiration,
  onEditHp,
  onRollInitiative,
}) {
  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));

  return (
    <div className="space-y-4">
      {/* Fila Superior: Inspiración, Iniciativa, CA */}
      <div className="flex gap-3">
        {/* Inspiración */}
        <button
          onClick={onToggleInspiration}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition w-16 shrink-0 ${
            inspiration
              ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
              : "bg-stone-800 border-stone-700 text-stone-500 grayscale"
          }`}
        >
          <Star size={20} fill={inspiration ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold uppercase mt-1">Insp.</span>
        </button>

        {/* Iniciativa */}
        <button
          onClick={onRollInitiative}
          className="flex-1 bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center active:scale-95 transition hover:border-yellow-500/50"
        >
          <Zap className="text-yellow-600 mb-1 w-5 h-5" />
          <span className="text-xs text-stone-400 font-bold uppercase">
            Iniciativa
          </span>
          <span className="text-xl font-bold text-yellow-500">
            {initiative >= 0 ? `+${initiative}` : initiative}
          </span>
        </button>

        {/* Clase de Armadura */}
        <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 flex flex-col items-center justify-center w-20 shrink-0 relative overflow-hidden">
          <Shield className="text-stone-700 absolute -right-4 -bottom-4 w-20 h-20 opacity-20" />
          <span className="text-xs text-stone-400 font-bold uppercase z-10">
            CA
          </span>
          <span className="text-3xl font-bold text-stone-100 z-10">{ac}</span>
        </div>
      </div>

      {/* Barra de Vida */}
      <div
        onClick={onEditHp}
        className={`relative p-4 rounded-xl border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors ${
          hp === 0
            ? "bg-red-900/20 border-red-500 animate-pulse"
            : "bg-stone-800 border-stone-700 hover:border-stone-500"
        }`}
      >
        {/* Barra de fondo */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-stone-900">
          <div
            className={`h-full transition-all duration-500 ${
              hp < maxHp * 0.3 ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-2 z-10">
          <Heart
            className={
              hp === 0 ? "text-stone-500" : "text-red-500 fill-red-500"
            }
            size={24}
          />
          <span className="text-3xl font-bold text-white tracking-tight">
            {hp}{" "}
            <span className="text-lg text-stone-500 font-normal">
              / {maxHp}
            </span>
          </span>
        </div>
        {tempHp > 0 && (
          <span className="text-xs font-bold text-blue-400 mt-1 z-10">
            +{tempHp} Temporales
          </span>
        )}
      </div>
    </div>
  );
}
