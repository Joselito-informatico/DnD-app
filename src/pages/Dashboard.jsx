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

  // Mapa de Iconos por Clase (ESPAÑOL)
  const getClassIcon = (className) => {
    const c = className?.toLowerCase() || "";
    if (c.includes("bárbaro") || c.includes("barbarian"))
      return <Skull size={20} className="text-red-500" />;
    if (c.includes("bardo") || c.includes("bard"))
      return <Music size={20} className="text-pink-500" />;
    if (c.includes("clérigo") || c.includes("cleric"))
      return <Heart size={20} className="text-stone-300" />;
    if (c.includes("druida") || c.includes("druid"))
      return <Leaf size={20} className="text-green-500" />;
    if (c.includes("guerrero") || c.includes("fighter"))
      return <Sword size={20} className="text-stone-400" />;
    if (c.includes("monje") || c.includes("monk"))
      return <Zap size={20} className="text-blue-300" />;
    if (c.includes("paladín") || c.includes("paladin"))
      return <Shield size={20} className="text-yellow-500" />;
    if (c.includes("explorador") || c.includes("ranger"))
      return <Crosshair size={20} className="text-green-700" />;
    if (c.includes("pícaro") || c.includes("rogue"))
      return <Ghost size={20} className="text-stone-600" />;
    if (c.includes("hechicero") || c.includes("sorcerer"))
      return <Flame size={20} className="text-orange-500" />;
    if (c.includes("brujo") || c.includes("warlock"))
      return <Eye size={20} className="text-purple-500" />;
    if (c.includes("mago") || c.includes("wizard"))
      return <Book size={20} className="text-blue-500" />;
    return <User size={20} />;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          if (
            confirm("¿Importar reemplazará tu lista actual. ¿Estás seguro?")
          ) {
            onImport(imported);
          }
        } else {
          alert("Formato JSON inválido. Se espera un array de héroes.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 pb-24 min-h-screen animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-stone-100 tracking-tight">
            {t("appTitle")}
          </h1>
          <p className="text-stone-500 text-sm mt-1">{t("subTitle")}</p>
        </div>
        <div className="flex gap-2">
          <label className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white cursor-pointer transition">
            <Upload size={20} />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </header>

      {/* Lista de Héroes */}
      <div className="grid grid-cols-1 gap-4">
        {heroes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-stone-800 rounded-2xl">
            <Ghost size={48} className="mx-auto text-stone-700 mb-4" />
            <p className="text-stone-500">{t("noHeroes")}</p>
          </div>
        ) : (
          heroes.map((hero) => {
            const hpPct =
              hero.maxHP > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((hero.currentHP ?? hero.maxHP) / hero.maxHP) * 100
                    )
                  )
                : 100;
            const hp = hero.currentHP ?? hero.maxHP;

            return (
              <div
                key={hero.id}
                onClick={() => onNavigate(hero)}
                className="group bg-stone-800 border border-stone-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-yellow-500 transition-all duration-200 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center border border-stone-800 group-hover:border-yellow-500/50 overflow-hidden">
                    {hero.details?.avatar ? (
                      <img
                        src={hero.details.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getClassIcon(hero.class)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-200 group-hover:text-yellow-500 transition">
                      {hero.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Nivel {hero.level} {hero.race} {hero.class}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end w-24">
                  <span className="text-xs font-bold text-stone-400 mb-1">
                    PG {hp}/{hero.maxHP}
                  </span>
                  <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        hp === 0 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${hpPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botones de Acción */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onCreate}
          className="w-full py-4 bg-yellow-500 text-stone-900 font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> {t("createHero")}
        </button>

        <button
          onClick={onRandom}
          className="w-full py-3 bg-stone-800 text-stone-400 font-bold rounded-xl border border-stone-700 hover:bg-stone-700 hover:text-white transition flex items-center justify-center gap-2"
        >
          <Dices size={18} /> {t("randomHero")}
        </button>
      </div>
    </div>
  );
}
