import { useState, useRef } from "react";
import {
  UserPlus,
  Download,
  Upload,
  Sword,
  Shield,
  Zap,
  FileJson,
  Dices,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";

export function Dashboard({
  heroes,
  onNavigate,
  onCreate,
  onImport,
  onRandom,
}) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(heroes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dnd_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Backup downloaded!", "success");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHeroes = JSON.parse(e.target.result);
        if (Array.isArray(importedHeroes)) {
          onImport(importedHeroes);
        } else {
          showToast("Invalid JSON Format", "error");
        }
      } catch (err) {
        showToast("Error reading file", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col gap-2 border-b border-stone-800 pb-6 pr-16">
        <h1 className="text-3xl font-bold text-stone-100">{t("myHeroes")}</h1>
        <p className="text-stone-400">{t("subTitle")}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleExport}
            disabled={heroes.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-xs font-bold text-stone-300 hover:bg-stone-700 hover:text-white transition disabled:opacity-50"
          >
            <Download size={14} /> {t("backup")}
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-xs font-bold text-stone-300 hover:bg-stone-700 hover:text-white transition"
          >
            <Upload size={14} /> {t("restore")}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={onCreate}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-stone-700 hover:border-yellow-500 hover:bg-stone-800/50 transition h-48"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition">
            <UserPlus size={24} />
          </div>
          <span className="font-bold text-stone-400 group-hover:text-yellow-500">
            {t("createHero")}
          </span>
        </button>

        <button
          onClick={onRandom}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-stone-700 hover:border-purple-500 hover:bg-stone-800/50 transition h-48"
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 group-hover:rotate-180 transition duration-500">
            <Dices size={24} />
          </div>
          <span className="font-bold text-stone-400 group-hover:text-purple-500">
            {t("randomHero")}
          </span>
        </button>

        {heroes.map((hero) => (
          <div
            key={hero.id}
            onClick={() => onNavigate(hero.id)}
            className="relative group bg-stone-800 rounded-2xl p-5 border border-stone-700 cursor-pointer hover:border-yellow-500 hover:shadow-xl hover:-translate-y-1 transition h-48 flex flex-col justify-between overflow-hidden"
          >
            {/* FONDO IMAGEN DE PERSONAJE (O ICONO SI NO HAY) */}
            <div className="absolute inset-0 z-0">
              {hero.details?.avatar ? (
                <>
                  <img
                    src={hero.details.avatar}
                    alt="bg"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
                </>
              ) : (
                <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                  {hero.class === "Fighter" && <Sword size={120} />}
                  {hero.class === "Wizard" && <Zap size={120} />}
                  {hero.class === "Rogue" && <Shield size={120} />}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-stone-100 group-hover:text-yellow-500 transition truncate pr-2 shadow-black drop-shadow-md">
                  {hero.name}
                </h3>
                <span className="bg-stone-950/80 border border-stone-700 text-stone-300 text-xs px-2 py-1 rounded font-mono">
                  Lvl {hero.level}
                </span>
              </div>
              <p className="text-stone-400 text-sm font-medium shadow-black drop-shadow-sm">
                {hero.race} {hero.class}
              </p>
            </div>

            <div className="flex gap-2 mt-4 relative z-10">
              <div className="flex-1 bg-stone-950/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center border border-stone-700/50">
                <span className="text-[10px] uppercase text-stone-500 font-bold">
                  {t("str").slice(0, 3)}
                </span>
                <span className="text-sm font-bold text-stone-300">
                  {hero.stats.str}
                </span>
              </div>
              <div className="flex-1 bg-stone-950/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center border border-stone-700/50">
                <span className="text-[10px] uppercase text-stone-500 font-bold">
                  {t("dex").slice(0, 3)}
                </span>
                <span className="text-sm font-bold text-stone-300">
                  {hero.stats.dex}
                </span>
              </div>
              <div className="flex-1 bg-stone-950/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center border border-stone-700/50">
                <span className="text-[10px] uppercase text-stone-500 font-bold">
                  {t("int").slice(0, 3)}
                </span>
                <span className="text-sm font-bold text-stone-300">
                  {hero.stats.int}
                </span>
              </div>
            </div>
          </div>
        ))}

        {heroes.length === 0 && (
          <div className="col-span-full text-center py-10 opacity-50">
            <FileJson size={48} className="mx-auto mb-4 text-stone-600" />
            <p>{t("noHeroes")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
