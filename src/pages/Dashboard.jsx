import {
  Plus,
  Download,
  Upload,
  Trash2,
  Sword,
  Shield,
  Zap,
  Heart,
  Skull,
  Music,
  Leaf,
  Eye,
  Flame,
  Book,
  Crosshair,
  Crown,
  Ghost,
  Dices,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function Dashboard({
  heroes,
  onNavigate,
  onCreate,
  onImport,
  onRandom,
}) {
  const { t } = useLanguage();

  // Mapa de Iconos por Clase
  const getClassIcon = (className) => {
    const c = className?.toLowerCase();
    if (c?.includes("barbarian"))
      return <Skull size={20} className="text-red-500" />;
    if (c?.includes("bard"))
      return <Music size={20} className="text-pink-500" />;
    if (c?.includes("cleric"))
      return <Heart size={20} className="text-stone-300" />;
    if (c?.includes("druid"))
      return <Leaf size={20} className="text-green-500" />;
    if (c?.includes("fighter"))
      return <Sword size={20} className="text-stone-400" />;
    if (c?.includes("monk"))
      return <Zap size={20} className="text-yellow-400" />;
    if (c?.includes("paladin"))
      return <Shield size={20} className="text-yellow-600" />;
    if (c?.includes("ranger"))
      return <Crosshair size={20} className="text-emerald-600" />;
    if (c?.includes("rogue"))
      return <Eye size={20} className="text-stone-500" />;
    if (c?.includes("sorcerer"))
      return <Flame size={20} className="text-orange-500" />;
    if (c?.includes("warlock"))
      return <Ghost size={20} className="text-purple-500" />;
    if (c?.includes("wizard"))
      return <Book size={20} className="text-blue-500" />;
    return <Crown size={20} className="text-yellow-500" />; // Default
  };

  // Manejador para importar archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        onImport(json);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="px-6 pt-8 pb-32 animate-in fade-in duration-300 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-100 tracking-tight">
            {t("myHeroes")}
          </h1>
          <p className="text-stone-500 text-sm">{t("subTitle")}</p>
        </div>

        {/* Botones de Archivo (Backup) */}
        <div className="flex gap-2">
          <label className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white cursor-pointer transition border border-stone-700">
            <Upload size={18} />
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={() => {
              const dataStr = JSON.stringify(heroes, null, 2);
              const blob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `dnd_backup_${new Date()
                .toISOString()
                .slice(0, 10)}.json`;
              link.click();
            }}
            className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white transition border border-stone-700"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Lista de Héroes */}
      <div className="space-y-4 flex-1">
        {heroes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 border-2 border-dashed border-stone-800 rounded-2xl">
            <Ghost size={48} className="mb-4 text-stone-600" />
            <p className="text-stone-500 text-center px-6">{t("noHeroes")}</p>
          </div>
        ) : (
          heroes.map((hero) => {
            // Calcular porcentaje de vida para la barra mini
            const hp = hero.currentHP ?? hero.maxHP;
            const max = hero.maxHP || 1;
            const hpPct = Math.min(100, Math.max(0, (hp / max) * 100));

            return (
              <div
                key={hero.id}
                onClick={() => onNavigate(hero.id)}
                className="bg-stone-800 border border-stone-700 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all group active:scale-95"
              >
                {/* Avatar / Icono */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-600 flex items-center justify-center overflow-hidden shrink-0">
                    {hero.details?.avatar ? (
                      <img
                        src={hero.details.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                    ) : (
                      getClassIcon(hero.class)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-stone-950 text-stone-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-stone-700">
                    Lvl {hero.level}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-stone-100 truncate group-hover:text-yellow-500 transition">
                    {hero.name}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    {hero.race} {hero.class}
                  </p>

                  {/* Mini Barra HP */}
                  <div className="mt-2 h-1.5 w-full bg-stone-900 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full ${
                        hp === 0 ? "bg-red-600" : "bg-green-600"
                      }`}
                      style={{ width: `${hpPct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-stone-600 group-hover:text-yellow-500 transition">
                  <Sword size={20} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botones de Acción (Fab / Footer) */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onCreate}
          className="w-full py-4 bg-yellow-500 text-stone-900 font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> {t("createHero")}
        </button>

        <button
          onClick={onRandom}
          className="w-full py-3 bg-stone-800 text-stone-400 font-bold rounded-xl border border-stone-700 hover:text-white hover:bg-stone-700 transition flex items-center justify-center gap-2 text-sm active:scale-95"
        >
          <Dices size={16} /> {t("randomHero")}
        </button>
      </div>
    </div>
  );
}
