import { useState } from "react";
import { Dices, RefreshCw } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function DicePage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [diceMod, setDiceMod] = useState(0);

  const roll = (sides) => {
    const val = Math.floor(Math.random() * sides) + 1;
    const total = val + diceMod;
    const newRoll = {
      id: Date.now(),
      sides,
      val,
      mod: diceMod,
      total,
      isCrit: sides === 20 && val === 20,
      isFail: sides === 20 && val === 1,
    };
    setHistory([newRoll, ...history].slice(0, 10)); // Guardar últimos 10
  };

  return (
    <div className="pb-24 pt-6 px-6 h-screen flex flex-col animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-stone-100 mb-6 flex items-center gap-3">
        <Dices className="text-purple-500" /> {t("navDice")}
      </h1>

      {/* Historial (Scrollable) */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-stone-700">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-stone-500">
            <Dices size={48} className="mb-2" />
            <p>Tap a dice to roll</p>
          </div>
        )}
        {history.map((roll) => (
          <div
            key={roll.id}
            className={`p-4 rounded-xl border flex items-center justify-between animate-in slide-in-from-top-2 ${
              roll.isCrit
                ? "bg-yellow-900/20 border-yellow-500"
                : roll.isFail
                ? "bg-red-900/20 border-red-500"
                : "bg-stone-800 border-stone-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  roll.isCrit
                    ? "bg-yellow-500 text-black"
                    : roll.isFail
                    ? "bg-red-500 text-white"
                    : "bg-stone-700 text-stone-300"
                }`}
              >
                d{roll.sides}
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase font-bold">
                  Result
                </p>
                <p className="text-stone-300 text-sm">
                  {roll.val}{" "}
                  {roll.mod !== 0 &&
                    (roll.mod > 0
                      ? `+ ${roll.mod}`
                      : `- ${Math.abs(roll.mod)}`)}
                </p>
              </div>
            </div>
            <span
              className={`text-3xl font-bold ${
                roll.isCrit
                  ? "text-yellow-500"
                  : roll.isFail
                  ? "text-red-500"
                  : "text-stone-100"
              }`}
            >
              {roll.total}
            </span>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="bg-stone-900/80 backdrop-blur border-t border-stone-800 pt-4">
        {/* Modificador */}
        <div className="flex items-center justify-between bg-stone-800 p-3 rounded-xl border border-stone-700 mb-4">
          <span className="text-xs font-bold text-stone-500 uppercase">
            Modifier
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDiceMod((m) => m - 1)}
              className="w-10 h-10 bg-stone-700 rounded-lg text-xl hover:bg-stone-600"
            >
              -
            </button>
            <span className="text-xl font-bold w-8 text-center text-stone-100">
              {diceMod > 0 ? `+${diceMod}` : diceMod}
            </span>
            <button
              onClick={() => setDiceMod((m) => m + 1)}
              className="w-10 h-10 bg-stone-700 rounded-lg text-xl hover:bg-stone-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Grid de Dados */}
        <div className="grid grid-cols-3 gap-3">
          {[4, 6, 8, 10, 12, 20].map((sides) => (
            <button
              key={sides}
              onClick={() => roll(sides)}
              className="bg-stone-800 border border-stone-700 hover:bg-stone-700 hover:border-purple-500 active:scale-95 transition p-4 rounded-xl flex flex-col items-center gap-1 shadow-lg"
            >
              <span className="text-xs font-bold text-stone-500">d{sides}</span>
              <Dices
                className={sides === 20 ? "text-purple-500" : "text-stone-300"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
