import { useState } from "react";
import {
  Book,
  Users,
  Shield,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Sword,
} from "lucide-react";
import { RACES, CLASSES, CONDITIONS, COMBAT_ACTIONS } from "../data/srd";
import { useLanguage } from "../context/LanguageContext";

export function Compendium() {
  const { t } = useLanguage();
  const [section, setSection] = useState("races"); // 'races', 'classes', 'conditions', 'actions'
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="pb-24 pt-6 px-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-stone-100 mb-6 flex items-center gap-3">
        <Book className="text-yellow-500" /> {t("navCompendium")}
      </h1>

      {/* Selector de Categoría */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSection("races")}
          className={`px-4 py-2 rounded-full border text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            section === "races"
              ? "bg-yellow-500 border-yellow-500 text-stone-900"
              : "bg-stone-800 border-stone-700 text-stone-400"
          }`}
        >
          <Users size={14} /> {t("races")}
        </button>
        <button
          onClick={() => setSection("classes")}
          className={`px-4 py-2 rounded-full border text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            section === "classes"
              ? "bg-yellow-500 border-yellow-500 text-stone-900"
              : "bg-stone-800 border-stone-700 text-stone-400"
          }`}
        >
          <Shield size={14} /> {t("classes")}
        </button>
        <button
          onClick={() => setSection("conditions")}
          className={`px-4 py-2 rounded-full border text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            section === "conditions"
              ? "bg-yellow-500 border-yellow-500 text-stone-900"
              : "bg-stone-800 border-stone-700 text-stone-400"
          }`}
        >
          <AlertTriangle size={14} /> {t("conditions")}
        </button>
        <button
          onClick={() => setSection("actions")}
          className={`px-4 py-2 rounded-full border text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            section === "actions"
              ? "bg-yellow-500 border-yellow-500 text-stone-900"
              : "bg-stone-800 border-stone-700 text-stone-400"
          }`}
        >
          <Sword size={14} /> Actions
        </button>
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        {section === "races" &&
          RACES.map((race) => (
            <div
              key={race.id}
              className="bg-stone-800 border border-stone-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(race.id)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-stone-700/50 transition"
              >
                <span className="font-bold text-stone-200">{race.name}</span>
                {expandedId === race.id ? (
                  <ChevronDown size={16} className="text-yellow-500" />
                ) : (
                  <ChevronRight size={16} className="text-stone-500" />
                )}
              </button>
              {expandedId === race.id && (
                <div className="p-4 pt-0 text-sm text-stone-400 border-t border-stone-700/50 bg-stone-900/30">
                  <p className="mb-2 italic">{race.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <span className="text-stone-500">
                      Speed: {race.speed}ft
                    </span>
                    <span className="text-stone-500">Size: {race.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {race.traits.map((tr) => (
                      <span
                        key={tr}
                        className="bg-stone-700 text-stone-300 px-2 py-1 rounded text-xs"
                      >
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        {section === "classes" &&
          CLASSES.map((cls) => (
            <div
              key={cls.id}
              className="bg-stone-800 border border-stone-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(cls.id)}
                className="w-full p-4 flex justify-between items-center text-left hover:bg-stone-700/50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-200">{cls.name}</span>
                  <span className="text-[10px] bg-stone-900 px-2 py-1 rounded text-stone-500">
                    Hit Die: {cls.hitDie}
                  </span>
                </div>
                {expandedId === cls.id ? (
                  <ChevronDown size={16} className="text-yellow-500" />
                ) : (
                  <ChevronRight size={16} className="text-stone-500" />
                )}
              </button>
              {expandedId === cls.id && (
                <div className="p-4 pt-0 text-sm text-stone-400 border-t border-stone-700/50 bg-stone-900/30">
                  <p className="mb-1">
                    <strong className="text-stone-300">Primary:</strong>{" "}
                    {cls.primaryStat.toUpperCase()}
                  </p>
                  <p className="mb-1">
                    <strong className="text-stone-300">Saves:</strong>{" "}
                    {cls.saves.join(", ")}
                  </p>
                  <p className="mb-2">
                    <strong className="text-stone-300">SRD Subclass:</strong>{" "}
                    {cls.srdSubclass}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cls.proficiencies.map((prof) => (
                      <span
                        key={prof}
                        className="bg-stone-700 text-stone-300 px-2 py-1 rounded text-xs"
                      >
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        {section === "conditions" &&
          CONDITIONS.map((cond) => (
            <div
              key={cond.id}
              className="bg-stone-800 border border-stone-700 rounded-xl p-4"
            >
              <h3 className="font-bold text-red-400 mb-1 flex items-center gap-2">
                <AlertTriangle size={14} /> {cond.name}
              </h3>
              <p className="text-sm text-stone-400">{cond.desc}</p>
            </div>
          ))}

        {section === "actions" &&
          COMBAT_ACTIONS.map((act) => (
            <div
              key={act.id}
              className="bg-stone-800 border border-stone-700 rounded-xl p-4"
            >
              <h3 className="font-bold text-yellow-500 mb-1 flex items-center gap-2">
                <Sword size={14} /> {act.name}
              </h3>
              <p className="text-sm text-stone-400">{act.desc}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
